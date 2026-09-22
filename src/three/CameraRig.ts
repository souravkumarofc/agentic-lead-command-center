import * as THREE from 'three';
import { STAGE_MAP } from '../data/pipelineConfig';
import { LeadStage } from '../types/pipeline';

export class CameraRig {
  public camera: THREE.PerspectiveCamera;
  public targetLookAt: THREE.Vector3;
  public currentLookAt: THREE.Vector3;
  public targetPosition: THREE.Vector3;
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private domElement: HTMLElement | null = null;

  // Preset constants
  private readonly DEFAULT_POS = new THREE.Vector3(0, 32, 58);
  private readonly DEFAULT_LOOKAT = new THREE.Vector3(0, 0, 0);

  constructor(width: number, height: number) {
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    this.targetPosition = this.DEFAULT_POS.clone();
    this.camera.position.copy(this.targetPosition);

    this.targetLookAt = this.DEFAULT_LOOKAT.clone();
    this.currentLookAt = this.DEFAULT_LOOKAT.clone();
    this.camera.lookAt(this.currentLookAt);
  }

  public attachControls(domElement: HTMLElement) {
    this.domElement = domElement;
    domElement.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    domElement.addEventListener('wheel', this.onWheel, { passive: true });
  }

  public detachControls() {
    if (this.domElement) {
      this.domElement.removeEventListener('pointerdown', this.onPointerDown);
      this.domElement.removeEventListener('wheel', this.onWheel);
    }
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.domElement = null;
  }

  private onPointerDown = (e: PointerEvent) => {
    if (e.button === 0 || e.button === 2) {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.isDragging) return;

    const deltaX = e.clientX - this.previousMousePosition.x;
    const deltaY = e.clientY - this.previousMousePosition.y;

    // Pan / orbit around current target
    const panSpeed = 0.003;
    const offset = this.targetPosition.clone().sub(this.targetLookAt);

    // Horizontal orbit
    const angleX = -deltaX * panSpeed;
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angleX);

    // Vertical pitch with clamping
    offset.y = Math.max(12, Math.min(65, offset.y + deltaY * 0.08));

    this.targetPosition.copy(this.targetLookAt).add(offset);
    this.previousMousePosition = { x: e.clientX, y: e.clientY };
  };

  private onPointerUp = () => {
    this.isDragging = false;
  };

  private onWheel = (e: WheelEvent) => {
    const zoomFactor = e.deltaY * 0.03;
    const dir = this.targetPosition.clone().sub(this.targetLookAt).normalize();
    const currentDist = this.targetPosition.distanceTo(this.targetLookAt);
    const newDist = Math.max(25, Math.min(120, currentDist + zoomFactor));
    this.targetPosition.copy(this.targetLookAt).add(dir.multiplyScalar(newDist));
  };

  public focusZone(stageId: LeadStage | null) {
    if (!stageId) {
      this.resetOverview();
      return;
    }

    const config = STAGE_MAP[stageId];
    if (config) {
      const [x, y, z] = config.worldPosition;
      this.targetLookAt.set(x, y + 1, z);
      this.targetPosition.set(x, y + 20, z + 32);
    }
  }

  public focusLead(worldPosition: THREE.Vector3) {
    this.targetLookAt.set(worldPosition.x, worldPosition.y, worldPosition.z);
    this.targetPosition.set(worldPosition.x, worldPosition.y + 12, worldPosition.z + 20);
  }

  public resetOverview() {
    this.targetPosition.copy(this.DEFAULT_POS);
    this.targetLookAt.copy(this.DEFAULT_LOOKAT);
  }

  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public update(delta: number) {
    // Smooth camera damping
    const lerpSpeed = Math.min(1, delta * 4.5);
    this.camera.position.lerp(this.targetPosition, lerpSpeed);
    this.currentLookAt.lerp(this.targetLookAt, lerpSpeed);
    this.camera.lookAt(this.currentLookAt);
  }
}
