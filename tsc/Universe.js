"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Octree = void 0;
const tslib_1 = require("tslib");
const Body_1 = (0, tslib_1.__importDefault)(require("./Body"));
const p5_1 = (0, tslib_1.__importDefault)(require("p5"));
const utils_1 = require("./app/utils");
class Octree {
    constructor(items, startCorner, size) {
        this.totalMass = 0;
        this.centerOfMass = new p5_1.default.Vector;
        this.itemRecentlyAdded = false;
        this.startCorner = startCorner;
        this.size = size;
        if (items.length > 1) {
            this.children = this.createChildOctrees(startCorner, size);
        }
        this.addItems(items);
    }
    addItems(items) {
        this.itemRecentlyAdded = true;
        for (const item of items) {
            this.addItem(item);
        }
    }
    addItem(item) {
        this.itemRecentlyAdded = true;
        if (!this.leaf && !this.children) {
            // first element
            return this.addFirstItem(item);
        }
        this.addNonFirstItem(item);
    }
    addFirstItem(item) {
        if (this.leaf || this.children) {
            throw new Error('first item already exists');
        }
        this.leaf = item;
    }
    addNonFirstItem(item) {
        if (!this.children) {
            this.children = this.createChildOctrees(this.startCorner, this.size);
        }
        if (this.leaf) {
            const tmp = this.leaf;
            this.leaf = undefined;
            this.addNonFirstItem(tmp);
        }
        let itemAdded = false;
        this.children.forEach((child) => {
            if (child.isPointInside(item.getPosition())) {
                if (itemAdded) {
                    throw new Error('item added to multiple octant');
                }
                itemAdded = true;
                child.addItem(item);
            }
        });
    }
    isPointInside(point) {
        if (point.x < this.startCorner.x || point.x >= this.startCorner.x + this.size) {
            return false;
        }
        if (point.y < this.startCorner.y || point.y >= this.startCorner.y + this.size) {
            return false;
        }
        if (point.z < this.startCorner.z || point.z >= this.startCorner.z + this.size) {
            return false;
        }
        return true;
    }
    getStartCorner() {
        return this.startCorner.copy();
    }
    getSize() {
        return this.size;
    }
    /**
     * Create child octants
     * @param startCorner
     * @param size side length of the parent cube
     * @private
     */
    createChildOctrees(startCorner, size) {
        const octants = [];
        for (let i = 0; i <= 1; i++) {
            for (let j = 0; j <= 1; j++) {
                for (let k = 0; k <= 1; k++) {
                    octants.push(new Octree([], startCorner.copy().add(i * size / 2, j * size / 2, k * size / 2), size / 2));
                }
            }
        }
        return octants;
    }
    updateMassInfos() {
        var _a, _b;
        this.totalMass = 0;
        this.centerOfMass = new p5_1.default.Vector();
        if (this.leaf) {
            this.totalMass = this.leaf.getMass();
            this.centerOfMass = this.leaf.getPosition();
        }
        else {
            (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach((child) => {
                this.totalMass += child.getTotalMass();
            });
            let massSoFar = 0;
            (_b = this.children) === null || _b === void 0 ? void 0 : _b.forEach((child) => {
                const childMass = child.getTotalMass();
                if (childMass === 0) {
                    return;
                }
                const totalMass = massSoFar + childMass;
                this.centerOfMass.mult(massSoFar / totalMass).add(child.getCenterOfMass().mult(childMass / totalMass));
                massSoFar = totalMass;
            });
        }
        this.itemRecentlyAdded = false;
    }
    getTotalMass() {
        if (this.itemRecentlyAdded) {
            this.updateMassInfos();
        }
        return this.totalMass;
    }
    getCenterOfMass() {
        if (this.itemRecentlyAdded) {
            this.updateMassInfos();
        }
        return this.centerOfMass.copy();
    }
    /**
     * Returns the gravitational acceleration caused by this octant on the point
     * @param point
     * @param threshold
     */
    getAcceleration(point, threshold = 0) {
        var _a;
        if (this.leaf || !this.isDistanceThesholdExceeded(point, threshold)) {
            return this.getAccelerationByThis(point.copy());
        }
        const acceleration = new p5_1.default.Vector();
        (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach((child) => {
            acceleration.add(child.getAcceleration(point, threshold));
        });
        return acceleration;
    }
    /**
     * Calculates the gravitational acceleration on a point by this octant
     * @param point
     * @param bodyLocation
     * @param mass
     * @private
     */
    getAccelerationByThis(point) {
        return Body_1.default.getAcceleration(point, this.getCenterOfMass(), this.getTotalMass());
    }
    /**
     * Checks whether the point is too close to approximate the acceleration based on center of mass.
     * Returns true if further subdivisions are needed.
     * @param point
     * @param threshold
     * @private
     */
    isDistanceThesholdExceeded(point, threshold) {
        const quotient = this.size / this.getCenterOfMass().dist(point);
        return quotient > threshold;
    }
}
exports.Octree = Octree;
class Universe {
    constructor(options) {
        this.bodies = [];
        this.bodies = options.bodyDistribution.initializeBodies(options);
    }
    /**
     * Multiplies the vector by the scalar in place.
     * The built in p5.Vector.mult() function takes longer to execute than this one.
     * @param vector
     * @param scalar
     * @private
     */
    multiply(vector, scalar) {
        return vector.set(vector.x * scalar, vector.y * scalar, vector.z * scalar);
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
                const distanceSq = tmp.set(body1Position).sub(body2Position).magSq();
                const force = body1.getMass() * body2.getMass() / Math.pow(distanceSq, 3 / 2);
                const direction = tmp;
                body2.applyForce(this.multiply(direction, force));
                body1.applyForce(this.multiply(direction, -1));
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
        this.checkAndMergeCollidingBodies(this.bodies.map(body => body.getPosition()));
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
}
exports.default = Universe;
//# sourceMappingURL=Universe.js.map