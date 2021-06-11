import { Color, Scene } from 'three';

function createScene(container) {
  const scene = new Scene();

  const backgroundColor = 'black';
  scene.background = new Color(backgroundColor);
  container.style.backgroundColor = backgroundColor;

  return scene;
}

export { createScene };
