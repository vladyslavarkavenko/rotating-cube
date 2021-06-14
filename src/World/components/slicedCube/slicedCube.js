import {BoxGeometry, MeshStandardMaterial, Mesh, TextureLoader, Group, Color} from "three";
import {gui} from "../../systems/gui";

const sliceCubeParams = {
    sliceCount: 20,
    animationSpeed: 3
}

const emissiveColors = ['red', 'green', 'blue'];
const sliceParams = {
    height: 5,
    width: 100,
    depth: 100,

    color: 0xffffff,
    roughness: 0.25,
    metalness: 0.75,
    useRoughnessMap: true,
    emissiveColor: emissiveColors[0]
};

const setupGuiForSliceCube = (sliceCube, sliceCubeParams, sliceParams, folderName = "Slice cube") => {
    const slicedCubeFolder = gui.addFolder(folderName)

    slicedCubeFolder.add(sliceCubeParams, "sliceCount", 0, 100).onChange(() => {
        sliceCube.recreateSlices(sliceCubeParams, sliceParams);
    });
    slicedCubeFolder
        .add({ animationSpeed: sliceCubeParams.animationSpeed }, "animationSpeed", 0, 10)
        .onFinishChange((animationSpeed) => {
            sliceCubeParams.animationSpeed = animationSpeed;
        });
}

const setupGuiForSlices = (sliceCube, sliceCubeParams, sliceParams, textures, folderName = "Slice") => {
    const sliceFolder = gui.addFolder(folderName)

    // Geometry
    sliceFolder.add(sliceParams, 'height', 1, 10).onChange(() => {
        sliceCube.recreateSlices(sliceCubeParams, sliceParams);
        sliceCube.children.forEach(slice => {
            slice.scale.y = sliceParams.height / slice.geometry.parameters.height;
        })
    });
    sliceFolder.add(sliceParams, 'width', 1, 250).onChange(() => {
        sliceCube.children.forEach(slice => {
            slice.scale.x = sliceParams.width / slice.geometry.parameters.width;
        })
    });
    sliceFolder.add(sliceParams, 'depth', 1, 250).onChange(() => {
        sliceCube.children.forEach(slice => {
            slice.scale.z = sliceParams.depth / slice.geometry.parameters.depth;
        })
    });

    // Material
    sliceFolder.addColor(sliceParams, 'color').onChange(() => {
        sliceCube.children.forEach(slice => {
            slice.material.color = new Color(sliceParams.color);
            slice.material.needsUpdate = true;
        })
    });
    sliceFolder.add(sliceParams, 'emissiveColor', emissiveColors).onChange(() => {
        sliceCube.recreateSlices(sliceCubeParams, sliceParams);
    });
    sliceFolder.add(sliceParams, "roughness", 0, 1, 0.01).onChange(() => {
        sliceCube.children.forEach(slice => {
            slice.material.roughness = sliceParams.roughness;
            slice.material.needsUpdate = true;
        })
    });
    sliceFolder.add(sliceParams, "metalness", 0, 1, 0.01).onChange(() => {
        sliceCube.children.forEach(slice => {
            slice.material.metalness = sliceParams.metalness;
            slice.material.needsUpdate = true;
        })
    });
    sliceFolder.add(sliceParams, "useRoughnessMap").onChange(() => {
        sliceCube.children.forEach(slice => {
            if (sliceParams.useRoughnessMap) {
                slice.material.roughnessMap = textures.roughnessMap;
            } else {
                delete  slice.material.roughnessMap;
            }
            slice.material.needsUpdate = true;
        })
    });
}

const calcTimeCoefficient = (event) => event.elapsedTime * 0.1 * sliceCubeParams.animationSpeed;

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
    const createSlices = (sliceCubeParams, sliceParams) => {
        const halfHeightOfCube = sliceParams.height * sliceCubeParams.sliceCount / 2;

        // Remove all old children data
        sliceCube.children.forEach(slice => {
            slice.geometry.dispose();
            slice.material.dispose();
        })
        sliceCube.remove(...sliceCube.children);

        // Create new children
        for(let i = 0; i < sliceCubeParams.sliceCount; i++) {
            // We need to clone material in order to update all meshes' materials independently
            const slice = new Mesh(sliceGeometry, sliceMaterial.clone());

            // We need to deduct halfHeightOfCube in order to center cube
            slice.position.y = i * sliceParams.height - halfHeightOfCube;

            slice.tick = (event) => {
                const timeCoefficient = calcTimeCoefficient(event);

                // Graphic explanation: https://www.kontrolnaya-rabota.ru/s/grafik/xy/expr/01acb93dad7c04e6f081f8ca36973a23/?ef-TOTAL_FORMS=10&ef-INITIAL_FORMS=0&ef-MIN_NUM_FORMS=0&ef-MAX_NUM_FORMS=1000&X=x&function=cos%28x*2%29*sin%28x%29&ef-0-f=&ef-1-f=&ef-2-f=&ef-3-f=&ef-4-f=&ef-5-f=&ef-6-f=&ef-7-f=&ef-8-f=&ef-9-f=&a0=&b0=&show_intersections=on#dlfunc
                // We use (i * 0.1) to delay a little bit all slices
                const rotation = Math.cos( timeCoefficient * 2 + i * 0.1) * Math.sin(timeCoefficient);
                slice.rotation.y = rotation;

                // Graphic explanation: https://www.kontrolnaya-rabota.ru/s/grafik/xy/expr/01acb93dad7c04e6f081f8ca36973a23/?ef-TOTAL_FORMS=10&ef-INITIAL_FORMS=0&ef-MIN_NUM_FORMS=0&ef-MAX_NUM_FORMS=1000&X=x&function=abs%28cos%28x*2%29*sin%28x%29%29%5E3&ef-0-f=&ef-1-f=&ef-2-f=&ef-3-f=&ef-4-f=&ef-5-f=&ef-6-f=&ef-7-f=&ef-8-f=&ef-9-f=&a0=&b0=&show_intersections=on#dlfunc
                // We use (* 0.9) to not make slice fully red
                slice.material.emissive[sliceParams.emissiveColor[0]] = Math.abs(rotation * 0.9) ** 3;
            }

            sliceCube.add(slice);
        }
    }
    createSlices(sliceCubeParams, sliceParams);

    // We need this function to change slice count from dat.qui
    sliceCube.recreateSlices = createSlices;

    sliceCube.tick = (event) => {
        sliceCube.rotation.x = calcTimeCoefficient(event);

        sliceCube.children.forEach(slice => slice.tick(event))
    }

    setupGuiForSliceCube(sliceCube, sliceCubeParams, sliceParams);
    setupGuiForSlices(sliceCube, sliceCubeParams, sliceParams, { roughnessMap });

    return sliceCube;
}

export { loadSlicedCube }