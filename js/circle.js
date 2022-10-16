/**                                                     
 * █░█ █▀█ ▀▄▀ █▀▀ █░░ █▀▀ █▀▀ █▀█ █▀▄▀█ █▀▀ ▀█▀ █▀█ █▄█
 * ▀▄▀ █▄█ █░█ ██▄ █▄▄ █▄█ ██▄ █▄█ █░▀░█ ██▄ ░█░ █▀▄ ░█░
 * 
 * https://github.com/KekOnTheWorld/VoxelGeometry/blob/master/LICENSE
 * 
 * (c) KekOnTheWorld 2022
 */

import { init2D, initSettings } from "./base.js";

const settings = initSettings();
const voxel2D = init2D();

// Update on setting change
settings.subscribe("radius", (radius) => {
    // Calculate screen dimensions
    const width = radius * 2 + 1,
          height = radius * 2 + 1;

    // Resize voxel2D
    voxel2D.rebase(width, height);

    // Draw circle
    voxel2D.map((_, x, y) => {
        const _x = x - radius, _y = y - radius;
        return Math.round(Math.sqrt(_x*_x + _y*_y)) === radius;
    });

    // Draw to canvas
    voxel2D.draw();
});