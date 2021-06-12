import { loadBackground } from './components/background/background.js';
import { loadSlicedCube } from './components/slicedCube/slicedCube.js';
import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
// import { loadAxesHelper } from "./components/axesHelper/axesHelper";

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

    const {
      pointLight1,
      pointLight2,
      // pointLight1Helper,
      // pointLight2Helper
    } = createLights();
    this.#scene.add(
        pointLight1,
        pointLight2,
        // pointLight1Helper,
        // pointLight2Helper
    );

    new Resizer(container, this.#camera, this.#renderer);
  }

  async init() {
    const background = loadBackground();
    const slicedCube = loadSlicedCube();
    // const axesHelper = loadAxesHelper();

    this.#scene.add(
        background,
        slicedCube,
        // axesHelper
    );
    this.#loop.updatables.push(background, slicedCube);
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
