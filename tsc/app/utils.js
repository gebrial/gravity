"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mixHues = exports.getRandomCauchy = exports.getRandomGuassian = exports.getRandomVectorInUnitSphere = exports.insideEllipsoid = exports.zeroCenteredRandom = void 0;
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
function getRandomGuassian() {
    // Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
exports.getRandomGuassian = getRandomGuassian;
function getRandomCauchy() {
    const u1 = getRandomGuassian();
    const u2 = getRandomGuassian();
    return u1 / u2;
}
exports.getRandomCauchy = getRandomCauchy;
function mixHues(body1, body2) {
    const hue1 = body1.hue;
    const hue2 = body2.hue;
    const mass1 = body1.mass;
    const mass2 = body2.mass;
    if (Math.abs(hue1 - hue2) > 256 / 2) {
        // big hue difference, wrap around
        if (hue1 < hue2) {
            return mixHues({ hue: hue1 + 256, mass: mass1 }, body2) % 256;
        }
        else {
            return mixHues(body1, { hue: hue2 + 256, mass: mass2 }) % 256;
        }
    }
    return (body1.hue * mass1 + body2.hue * mass2) / (mass1 + mass2);
}
exports.mixHues = mixHues;
//# sourceMappingURL=utils.js.map