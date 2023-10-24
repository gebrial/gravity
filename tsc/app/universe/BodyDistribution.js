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
        // apply radial velocity based on acceleration
        for (let ii = 0; ii < totalBodies; ii++) {
            // calculate forces applied on every body
            const body1 = bodies[ii];
            const body1Position = body1.getPosition();
            for (let jj = ii + 1; jj < totalBodies; jj++) {
                const body2 = bodies[jj];
                const body2Position = body2.getPosition();
                const direction = body1Position.copy().sub(body2Position);
                const distanceSq = direction.magSq() + size * size / 100; // smoothing factor
                const force = body1.getMass() * body2.getMass() / Math.pow(distanceSq, 3 / 2);
                body2.applyForce((0, utils_1.multiply)(direction, force));
                body1.applyForce((0, utils_1.multiply)(direction, -1));
            }
            const forces = body1.getForce();
            const acceleration = (0, utils_1.multiply)(forces, 1 / body1.getMass());
            const speed = Math.sqrt(acceleration.mag() * body1.getPosition().mag());
            const angularVelocity = new p5_1.default.Vector(0, 1, 0);
            const velocityDirection = body1.getPosition().copy().cross(angularVelocity);
            velocityDirection.setMag(speed / 2);
            body1.setVelocity(velocityDirection);
            body1.resetForce();
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
            const initialPosition = (0, utils_1.getRandomVectorInUnitSphere)()
                .normalize()
                .mult(size * (0, utils_1.getRandomGuassian)());
            newBody.setPosition(initialPosition);
            newBody.setMass(Math.abs((0, utils_1.getRandomCauchy)()));
            bodies.push(newBody);
        }
        // calculate potential energy of each body
        for (let ii = 0; ii < totalBodies; ii++) {
            const body1 = bodies[ii];
            const body1Position = body1.getPosition();
            let potentialEnergy = 0;
            for (let jj = 0; jj < totalBodies; jj++) {
                if (ii === jj) {
                    continue;
                }
                const body2 = bodies[jj];
                const body2Position = body2.getPosition();
                const direction = body1Position.copy().sub(body2Position);
                const distance = direction.mag();
                potentialEnergy -= body1.getMass() * body2.getMass() / distance;
            }
            const speed = Math.sqrt(2 * Math.abs(potentialEnergy) / body1.getMass());
            // divide speed by 2 so that bodies don't escape to infinity
            body1.setVelocity((0, utils_1.getRandomVectorInUnitSphere)().setMag(speed / 2));
        }
        return bodies;
    }
}
exports.SphereBodyDistribution = SphereBodyDistribution;
//# sourceMappingURL=BodyDistribution.js.map