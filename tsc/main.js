"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterateUniverse = void 0;
const tslib_1 = require("tslib");
const Universe_1 = (0, tslib_1.__importDefault)(require("./Universe"));
const p5_1 = (0, tslib_1.__importDefault)(require("p5"));
const totalBodies = 600;
const size = 800;
const universe = new Universe_1.default(totalBodies, size);
const iterateUniverse = () => {
    const sketch = (p) => {
        p.setup = () => {
            p.createCanvas(size, size, p.WEBGL);
        };
        p.draw = () => {
            p.background(0, 0, 0);
            p.orbitControl();
            universe.universeStep();
            const centerOfMass = universe.getCenterOfMass();
            p.translate(centerOfMass.mult(-1));
            p.fill(255);
            p.stroke(255);
            universe.draw(p);
        };
    };
    new p5_1.default(sketch);
};
exports.iterateUniverse = iterateUniverse;
//# sourceMappingURL=main.js.map