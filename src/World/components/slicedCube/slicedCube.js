import {BoxGeometry, Mesh, MeshBasicMaterial} from "three";

function loadSlicedCube() {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: "red" });

    return new Mesh(geometry, material);
}

export { loadSlicedCube }