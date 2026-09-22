import * as THREE from 'three';
import { Lead, LeadStage } from '../types/pipeline';
import { PIPELINE_STAGES, STAGE_MAP } from '../data/pipelineConfig';
import { AI_AGENTS } from '../data/agentsData';

interface LeadMeshInstance {
  meshGroup: THREE.Group;
  coreMesh: THREE.Mesh;
  ringMesh: THREE.Mesh;
  leadId: string;
  currentPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  transitionProgress: number; // 0 to 1
  isTransitioning: boolean;
  baseStage: LeadStage;
  floatOffset: number;
}

export class LeadNodeManager {
  public group: THREE.Group;
  private leadInstances: Map<string, LeadMeshInstance> = new Map();
  private sharedCoreGeom: THREE.IcosahedronGeometry;
  private sharedRingGeom: THREE.RingGeometry;
  private selectionRing: THREE.Mesh;
  private currentSelectedLeadId: string | null = null;
  private disposables: Array<THREE.BufferGeometry | THREE.Material> = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'LeadNodeManagerGroup';

    // Shared geometries to maximize performance & reduce draw calls
    this.sharedCoreGeom = new THREE.IcosahedronGeometry(0.75, 1);
    this.sharedRingGeom = new THREE.RingGeometry(1.0, 1.25, 24);
    this.disposables.push(this.sharedCoreGeom, this.sharedRingGeom);

    // Dynamic selection ring
    const selMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    this.selectionRing = new THREE.Mesh(
      new THREE.RingGeometry(1.4, 1.65, 32),
      selMat
    );
    this.selectionRing.rotation.x = -Math.PI / 2;
    this.selectionRing.visible = false;
    this.group.add(this.selectionRing);
    this.disposables.push(this.selectionRing.geometry, selMat);
  }

  // Synchronize 3D meshes with updated leads from store
  public syncLeads(leads: Lead[], selectedLeadId: string | null) {
    const activeLeadIds = new Set(leads.map((l) => l.id));

    // Remove old meshes no longer in state
    for (const [id, instance] of this.leadInstances.entries()) {
      if (!activeLeadIds.has(id)) {
        this.group.remove(instance.meshGroup);
        this.leadInstances.delete(id);
      }
    }

    // Assign slots within zones so leads don't overlap
    const stageCounters: Record<LeadStage, number> = {
      intake: 0,
      qualification: 0,
      routing: 0,
      followup: 0,
      deal: 0,
      won: 0,
    };

    leads.forEach((lead) => {
      const stageConfig = STAGE_MAP[lead.currentStage] || PIPELINE_STAGES[0];
      const slotIndex = stageCounters[lead.currentStage]++;

      // Calculate arranged cluster coordinates within the zone
      const radius = 2.2 + (slotIndex % 3) * 1.5;
      const angle = (slotIndex * 1.35) % (Math.PI * 2);
      const targetWorldPos = new THREE.Vector3(
        stageConfig.worldPosition[0] + Math.cos(angle) * radius,
        0.5 + (slotIndex % 2) * 0.4,
        stageConfig.worldPosition[2] + Math.sin(angle) * radius
      );

      let instance = this.leadInstances.get(lead.id);

      if (!instance) {
        // Create new 3D lead node
        instance = this.createLeadMesh(lead, targetWorldPos);
        this.leadInstances.set(lead.id, instance);
      } else {
        // Check if stage changed -> trigger motion transition
        if (instance.baseStage !== lead.currentStage) {
          instance.baseStage = lead.currentStage;
          instance.targetPos.copy(targetWorldPos);
          instance.transitionProgress = 0;
          instance.isTransitioning = true;
        } else if (!instance.isTransitioning) {
          // Subtle adjustment if needed
          instance.targetPos.copy(targetWorldPos);
        }

        // Update colors based on agent or priority
        this.updateMeshAppearance(instance, lead);
      }

      // Highlight selected lead mesh by scaling up
      const isSelected = lead.id === selectedLeadId;
      instance.meshGroup.scale.setScalar(isSelected ? 1.35 : 1.0);
    });

    this.currentSelectedLeadId = selectedLeadId;
  }

  private createLeadMesh(lead: Lead, initialPos: THREE.Vector3): LeadMeshInstance {
    const meshGroup = new THREE.Group();
    meshGroup.position.copy(initialPos);
    meshGroup.name = `LeadNode-${lead.id}`;

    // Color derivation
    const colorHex = lead.assignedAgentId
      ? AI_AGENTS[lead.assignedAgentId]?.colorHex || '#06B6D4'
      : '#38BDF8';

    // 1. Faceted Core
    const coreMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      emissive: new THREE.Color(colorHex).multiplyScalar(0.4),
      roughness: 0.25,
      metalness: 0.8,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(this.sharedCoreGeom, coreMat);
    coreMesh.userData = { leadId: lead.id };
    meshGroup.add(coreMesh);

    // 2. Health & Priority Ring around base
    const ringColor = lead.priority === 'critical' ? 0xef4444 : lead.priority === 'high' ? 0xf59e0b : 0x06b6d4;
    const ringMat = new THREE.MeshBasicMaterial({
      color: ringColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const ringMesh = new THREE.Mesh(this.sharedRingGeom, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -0.5;
    meshGroup.add(ringMesh);

    this.group.add(meshGroup);

    return {
      meshGroup,
      coreMesh,
      ringMesh,
      leadId: lead.id,
      currentPos: initialPos.clone(),
      targetPos: initialPos.clone(),
      transitionProgress: 1.0,
      isTransitioning: false,
      baseStage: lead.currentStage,
      floatOffset: Math.random() * Math.PI * 2,
    };
  }

  private updateMeshAppearance(instance: LeadMeshInstance, lead: Lead) {
    const colorHex = lead.assignedAgentId
      ? AI_AGENTS[lead.assignedAgentId]?.colorHex || '#06B6D4'
      : '#38BDF8';

    const mat = instance.coreMesh.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.color.set(colorHex);
      mat.emissive.set(colorHex).multiplyScalar(0.4);
    }
  }

  // Animation Loop Update
  public update(delta: number, elapsed: number) {
    const transitionSpeed = 1.4; // seconds to travel between zones

    this.leadInstances.forEach((instance) => {
      // 1. Position interpolation if transitioning between stages
      if (instance.isTransitioning) {
        instance.transitionProgress += delta * transitionSpeed;

        if (instance.transitionProgress >= 1.0) {
          instance.transitionProgress = 1.0;
          instance.isTransitioning = false;
          instance.currentPos.copy(instance.targetPos);
        } else {
          // Smooth easeOutCubic curve
          const t = instance.transitionProgress;
          const ease = 1 - Math.pow(1 - t, 3);
          instance.currentPos.lerpVectors(instance.currentPos, instance.targetPos, ease);

          // Arc upward slightly during flight
          const arcHeight = Math.sin(t * Math.PI) * 2.5;
          instance.meshGroup.position.y = instance.currentPos.y + arcHeight;
        }
      }

      // 2. Idle hover oscillation and rotation
      const floatY = Math.sin(elapsed * 2 + instance.floatOffset) * 0.15;
      instance.meshGroup.position.x = instance.currentPos.x;
      instance.meshGroup.position.z = instance.currentPos.z;
      if (!instance.isTransitioning) {
        instance.meshGroup.position.y = instance.currentPos.y + floatY;
      }

      // Slow technical rotation
      instance.coreMesh.rotation.y += delta * 0.8;
      instance.coreMesh.rotation.x += delta * 0.4;
      instance.ringMesh.rotation.z -= delta * 0.6;
    });

    // Animate selection ring dynamically tracking the selected lead
    if (this.currentSelectedLeadId && this.leadInstances.has(this.currentSelectedLeadId)) {
      const selectedInstance = this.leadInstances.get(this.currentSelectedLeadId)!;
      this.selectionRing.visible = true;
      this.selectionRing.position.set(
        selectedInstance.meshGroup.position.x,
        selectedInstance.meshGroup.position.y - 0.25,
        selectedInstance.meshGroup.position.z
      );
      this.selectionRing.rotation.z += delta * 2.0;
    } else {
      this.selectionRing.visible = false;
    }
  }

  public getLeadMesh(leadId: string): THREE.Group | undefined {
    return this.leadInstances.get(leadId)?.meshGroup;
  }

  public getIntersectableObjects(): THREE.Object3D[] {
    const objects: THREE.Object3D[] = [];
    this.leadInstances.forEach((inst) => {
      objects.push(inst.coreMesh);
    });
    return objects;
  }

  public dispose() {
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
    this.leadInstances.forEach((inst) => {
      (inst.coreMesh.material as THREE.Material).dispose();
      (inst.ringMesh.material as THREE.Material).dispose();
    });
    this.leadInstances.clear();
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }
  }
}
