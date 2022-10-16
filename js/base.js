/**
 * VoxelGeometry - Base
 * 
 * Licensed under MIT
 * 
 * (c) KekOnTheWorld 2022
 */

export const VOXEL_WIDTH = 10;
export const VOXEL_HEIGHT = 10;
export const VOXEL2D_DEFAULT_WIDTH = 20;
export const VOXEL2D_DEFAULT_HEIGHT = 20;

/**
 * @param { HTMLCanvasElement } canvas
 * @param { number | undefined | null } width
 * @param { number | undefined | null } height
 * @returns { Voxel2D }
 */
export function init2D(canvas, width, height) {
    const _width = typeof width === "number" ? width : VOXEL2D_DEFAULT_WIDTH,
          _height = typeof height === "number" ? height : VOXEL2D_DEFAULT_HEIGHT;

    canvas.width = _width * VOXEL_WIDTH;
    canvas.height = _height * VOXEL_HEIGHT;

    const context = canvas.getContext("2d");

    if(context !== null) {
        return new Voxel2D(context, _width, _height);
    } else throw new Error("Error while creating 2D context.");
}

export class Voxel2D {
    #context; /** @type { CanvasRenderingContext2D } */
    #fields; /** @type { Float64Array } */
    width; /** @type { number } */
    height; /** @type { number } */
    size; /** @type { number } */

    /**
     * @param { CanvasRenderingContext2D } context
     * @param { number } width
     * @param { number } height
     */
    constructor(context, width, height) {
        const size = width * height;

        this.#context = context;
        this.#fields = new Float64Array(size);
        Object.defineProperty(this, "width", {
            value: width,
            writable: false
        });
        Object.defineProperty(this, "height", {
            value: height,
            writable: false
        });
        Object.defineProperty(this, "size", {
            value: size,
            writable: false
        });
    }

    /**
     * @param {(v: number, x: number, y: number, i: number) => number} cb 
     */
    map(cb) {
        for(let i = 0; i < this.size; i++)
            this.#fields[i] = cb(this.#fields[i], i % this.width,
                Math.floor(i / this.width), i);
    }

    /**
     * @param {(v: number, x: number, y: number, i: number) => void} cb 
     */
    forEach(cb) {
        for(let i = 0; i < this.size; i++)
            cb(this.#fields[i], i % this.width, Math.floor(i / this.width), i);
    }

    /**
     * @param { number } x 
     * @param { number } y 
     * @param { number } value 
     */
    setBlock(x, y, value) {
        this.#fields[x + y * this.width] = value;
    }

    /**
     * @param { number } i
     * @param { number } value 
     */
    setBlockI(i, value) {
        this.#fields[i] = value;
    }

    draw() {
        this.#context.clearRect(0, 0, this.width * VOXEL_WIDTH, this.height * VOXEL_HEIGHT);
        this.forEach((v, x, y) => {
            const _x = x * VOXEL_WIDTH, _y = y * VOXEL_WIDTH;
            const c = v * 255;
            const cr = c, cg = c, cb = c;
            this.#context.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
            this.#context.fillRect(_x, _y, VOXEL_WIDTH, VOXEL_HEIGHT);
            console.log("kekw");
        })
    }
}