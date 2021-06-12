import { PerspectiveCamera } from 'three';
import {degToRad} from "three/src/math/MathUtils";

function createCamera() {
  const camera = new PerspectiveCamera(50, 1, 0.1, 1000);

  camera.position.set(200, 150, 130);
  camera.rotation.set(degToRad(-40), degToRad(50), degToRad(33));

  return camera;
}

export { createCamera };
