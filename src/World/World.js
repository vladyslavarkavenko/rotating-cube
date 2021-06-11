import { loadBirds } from './components/birds/birds.js';
import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

class World {
  #renderer;
  #scene;
  #camera;
  #loop;
  #controls;

  constructor(container) {
    this.#renderer = createRenderer();
    this.#scene = createScene(container);
    container.append(this.#renderer.domElement);

    this.#camera = createCamera();
    this.#loop = new Loop(this.#camera, this.#scene, this.#renderer);

    this.#controls = createControls(this.#camera, this.#renderer.domElement);
    this.#loop.updatables.push(this.#controls);

    const { ambientLight, mainLight } = createLights();
    this.#scene.add(ambientLight, mainLight);

    new Resizer(container, this.#camera, this.#renderer);
  }

  async init() {
    const { parrot, flamingo, stork } = await loadBirds();

    this.#controls.target.copy(parrot.position);

    this.#loop.updatables.push(parrot, flamingo, stork);
    this.#scene.add(parrot, flamingo, stork);
  }

  render() {
    this.#renderer.render(this.#scene, this.#camera);
  }

  start() {
    this.#loop.start();
  }

  stop() {
    this.#loop.stop();
  }
}

export { World };
