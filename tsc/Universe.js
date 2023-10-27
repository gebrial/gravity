"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Body_1 = (0, tslib_1.__importDefault)(require("./Body"));
const p5_1 = (0, tslib_1.__importDefault)(require("p5"));
const utils_1 = require("./app/utils");
class Universe {
    constructor(options) {
        var _a;
        this.shouldMergeNearbyBodies = true;
        this.bodies = [];
        this.bodies = options.bodyDistribution.initializeBodies(options);
        this.shouldMergeNearbyBodies = (_a = options.shouldMergeNearbyBodies) !== null && _a !== void 0 ? _a : true;
    }
    /**
     * Calculates the gravitational force between two bodies, applies the forces, and updates the positions.
     * @param bodyPositions
     * @private
     */
    calculateAndApplyForces(bodyPositions) {
        for (let i = 0; i < this.bodies.length; i++) {
            const body1Position = bodyPositions[i];
            const tmp = new p5_1.default.Vector(0, 0, 0);
            for (let j = i + 1; j < this.bodies.length; j++) {
                const body2Position = bodyPositions[j];
                const body1 = this.bodies[i];
                const body2 = this.bodies[j];
                const direction = tmp.set(body1Position).sub(body2Position);
                const distanceSq = direction.magSq();
                const inverseDistanceCubed = 1 / Math.pow(distanceSq, 3 / 2);
                const gravityScaledToMass = (0, utils_1.multiply)(direction, inverseDistanceCubed);
                body2.addAcceleration((0, utils_1.multiply)(gravityScaledToMass.copy(), body1.getMass()));
                body1.addAcceleration((0, utils_1.multiply)(gravityScaledToMass, -body2.getMass()));
            }
        }
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].bodyStep();
        }
    }
    /**
     * Checks body positions for collisions. If there are any then it merges those bodies.
     * @param bodyPositions
     * @private
     */
    checkAndMergeCollidingBodies(bodyPositions) {
        const bodiesToRemove = [];
        const bodiesToAdd = [];
        for (let i = 0; i < this.bodies.length; i++) {
            const body1 = this.bodies[i];
            if (bodiesToRemove.includes(body1)) {
                continue;
            }
            const body1Position = bodyPositions[i];
            const body1Radius = body1.getRadius();
            const tmp = new p5_1.default.Vector(0, 0, 0);
            for (let j = i + 1; j < this.bodies.length; j++) {
                const body2 = this.bodies[j];
                if (bodiesToRemove.includes(body2)) {
                    continue;
                }
                const body2Position = bodyPositions[j];
                const distanceSq = tmp.set(body1Position).sub(body2Position).magSq();
                if (distanceSq < Math.pow(body1Radius + body2.getRadius(), 2)) {
                    const newBody = this.mergeBodies(body1, body2);
                    bodiesToRemove.push(body1);
                    bodiesToRemove.push(body2);
                    bodiesToAdd.push(newBody);
                    break;
                }
            }
        }
        bodiesToRemove.forEach(body => {
            this.bodies.splice(this.bodies.indexOf(body), 1);
        });
        this.bodies.push(...bodiesToAdd);
        if (bodiesToRemove.length > 0) {
            return this.checkAndMergeCollidingBodies(this.bodies.map(body => body.getPosition()));
        }
    }
    universeStep() {
        if (this.shouldMergeNearbyBodies) {
            this.checkAndMergeCollidingBodies(this.bodies.map(body => body.getPosition()));
        }
        this.calculateAndApplyForces(this.bodies.map(body => body.getPosition()));
    }
    /**
     * Returns a new body object which is the result of merging the two bodies
     * @param body1
     * @param body2
     * @private
     */
    mergeBodies(body1, body2) {
        const body1Mass = body1.getMass();
        const body2Mass = body2.getMass();
        const newMass = body1Mass + body2Mass;
        // completely inelastic collision, maximum conversion of kinetic energy to "heat"
        // position and velocity are weighted by mass of each body
        const newPosition = body1.getPosition().mult(body1Mass / newMass).add(body2.getPosition().mult(body2Mass / newMass));
        const newVelocity = body1.getVelocity().mult(body1Mass / newMass).add(body2.getVelocity().mult(body2Mass / newMass));
        const newBody = new Body_1.default();
        newBody.setMass(newMass);
        newBody.setPosition(newPosition);
        newBody.setVelocity(newVelocity);
        const newHue = this.mixBodyColorsByMass(body1, body2);
        newBody.setHue(newHue);
        return newBody;
    }
    mixBodyColorsByMass(body1, body2) {
        const hue1 = body1.getHue();
        const hue2 = body2.getHue();
        const body1Mass = body1.getMass();
        const body2Mass = body2.getMass();
        return (0, utils_1.mixHues)({ hue: hue1, mass: body1Mass }, { hue: hue2, mass: body2Mass });
    }
    draw(p) {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].draw(p);
        }
    }
    getCenterOfMass() {
        const centerOfMass = new p5_1.default.Vector(0, 0);
        let totalMass = 0;
        for (let i = 0; i < this.bodies.length; i++) {
            const bodyMass = this.bodies[i].getMass();
            totalMass += bodyMass;
            centerOfMass.add(this.bodies[i].getPosition().mult(bodyMass));
        }
        centerOfMass.div(totalMass);
        return centerOfMass;
    }
    /**
     * Returns the standard deviation of the distance between each body and the center of mass
     */
    getPositionStandardDeviation() {
        const centerOfMass = this.getCenterOfMass();
        let totalDistance = 0;
        for (let i = 0; i < this.bodies.length; i++) {
            const distance = this.bodies[i].getPosition().sub(centerOfMass).magSq();
            totalDistance += distance;
        }
        return Math.sqrt(totalDistance / this.bodies.length);
    }
    getTotalMomentumVector() {
        const momentumVector = new p5_1.default.Vector(0, 0, 0);
        for (let i = 0; i < this.bodies.length; i++) {
            const body = this.bodies[i];
            momentumVector.add(body.getVelocity().mult(body.getMass()));
        }
        return momentumVector;
    }
    getBodyCount() {
        return this.bodies.length;
    }
}
exports.default = Universe;
//# sourceMappingURL=Universe.js.map