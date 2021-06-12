import {BackSide, Color, IcosahedronGeometry, Mesh, MeshStandardMaterial} from "three";

import {gui} from "../../systems/gui";

const backgroundParams = {
    color: 0xff0000,
    roughness: 0.85,
    metalness: 0.25,
    x: 0,
    y: 0,
    z: 0,
    animationSpeed: 1
};

const setupGuiForBackground = (background, backgroundParams, folderName = "Background") => {
    const backgroundFolder = gui.addFolder(folderName);

    // Material
    backgroundFolder.addColor(backgroundParams, 'color').onChange(() => {
        background.material.color = new Color(backgroundParams.color);
    });
    backgroundFolder.add(backgroundParams, "roughness", 0, 1, 0.01).onChange(() => {
        background.material.roughness = backgroundParams.roughness;
    });
    backgroundFolder.add(backgroundParams, "metalness", 0, 1, 0.01).onChange(() => {
        background.material.metalness = backgroundParams.metalness;
    });

    // Position
    backgroundFolder.add(backgroundParams, "x", -300, 300, 1).onChange(() => {
        background.position.x = backgroundParams.x;
    });
    backgroundFolder.add(backgroundParams, "y", -300, 300, 1).onChange(() => {
        background.position.y = backgroundParams.y;
    });
    backgroundFolder.add(backgroundParams, "z", -300, 300, 1).onChange(() => {
        background.position.z = backgroundParams.z;
    });

    // Animation
    backgroundFolder.add(backgroundParams, "animationSpeed", 1, 10);
}

function loadBackground() {
    const geometry = new IcosahedronGeometry(600);
    const material = new MeshStandardMaterial({
        side: BackSide,
        flatShading: true,
        color: backgroundParams.color,
        roughness: backgroundParams.roughness,
        metalness: backgroundParams.metalness
    });

    const background = new Mesh(geometry, material);
    background.position.set(backgroundParams.x, backgroundParams.y, backgroundParams.z);

    background.tick = (event) => {
        const rotationCoefficient = event.elapsedTime * 0.1 * backgroundParams.animationSpeed;
        background.rotation.set(rotationCoefficient, rotationCoefficient, rotationCoefficient);
    }

    setupGuiForBackground(background, backgroundParams)

    return background;
}

export { loadBackground }