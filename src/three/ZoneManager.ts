import * as THREE from 'three';
import { PIPELINE_STAGES } from '../data/pipelineConfig';
import { LeadStage, PipelineZoneConfig } from '../types/pipeline';

export class ZoneManager {
  public group: THREE.Group;
  private zoneMeshes: Map<LeadStage, THREE.Group> = new Map();
  private labelSprites: Map<LeadStage, { sprite: THREE.Sprite; canvas: HTMLCanvasElement; context: CanvasRenderingContext2D; texture: THREE.CanvasTexture }> = new Map();
  private disposables: Array<THREE.BufferGeometry | THREE.Material | THREE.Texture> = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'ZoneManagerGroup';
    this.createZones();
  }

  private createZones() {
    PIPELINE_STAGES.forEach((stage) => {
      const zoneGroup = new THREE.Group();
      zoneGroup.position.set(...stage.worldPosition);
      zoneGroup.name = `Zone-${stage.id}`;

      // 1. Zone Base Platform (Dark chamfered cyber pad)
      const platformGeom = new THREE.CylinderGeometry(8, 8.5, 0.6, 32);
      const platformMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.8,
        metalness: 0.3,
      });
      const platform = new THREE.Mesh(platformGeom, platformMat);
      platform.position.y = -1.6;
      zoneGroup.add(platform);
      this.disposables.push(platformGeom, platformMat);

      // 2. Zone Inner Active Floor (slightly recessed, color tinted)
      const innerGeom = new THREE.CylinderGeometry(7.2, 7.2, 0.65, 32);
      const innerMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(stage.colorHex).multiplyScalar(0.12),
        roughness: 0.9,
        metalness: 0.1,
      });
      const inner = new THREE.Mesh(innerGeom, innerMat);
      inner.position.y = -1.55;
      zoneGroup.add(inner);
      this.disposables.push(innerGeom, innerMat);

      // 3. Technical Glowing Perimeter Ring
      const ringGeom = new THREE.RingGeometry(7.5, 7.8, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: stage.colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -1.25;
      zoneGroup.add(ring);
      this.disposables.push(ringGeom, ringMat);

      // 4. Special Sub-structures per zone
      this.buildZoneSpecificDetails(zoneGroup, stage);

      // 5. Holographic 3D Floating Stage Label
      const label = this.createFloatingLabel(stage);
      zoneGroup.add(label.sprite);
      this.labelSprites.set(stage.id, label);

      this.group.add(zoneGroup);
      this.zoneMeshes.set(stage.id, zoneGroup);
    });
  }

  private buildZoneSpecificDetails(zoneGroup: THREE.Group, stage: PipelineZoneConfig) {
    if (stage.id === 'intake') {
      // 4 tributary intake conduits representing WhatsApp, Web, FB, Email
      const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
      const colors = [0x25d366, 0x06b6d4, 0x3b82f6, 0xa855f7];
      angles.forEach((angle, i) => {
        const conduitGeom = new THREE.BoxGeometry(0.8, 0.4, 4);
        const conduitMat = new THREE.MeshBasicMaterial({ color: colors[i], wireframe: true });
        const conduit = new THREE.Mesh(conduitGeom, conduitMat);
        conduit.position.set(Math.cos(angle) * 7.5, -1.3, Math.sin(angle) * 7.5);
        conduit.rotation.y = -angle;
        zoneGroup.add(conduit);
        this.disposables.push(conduitGeom, conduitMat);
      });
    } else if (stage.id === 'routing') {
      // 4 Agent Satellite Nodes around the perimeter
      const agentColors = [0x06b6d4, 0x8b5cf6, 0x10b981, 0xf59e0b];
      agentColors.forEach((col, idx) => {
        const theta = (idx * Math.PI) / 2 + Math.PI / 4;
        const subGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 16);
        const subMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5 });
        const subMesh = new THREE.Mesh(subGeom, subMat);
        subMesh.position.set(Math.cos(theta) * 5.2, -1.3, Math.sin(theta) * 5.2);
        zoneGroup.add(subMesh);

        // Marker light ring
        const subRingGeom = new THREE.RingGeometry(1.0, 1.3, 16);
        const subRingMat = new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide });
        const subRing = new THREE.Mesh(subRingGeom, subRingMat);
        subRing.rotation.x = -Math.PI / 2;
        subRing.position.set(Math.cos(theta) * 5.2, -1.0, Math.sin(theta) * 5.2);
        zoneGroup.add(subRing);

        this.disposables.push(subGeom, subMat, subRingGeom, subRingMat);
      });
    } else if (stage.id === 'qualification') {
      // Concentric AI Scan Rings
      const scanRingGeom = new THREE.RingGeometry(3.5, 3.7, 32);
      const scanRingMat = new THREE.MeshBasicMaterial({
        color: 0x818cf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const scanRing = new THREE.Mesh(scanRingGeom, scanRingMat);
      scanRing.rotation.x = -Math.PI / 2;
      scanRing.position.y = -1.2;
      zoneGroup.add(scanRing);
      this.disposables.push(scanRingGeom, scanRingMat);
    } else if (stage.id === 'won') {
      // Golden / Emerald Success Pedestal Core
      const winCoreGeom = new THREE.CylinderGeometry(3.0, 3.0, 0.4, 24);
      const winCoreMat = new THREE.MeshStandardMaterial({
        color: 0x059669,
        emissive: 0x047857,
        emissiveIntensity: 0.3,
      });
      const winCore = new THREE.Mesh(winCoreGeom, winCoreMat);
      winCore.position.y = -1.4;
      zoneGroup.add(winCore);
      this.disposables.push(winCoreGeom, winCoreMat);
    }
  }

  private createFloatingLabel(stage: PipelineZoneConfig) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const context = canvas.getContext('2d')!;

    this.renderLabelCanvas(context, stage, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(10, 3.125, 1);
    sprite.position.set(0, 5.5, -5.5);

    this.disposables.push(spriteMat, texture);

    return { sprite, canvas, context, texture };
  }

  private renderLabelCanvas(ctx: CanvasRenderingContext2D, stage: PipelineZoneConfig, count: number) {
    ctx.clearRect(0, 0, 512, 160);

    // Background pill
    ctx.fillStyle = 'rgba(11, 15, 23, 0.85)';
    ctx.strokeStyle = stage.colorHex;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 140, 20);
    ctx.fill();
    ctx.stroke();

    // Stage order & Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(`${stage.order}. ${stage.title.toUpperCase()}`, 30, 65);

    // Subtitle & live count badge
    ctx.fillStyle = stage.colorHex;
    ctx.font = '24px monospace';
    ctx.fillText(`${stage.subtitle}`, 30, 115);

    // Count pill badge
    ctx.fillStyle = stage.colorHex;
    ctx.beginPath();
    ctx.roundRect(380, 40, 100, 60, 12);
    ctx.fill();

    ctx.fillStyle = '#070A0F';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${count}`, 430, 82);
    ctx.textAlign = 'left';
  }

  public updateZoneCounts(stageDistribution: Record<LeadStage, number>) {
    PIPELINE_STAGES.forEach((stage) => {
      const labelData = this.labelSprites.get(stage.id);
      if (labelData) {
        const count = stageDistribution[stage.id] || 0;
        this.renderLabelCanvas(labelData.context, stage, count);
        labelData.texture.needsUpdate = true;
      }
    });
  }

  public highlightZone(stageId: LeadStage | null) {
    PIPELINE_STAGES.forEach((stage) => {
      const group = this.zoneMeshes.get(stage.id);
      if (!group) return;

      const isTarget = stage.id === stageId;
      group.scale.setScalar(isTarget ? 1.08 : 1.0);
    });
  }

  public dispose() {
    this.disposables.forEach((item) => item.dispose());
    this.disposables = [];
    this.zoneMeshes.clear();
    this.labelSprites.clear();
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }
  }
}
