import {PointLight, Color, PointLightHelper} from 'three';

import {gui} from "../systems/gui";

const pointLight1Params = {
  color: 0xE7F7ED,
  intensity: 1.5,
  distance: 1000,
  decay: 2,
  x: 300,
  y: 230,
  z: 0
}
const pointLight2Params = {
  color: 0x9CBAFE,
  intensity: 2,
  distance: 1000,
  decay: 2,
  x: 35,
  y: -100,
  z: 200
}

const setupGuiForPointLight = (pointLight, pointLightParams, folderName = "Point light") => {
  const pointLightFolder = gui.addFolder(folderName);

  // Visibility
  pointLightFolder.add(pointLight, 'visible');

  // Light params
  pointLightFolder.addColor(pointLightParams, 'color').onChange(() => {
    pointLight.color = new Color(pointLightParams.color);
  });
  pointLightFolder.add(pointLightParams, 'intensity', 0, 1000, 0.01).onChange(() => {
    pointLight.intensity = pointLightParams.intensity;
  });
  pointLightFolder.add(pointLight, 'distance', 0, 1000);
  pointLightFolder.add(pointLight, 'decay', 1, 2);

  // Position
  pointLightFolder.add(pointLightParams, 'x', -300, 300).onChange(() => {
    pointLight.position.x = pointLightParams.x
  });
  pointLightFolder.add(pointLightParams, 'y', -300, 300).onChange(() => {
    pointLight.position.y = pointLightParams.y
  });
  pointLightFolder.add(pointLightParams, 'z', -300, 300).onChange(() => {
    pointLight.position.z = pointLightParams.z
  });
}

const setupPointLight = (params, index = 0) => {
  const pointLight = new PointLight(params.color, params.intensity, params.distance, params.decay);
  pointLight.position.set(params.x, params.y, params.z);

  setupGuiForPointLight(pointLight, params, `Point light #${index + 1}`);

  const pointLightHelper = new PointLightHelper(pointLight, 15);

  return { pointLight, pointLightHelper }
}

function createLights() {
  const [
    { pointLight: pointLight1, pointLightHelper: pointLight1Helper },
    { pointLight: pointLight2, pointLightHelper: pointLight2Helper }
  ] = [
    pointLight1Params,
    pointLight2Params
  ].map(setupPointLight);

  return { pointLight1, pointLight2, pointLight1Helper, pointLight2Helper };
}

export { createLights };
