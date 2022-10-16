import { init2D } from "./base.js";

const radius = 10;
const width = radius * 2,
      height = radius * 2;
const voxel2D = init2D(document.getElementById("canvas"), width + 1, height + 1);

voxel2D.map((_, x, y) => {
    const _x = x - width / 2, _y = y - height / 2;
    return Math.round(Math.sqrt(_x*_x + _y*_y)) !== radius;
});
voxel2D.draw();