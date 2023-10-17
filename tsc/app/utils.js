"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomVectorInUnitSphere = exports.insideEllipsoid = exports.zeroCenteredRandom = void 0;
const tslib_1 = require("tslib");
const p5_1 = (0, tslib_1.__importDefault)(require("p5"));
function zeroCenteredRandom() {
    return Math.random() * 2 - 1;
}
exports.zeroCenteredRandom = zeroCenteredRandom;
function insideEllipsoid(position, radius) {
    const xComponent = position.x * position.x / radius.x / radius.x;
    const yComponent = position.y * position.y / radius.y / radius.y;
    const zComponent = position.z * position.z / radius.z / radius.z;
    return xComponent + yComponent + zComponent <= 1;
}
exports.insideEllipsoid = insideEllipsoid;
function getRandomVectorInUnitSphere() {
    let vector;
    do {
        vector = new p5_1.default.Vector(zeroCenteredRandom(), zeroCenteredRandom(), zeroCenteredRandom());
    } while (vector.magSq() > 1);
    return vector;
}
exports.getRandomVectorInUnitSphere = getRandomVectorInUnitSphere;
//# sourceMappingURL=utils.js.map