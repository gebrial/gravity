"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const p5_1 = (0, tslib_1.__importDefault)(require("p5"));
const Body_1 = (0, tslib_1.__importDefault)(require("../Body"));
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
exports.default = Octree;
//# sourceMappingURL=Octree.js.map