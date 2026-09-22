import * as THREE from 'three';
import { LeadNodeManager } from './LeadNodeManager';

export class InteractionManager {
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private camera: THREE.Camera;
  private leadNodeManager: LeadNodeManager;
  private domElement: HTMLElement | null = null;

  public onHoverLead: ((leadId: string | null, screenCoords: { x: number; y: number } | null) => void) | null = null;
  public onSelectLead: ((leadId: string) => void) | null = null;

  private hoveredLeadId: string | null = null;

  private pointerDownPos = { x: 0, y: 0 };

  constructor(camera: THREE.Camera, leadNodeManager: LeadNodeManager) {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.camera = camera;
    this.leadNodeManager = leadNodeManager;
  }

  public attach(domElement: HTMLElement) {
    this.domElement = domElement;
    domElement.addEventListener('pointerdown', this.handlePointerDown);
    domElement.addEventListener('pointermove', this.handlePointerMove);
    domElement.addEventListener('click', this.handleClick);
  }

  public detach() {
    if (this.domElement) {
      this.domElement.removeEventListener('pointerdown', this.handlePointerDown);
      this.domElement.removeEventListener('pointermove', this.handlePointerMove);
      this.domElement.removeEventListener('click', this.handleClick);
      this.domElement = null;
    }
  }

  private handlePointerDown = (event: PointerEvent) => {
    this.pointerDownPos = { x: event.clientX, y: event.clientY };
  };

  private handlePointerMove = (event: PointerEvent) => {
    if (!this.domElement) return;

    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersectables = this.leadNodeManager.getIntersectableObjects();
    const intersects = this.raycaster.intersectObjects(intersectables, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const leadId = hit.object.userData.leadId;
      if (leadId) {
        if (this.hoveredLeadId !== leadId) {
          this.hoveredLeadId = leadId;
          this.domElement.style.cursor = 'pointer';
        }
        this.onHoverLead?.(leadId, { x: event.clientX, y: event.clientY });
        return;
      }
    }

    if (this.hoveredLeadId !== null) {
      this.hoveredLeadId = null;
      if (this.domElement) this.domElement.style.cursor = 'grab';
      this.onHoverLead?.(null, null);
    }
  };

  private handleClick = (event: MouseEvent) => {
    if (!this.domElement) return;

    // Disambiguate orbit drag from click selection
    const dx = event.clientX - this.pointerDownPos.x;
    const dy = event.clientY - this.pointerDownPos.y;
    if (Math.hypot(dx, dy) > 8) return;

    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersectables = this.leadNodeManager.getIntersectableObjects();
    const intersects = this.raycaster.intersectObjects(intersectables, false);

    if (intersects.length > 0) {
      const leadId = intersects[0].object.userData.leadId;
      if (leadId) {
        this.onSelectLead?.(leadId);
      }
    }
  };
}
