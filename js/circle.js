import { init2D } from "./base.js";

const radius = 10;
const width = radius * 2 + 1,
      height = radius * 2 + 1;

const voxel2D = init2D(document.getElementById("canvas"), width, height);

voxel2D.map((_, x, y) => {
    const _x = x - radius, _y = y - radius;
    return Math.round(Math.sqrt(_x*_x + _y*_y)) !== radius;
});
voxel2D.draw();