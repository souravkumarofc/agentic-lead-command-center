import * as THREE from 'three';

export class EnvironmentGrid {
  public group: THREE.Group;
  private disposables: Array<THREE.BufferGeometry | THREE.Material> = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'EnvironmentGridGroup';
    this.createGrid();
  }

  private createGrid() {
    // 1. Primary technical coordinate grid
    const size = 180;
    const divisions = 60;
    const gridHelper = new THREE.GridHelper(size, divisions, 0x0ea5e9, 0x1e293b);
    gridHelper.position.y = -2;
    this.group.add(gridHelper);

    if (Array.isArray(gridHelper.material)) {
      gridHelper.material.forEach((m) => this.disposables.push(m));
    } else {
      this.disposables.push(gridHelper.material);
    }
    this.disposables.push(gridHelper.geometry);

    // 2. Center Spine Conduit Line connecting all pipeline stages
    const spineGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-65, -1.9, 0),
      new THREE.Vector3(65, -1.9, 0),
    ]);
    const spineMat = new THREE.LineDashedMaterial({
      color: 0x06b6d4,
      dashSize: 2,
      gapSize: 1,
      linewidth: 2,
    });
    const spine = new THREE.Line(spineGeom, spineMat);
    spine.computeLineDistances();
    this.group.add(spine);
    this.disposables.push(spineGeom, spineMat);

    // 3. Technical boundary ticks along edges
    const tickGeom = new THREE.BufferGeometry();
    const tickPositions: number[] = [];
    for (let x = -60; x <= 60; x += 10) {
      tickPositions.push(x, -1.9, -15);
      tickPositions.push(x, -1.9, -13);
      tickPositions.push(x, -1.9, 13);
      tickPositions.push(x, -1.9, 15);
    }
    tickGeom.setAttribute('position', new THREE.Float32BufferAttribute(tickPositions, 3));
    const tickMat = new THREE.LineBasicMaterial({ color: 0x334155 });
    const ticks = new THREE.LineSegments(tickGeom, tickMat);
    this.group.add(ticks);
    this.disposables.push(tickGeom, tickMat);
  }

  public dispose() {
    this.disposables.forEach((item) => item.dispose());
    this.disposables = [];
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }
  }
}
