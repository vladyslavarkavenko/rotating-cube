import {BoxGeometry, MeshStandardMaterial, Mesh, TextureLoader, Group, Color} from "three";
import {gui} from "../../systems/gui";

const sliceCubeParams = {
    sliceCount: 20,
    animationSpeed: 3
}

const sliceParams = {
    height: 5,
    width: 100,
    depth: 100,

    color: 0xffffff,
    roughness: 0.25,
    metalness: 0.75,
    useRoughnessMap: true
};

const setupGuiForSliceCube = (sliceCube, sliceCubeParams, folderName = "Slice cube") => {
    const slicedCubeFolder = gui.addFolder(folderName)

    // slicedCubeFolder.add(sliceCubeParams, "sliceCount", 0, 100);
    slicedCubeFolder.add(sliceCubeParams, "animationSpeed", 0, 10);
}

const setupGuiForSlice = (sliceGeometry, sliceMaterial, sliceParams, textures, folderName = "Slice") => {
    const sliceFolder = gui.addFolder(folderName)

    // Geometry
    sliceFolder.add(sliceParams, 'height', 0, 500).onChange(() => {
        sliceGeometry.height = sliceParams.height;
        sliceGeometry.needsUpdate = true;
    });
    sliceFolder.add(sliceParams, 'width', 0, 500).onChange(() => {
        sliceGeometry.width = sliceParams.width;
        sliceGeometry.needsUpdate = true;
    });
    sliceFolder.add(sliceParams, 'depth', 0, 500).onChange(() => {
        sliceGeometry.depth = sliceParams.depth;
        sliceGeometry.needsUpdate = true;
    });

    // Material
    sliceFolder.addColor(sliceParams, 'color').onChange(() => {
        sliceMaterial.color = new Color(sliceParams.color);
        sliceMaterial.needsUpdate = true;
    });
    sliceFolder.add(sliceParams, "roughness", 0, 1, 0.01).onChange(() => {
        sliceMaterial.roughness = sliceParams.roughness;
        sliceMaterial.needsUpdate = true;
    });
    sliceFolder.add(sliceParams, "metalness", 0, 1, 0.01).onChange(() => {
        sliceMaterial.metalness = sliceParams.metalness;
        sliceMaterial.needsUpdate = true;
    });
    sliceFolder.add(sliceParams, "useRoughnessMap").onChange(() => {
        if (sliceParams.useRoughnessMap) {
            sliceMaterial.roughnessMap = textures.roughnessMap;
        } else {
            delete sliceMaterial.roughnessMap;
        }
        sliceMaterial.needsUpdate = true;
    });
}

function loadSlicedCube() {
    const textureLoader = new TextureLoader();
    const roughnessMap = textureLoader.load('/textures/roughnessTexture.png');

    const sliceGeometry = new BoxGeometry(sliceParams.width, sliceParams.height, sliceParams.depth);

    const sliceMaterial = new MeshStandardMaterial({
        color: sliceParams.color,
        roughness: sliceParams.roughness,
        metalness: sliceParams.metalness,
    });
    if (sliceParams.useRoughnessMap) {
        sliceMaterial.roughnessMap = roughnessMap;
    }

    const sliceCube = new Group();
    const halfHeightOfCube = sliceParams.height * sliceCubeParams.sliceCount / 2;
    for(let i = 0; i < sliceCubeParams.sliceCount; i++) {
        // We need to clone material in order to update all meshes' materials independently
        const slice = new Mesh(sliceGeometry, sliceMaterial.clone());

        // We need to deduct halfHeightOfCube in order to center cube
        slice.position.y = i * sliceParams.height - halfHeightOfCube;

        slice.tick = () => {
            const speedCoefficient = sliceCubeParams.animationSpeed * 0.0001;
            // We use absolute time in order to clearly use trigonometry functions
            const time = new Date() * speedCoefficient;

            // Graphic explanation: https://www.kontrolnaya-rabota.ru/s/grafik/xy/expr/01acb93dad7c04e6f081f8ca36973a23/?ef-TOTAL_FORMS=10&ef-INITIAL_FORMS=0&ef-MIN_NUM_FORMS=0&ef-MAX_NUM_FORMS=1000&X=x&function=cos%28x*2%29*sin%28x%29&ef-0-f=&ef-1-f=&ef-2-f=&ef-3-f=&ef-4-f=&ef-5-f=&ef-6-f=&ef-7-f=&ef-8-f=&ef-9-f=&a0=&b0=&show_intersections=on#dlfunc
            // We use (i * 0.1) to delay a little bit all slices
            const rotation = Math.cos( time * 2 + i * 0.1) * Math.sin( time );
            slice.rotation.y = rotation;

            // Graphic explanation: https://www.kontrolnaya-rabota.ru/s/grafik/xy/expr/01acb93dad7c04e6f081f8ca36973a23/?ef-TOTAL_FORMS=10&ef-INITIAL_FORMS=0&ef-MIN_NUM_FORMS=0&ef-MAX_NUM_FORMS=1000&X=x&function=abs%28cos%28x*2%29*sin%28x%29%29%5E3&ef-0-f=&ef-1-f=&ef-2-f=&ef-3-f=&ef-4-f=&ef-5-f=&ef-6-f=&ef-7-f=&ef-8-f=&ef-9-f=&a0=&b0=&show_intersections=on#dlfunc
            // We use (* 0.9) to not make slice fully red
            slice.material.emissive.r = Math.abs(  rotation * 0.9 ) ** 3;
        }

        sliceCube.add(slice);
    }

    sliceCube.tick = () => {
        sliceCube.children.forEach(slice => slice.tick())
    }

    setupGuiForSliceCube(sliceCube, sliceCubeParams);
    // setupGuiForSlice(sliceGeometry, sliceMaterial, sliceParams, { roughnessMap });

    return sliceCube;
}

export { loadSlicedCube }