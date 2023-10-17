"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SphereBodyDistribution = exports.RingBodyDistribution = exports.EllipsoidBodyDistribution = exports.BodyDistribution = void 0;
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
            const initialPosition = (0, utils_1.getRandomVectorInUnitSphere)().mult(new p5_1.default.Vector(size, size / 10, size));
            newBody.setPosition(initialPosition);
            newBody.setVelocity(new p5_1.default.Vector(0, 0, 0));
            newBody.setMass(Math.random());
            bodies.push(newBody);
        }
        return bodies;
    }
}
exports.EllipsoidBodyDistribution = EllipsoidBodyDistribution;
class RingBodyDistribution extends BodyDistribution {
    initializeBodies(options) {
        const bodies = [];
        const { totalBodies, size } = options;
        for (let i = 0; i < totalBodies; i++) {
            const newBody = new Body_1.default();
            const initialAngle = Math.random() * Math.PI * 2;
            const offsetDistance = Math.random() * size / 10;
            const initialPosition = new p5_1.default.Vector(Math.cos(initialAngle), 0, Math.sin(initialAngle)).setMag(size);
            const offsetVector = (0, utils_1.getRandomVectorInUnitSphere)().setMag(offsetDistance);
            newBody.setPosition(initialPosition.add(offsetVector));
            newBody.setVelocity(new p5_1.default.Vector(0, 0, 0));
            newBody.setMass(Math.random());
            bodies.push(newBody);
        }
        return bodies;
    }
}
exports.RingBodyDistribution = RingBodyDistribution;
class SphereBodyDistribution extends BodyDistribution {
    initializeBodies(options) {
        const bodies = [];
        const { totalBodies, size } = options;
        for (let i = 0; i < totalBodies; i++) {
            const newBody = new Body_1.default();
            const initialPosition = (0, utils_1.getRandomVectorInUnitSphere)().mult(size);
            newBody.setPosition(initialPosition);
            newBody.setVelocity(new p5_1.default.Vector(0, 0, 0));
            newBody.setMass(Math.random());
            bodies.push(newBody);
        }
        return bodies;
    }
}
exports.SphereBodyDistribution = SphereBodyDistribution;
//# sourceMappingURL=BodyDistribution.js.map