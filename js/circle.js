import { init2D, initSettings } from "./base.js";

const settings = initSettings();

const canvas = document.getElementById("canvas");
const voxel2D = init2D(canvas);

settings.subscribe("radius", (radius) => {
    const width = radius * 2 + 1,
          height = radius * 2 + 1;

    
    // Resize voxel2D
    voxel2D.rebase(width, height);

    voxel2D.map((_, x, y) => {
        const _x = x - radius, _y = y - radius;
        return Math.round(Math.sqrt(_x*_x + _y*_y)) === radius;
    });
    voxel2D.draw();
});