import * as THREE from 'three';

export class Lighting {
  public group: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'LightingGroup';
    this.setupLights();
  }

  private setupLights() {
    // 1. Crisp ambient light with cool cyber undertone
    const ambient = new THREE.AmbientLight(0x0a1526, 2.2);
    this.group.add(ambient);

    // 2. Directional Key Light from above-front
    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 2.0);
    keyLight.position.set(20, 60, 40);
    this.group.add(keyLight);

    // 3. Directional Rim Light with cyan tint for technical edge definition
    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.8);
    rimLight.position.set(-40, -20, -30);
    this.group.add(rimLight);

    // 4. Subtle overhead fill light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    fillLight.position.set(0, 50, 0);
    this.group.add(fillLight);
  }

  public dispose() {
    while (this.group.children.length > 0) {
      const obj = this.group.children[0];
      this.group.remove(obj);
    }
  }
}
