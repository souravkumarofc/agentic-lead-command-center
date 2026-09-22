import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { Lighting } from './Lighting';
import { EnvironmentGrid } from './EnvironmentGrid';
import { ZoneManager } from './ZoneManager';
import { FlowLineManager } from './FlowLineManager';
import { LeadNodeManager } from './LeadNodeManager';
import { InteractionManager } from './InteractionManager';
import { Lead, LeadStage } from '../types/pipeline';

export class SceneManager {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private cameraRig: CameraRig;
  private lighting: Lighting;
  private grid: EnvironmentGrid;
  private zoneManager: ZoneManager;
  private flowLineManager: FlowLineManager;
  private leadNodeManager: LeadNodeManager;
  private interactionManager: InteractionManager;

  private clock: THREE.Clock;
  private animationFrameId: number | null = null;
  private isDisposed = false;

  constructor(
    container: HTMLElement,
    onHoverLead: (leadId: string | null, screenCoords: { x: number; y: number } | null) => void,
    onSelectLead: (leadId: string) => void
  ) {
    this.container = container;
    this.clock = new THREE.Clock();

    // 1. Scene with dark cyber fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070a0f);
    this.scene.fog = new THREE.FogExp2(0x070a0f, 0.007);

    // 2. Camera Rig
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    this.cameraRig = new CameraRig(width, height);
    this.cameraRig.attachControls(container);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    container.appendChild(this.renderer.domElement);
    container.style.cursor = 'grab';

    // 4. Subsystems
    this.lighting = new Lighting();
    this.scene.add(this.lighting.group);

    this.grid = new EnvironmentGrid();
    this.scene.add(this.grid.group);

    this.zoneManager = new ZoneManager();
    this.scene.add(this.zoneManager.group);

    this.flowLineManager = new FlowLineManager();
    this.scene.add(this.flowLineManager.group);

    this.leadNodeManager = new LeadNodeManager();
    this.scene.add(this.leadNodeManager.group);

    // 5. Interaction Manager
    this.interactionManager = new InteractionManager(this.cameraRig.camera, this.leadNodeManager);
    this.interactionManager.onHoverLead = onHoverLead;
    this.interactionManager.onSelectLead = onSelectLead;
    this.interactionManager.attach(this.renderer.domElement);

    // 6. Resize listener
    window.addEventListener('resize', this.onWindowResize);

    // 7. Start render loop
    this.startLoop();
  }

  private startLoop() {
    const loop = () => {
      if (this.isDisposed) return;
      this.animationFrameId = requestAnimationFrame(loop);

      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      // Update modules
      this.cameraRig.update(delta);
      this.flowLineManager.update(delta);
      this.leadNodeManager.update(delta, elapsed);

      this.renderer.render(this.scene, this.cameraRig.camera);
    };

    loop();
  }

  public syncState(
    leads: Lead[],
    selectedLeadId: string | null,
    stageDist: Record<LeadStage, number>,
    focusedZone: LeadStage | null
  ) {
    if (this.isDisposed) return;

    this.leadNodeManager.syncLeads(leads, selectedLeadId);
    this.zoneManager.updateZoneCounts(stageDist);
    this.zoneManager.highlightZone(focusedZone);
  }

  public setFocusedZone(stageId: LeadStage | null) {
    this.cameraRig.focusZone(stageId);
  }

  public focusLead(leadId: string) {
    const mesh = this.leadNodeManager.getLeadMesh(leadId);
    if (mesh) {
      this.cameraRig.focusLead(mesh.position);
    }
  }

  public resetCamera() {
    this.cameraRig.resetOverview();
  }

  private onWindowResize = () => {
    if (this.isDisposed || !this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.cameraRig.resize(width, height);
    this.renderer.setSize(width, height);
  };

  public dispose() {
    this.isDisposed = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    window.removeEventListener('resize', this.onWindowResize);

    this.interactionManager.detach();
    this.cameraRig.detachControls();

    this.lighting.dispose();
    this.grid.dispose();
    this.zoneManager.dispose();
    this.flowLineManager.dispose();
    this.leadNodeManager.dispose();

    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
