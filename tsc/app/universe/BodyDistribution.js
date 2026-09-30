"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolarSystemBodyDistribution = exports.SphereBodyDistribution = exports.RingBodyDistribution = exports.EllipsoidBodyDistribution = exports.BodyDistribution = void 0;
const tslib_1 = require("tslib");
const p5_1 = (0, tslib_1.__importDefault)(require("p5"));
const utils_1 = require("../utils");
const Body_1 = (0, tslib_1.__importDefault)(require("../../Body"));
const solar_system_bodies_json_1 = (0, tslib_1.__importDefault)(require("../../solar_system_bodies.json"));
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
                body2.addAcceleration((0, utils_1.multiply)(direction, body1.getMass() / Math.pow(distanceSq, 3 / 2)));
                body1.addAcceleration((0, utils_1.multiply)(direction, -body2.getMass() / body1.getMass()));
            }
            const acceleration = body1.getAcceleration();
            const speed = Math.sqrt(acceleration.mag() * body1.getPosition().mag());
            const angularVelocity = new p5_1.default.Vector(0, 1, 0);
            const velocityDirection = body1.getPosition().copy().cross(angularVelocity);
            velocityDirection.setMag(speed / 2);
            body1.setVelocity(velocityDirection);
            body1.resetAcceleration();
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
            // if we want to emulate a circular orbit, we should divide potential energy by 2, not speed
            // https://openstax.org/books/university-physics-volume-1/pages/13-4-satellite-orbits-and-energy#fs-id1168328363439
            const speed = Math.sqrt(2 * Math.abs(potentialEnergy) / body1.getMass());
            body1.setVelocity((0, utils_1.getRandomVectorInUnitSphere)().setMag(speed / 2));
        }
        return bodies;
    }
}
exports.SphereBodyDistribution = SphereBodyDistribution;
function getOrbitalVelocity(position, mass, gravitationalConstant = 1) {
    const distance = position.mag();
    return new p5_1.default.Vector(0, 0, 0);
    // todo : check if this is correct
    // check for zero distance to avoid division by zero
    if (distance < Number.EPSILON) {
        return new p5_1.default.Vector(0, 0, 0);
    }
    const velocityMagnitude = Math.sqrt((gravitationalConstant * mass) / distance);
    let velocity = position.copy().normalize().mult(velocityMagnitude);
    // rotate the velocity vector by 90 degrees
    velocity = new p5_1.default.Vector(-velocity.y, velocity.x, velocity.z);
    return velocity;
}
function getHueFromHex(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const chroma = max - Math.min(r, g, b);
    if (chroma === 0) {
        return 0;
    }
    let hue;
    if (max === r) {
        hue = ((g - b) / chroma) % 6;
    }
    else if (max === g) {
        hue = (b - r) / chroma + 2;
    }
    else {
        hue = (r - g) / chroma + 4;
    }
    return ((hue * 60) + 360) % 360;
}
class SolarSystemBodyDistribution extends BodyDistribution {
    static createBodyFromData(bodyData, _parentPostion, _parentVelocity) {
        const body = new Body_1.default();
        body.setMass(bodyData.mass * SolarSystemBodyDistribution.MASS_SCALE);
        // todo: adjust position and velocity based on parent position and velocity
        const position = new p5_1.default.Vector(...bodyData.position.map((v) => v * SolarSystemBodyDistribution.POSITION_SCALE));
        body.setPosition(position);
        body.setVelocity(getOrbitalVelocity(position, body.getMass()));
        if (bodyData.color) {
            const hue = getHueFromHex(bodyData.color);
            body.setHue(hue);
        }
        if (bodyData.planets) {
            const planetBodies = bodyData.planets.flatMap((planetData) => SolarSystemBodyDistribution.createBodyFromData(planetData));
            return [body, ...planetBodies];
        }
        return [body];
    }
    initializeBodies(_options) {
        return SolarSystemBodyDistribution.createBodyFromData(solar_system_bodies_json_1.default[0]);
    }
}
exports.SolarSystemBodyDistribution = SolarSystemBodyDistribution;
SolarSystemBodyDistribution.MASS_SCALE = 1e-28;
SolarSystemBodyDistribution.POSITION_SCALE = 1 / 3e8;
//# sourceMappingURL=BodyDistribution.js.map