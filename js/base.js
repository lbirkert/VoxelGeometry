/**
 * VoxelGeometry - Base
 * 
 * Licensed under MIT
 * 
 * (c) KekOnTheWorld 2022
 */

export const VOXEL_WIDTH = 20;
export const VOXEL_HEIGHT = 20;

export const VOXEL2D_DEFAULT_WIDTH = 20;
export const VOXEL2D_DEFAULT_HEIGHT = 20;

export function initSettings() {
    const settings = new Settings();

    document.querySelectorAll("settings").forEach(s => settings.process(s));

    return settings;
}

export class Setting {
    /** @type { string } */
    type;
    /** @type { ((value: any) => void)[] } */
    subscribers = [];
    /** @type { any } */
    value;

    /** @param { string } type */
    constructor(type) {
        this.type = type;
    }

    /**
     * @param { (any) => void } subscriber 
     */
    subscribe(subscriber) {
        this.subscribers.push(subscriber);
        subscriber(this.value);
    }
}

export class Settings {
    /** @type { { [ key: string ]: (node: HTMLElement) => Setting } } */
    static types = {
        "SLIDER": this.handleSlider,
    };

    /** @param { HTMLElement } node */
    static handleSlider(node) {
        const setting = new Setting("slider");

        /** @param { InputEvent } e */
        const handler = (e) => {
            const _v = parseInt(e.target.value);
            setting.subscribers.forEach(s => s(_v));
            setting.value = _v;
        };

        const _min = parseInt(node.getAttribute("min") || 0),
              _max = parseInt(node.getAttribute("max") || 100),
              _value = parseInt(node.getAttribute("value") || _min);
        
        setting.value = _value;
        
        const minEl = document.createElement("p");
        minEl.innerText = _min;
        node.appendChild(minEl);
        
        const sliderEl = document.createElement("input");
        sliderEl.type = "range";
        sliderEl.setAttribute("min", _min);
        sliderEl.setAttribute("max", _max);
        sliderEl.setAttribute("value", _value);
        sliderEl.addEventListener("change", handler);
        node.appendChild(sliderEl);
        
        const maxEl = document.createElement("p");
        maxEl.innerText = _max;
        node.appendChild(maxEl);
        
        return setting;
    }

    #settings = {}; /** @type { { [key: string]: Setting } } */

    /**
     * @param { HTMLElement } node 
     */
    process(node) {
        node.childNodes.forEach((child) => {
            if(child.nodeType !== 1) return;
            const cb = Settings.types[child.nodeName];
            if(cb) this.#settings[child.getAttribute("name")] = cb(child);
        })
    }

    /**
     * 
     * @param { string } setting 
     * @param { (value: any) => void } subscriber 
     */
    subscribe(setting, subscriber) {
        /** @type { Setting | undefined } */
        const _setting = this.#settings[setting];
        if(_setting) _setting.subscribe(subscriber);
        else throw new Error("Setting not registered");
    }
}

/**
 * @param { HTMLCanvasElement | undefined | null } canvas
 * @param { number | undefined | null } width
 * @param { number | undefined | null } height
 * @returns { Voxel2D }
 */
export function init2D(canvas, width, height) {
    const _width = typeof width === "number" ? width : VOXEL2D_DEFAULT_WIDTH,
          _height = typeof height === "number" ? height : VOXEL2D_DEFAULT_HEIGHT,
          _canvas = typeof canvas === "object" ? canvas : document.querySelector("canvas");

    if(!_canvas) throw new Error("No canvas has been provided or found on the page!");

    return new Voxel2D(_canvas, _width, _height);
}

export class Voxel2D {
    /** @type { CanvasRenderingContext2D } */
    #canvas;
    /** @type { CanvasRenderingContext2D } */
    #context;
    /** @type { Float64Array } */
    #fields;
    /** @type { number } */
    width;
    /** @type { number } */
    height; 
    /** @type { number } */
    size;

    /**
     * @param { HTMLCanvasElement } canvas
     * @param { number } width
     * @param { number } height
     */
    constructor(canvas, width, height) {
        this.#canvas = canvas;
        this.#context = canvas.getContext("2d");
        if(!this.#context) throw new Error("Error while creating 2D context.");

        this.rebase(width, height);
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
        this.forEach((v, x, y, i) => {
            const _x = x * VOXEL_WIDTH, _y = y * VOXEL_WIDTH;
            var c = (v ? v : (i%2 ? 0 : 0.2)) * 255;;
            const cr = c, cg = c, cb = c;
            this.#context.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
            this.#context.fillRect(_x, _y, VOXEL_WIDTH, VOXEL_HEIGHT);
        })
    }

    rebase(width, height) {
        if(this.width === width && this.height === height) return;

        canvas.width = width * VOXEL_WIDTH;
        canvas.height = height * VOXEL_HEIGHT;

        const size = width * height;

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
}