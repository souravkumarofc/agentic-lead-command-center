import * as THREE from 'three';
import { PIPELINE_STAGES } from '../data/pipelineConfig';

export class FlowLineManager {
  public group: THREE.Group;
  private pulseSprites: THREE.Mesh[] = [];
  private curves: THREE.QuadraticBezierCurve3[] = [];
  private disposables: Array<THREE.BufferGeometry | THREE.Material> = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'FlowLineGroup';
    this.createConduits();
  }

  private createConduits() {
    for (let i = 0; i < PIPELINE_STAGES.length - 1; i++) {
      const fromPos = new THREE.Vector3(...PIPELINE_STAGES[i].worldPosition);
      const toPos = new THREE.Vector3(...PIPELINE_STAGES[i + 1].worldPosition);

      // Midpoint arched slightly upward
      const midPos = new THREE.Vector3(
        (fromPos.x + toPos.x) / 2,
        fromPos.y + 2.5,
        (fromPos.z + toPos.z) / 2
      );

      const curve = new THREE.QuadraticBezierCurve3(fromPos, midPos, toPos);
      this.curves.push(curve);

      // Render static energy tube
      const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.15, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x0284c7,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        transparent: true,
        opacity: 0.6,
      });
      const tube = new THREE.Mesh(tubeGeom, tubeMat);
      this.group.add(tube);
      this.disposables.push(tubeGeom, tubeMat);

      // Create traveling pulse bead
      const pulseGeom = new THREE.SphereGeometry(0.35, 12, 12);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
      pulseMesh.userData = { curveIndex: i, progress: (i * 0.2) % 1.0 };
      this.group.add(pulseMesh);
      this.pulseSprites.push(pulseMesh);
      this.disposables.push(pulseGeom, pulseMat);
    }
  }

  public update(delta: number) {
    const speed = 0.35;
    this.pulseSprites.forEach((pulse) => {
      let progress = pulse.userData.progress + delta * speed;
      if (progress > 1.0) {
        progress = 0;
      }
      pulse.userData.progress = progress;

      const curve = this.curves[pulse.userData.curveIndex];
      if (curve) {
        const pt = curve.getPoint(progress);
        pulse.position.copy(pt);
      }
    });
  }

  public dispose() {
    this.disposables.forEach((item) => item.dispose());
    this.disposables = [];
    this.pulseSprites = [];
    this.curves = [];
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }
  }
}
