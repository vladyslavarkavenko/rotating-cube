import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);
  controls.minDistance = 100;
  controls.maxDistance = 400;

  controls.enableDamping = true;

  // forward controls.update to our custom .tick method
  controls.tick = () => { controls.update(); }

  return controls;
}

export { createControls };
