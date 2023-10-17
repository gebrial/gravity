"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EllipsoidBodyDistribution = exports.BodyDistribution = void 0;
const tslib_1 = require("tslib");
const p5_1 = (0, tslib_1.__importDefault)(require("p5"));
const utils_1 = require("../utils");
const Body_1 = (0, tslib_1.__importDefault)(require("../../Body"));
class BodyDistribution {
}
exports.BodyDistribution = BodyDistribution;
class EllipsoidBodyDistribution extends BodyDistribution {
    initializeBodies(options) {
        const bodies = [];
        const { totalBodies, size } = options;
        for (let i = 0; i < totalBodies; i++) {
            const newBody = new Body_1.default();
            let initialPosition;
            do {
                initialPosition = new p5_1.default.Vector((0, utils_1.zeroCenteredRandom)() * size, (0, utils_1.zeroCenteredRandom)() * size / 10, (0, utils_1.zeroCenteredRandom)() * size);
            } while (!(0, utils_1.insideEllipsoid)(initialPosition, new p5_1.default.Vector(size, size / 10, size)));
            newBody.setPosition(initialPosition);
            newBody.setVelocity(new p5_1.default.Vector(0, 0, 0));
            newBody.setMass(Math.random());
            bodies.push(newBody);
        }
        return bodies;
    }
}
exports.EllipsoidBodyDistribution = EllipsoidBodyDistribution;
//# sourceMappingURL=BodyDistribution.js.map