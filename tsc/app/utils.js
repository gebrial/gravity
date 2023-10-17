"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insideEllipsoid = exports.zeroCenteredRandom = void 0;
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
//# sourceMappingURL=utils.js.map