"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// to use p5 global functions you need to use p5 instance:
// https://p5js.org/reference/#/p5/p5
const p5_1 = (0, tslib_1.__importDefault)(require("p5"));
class Body {
    constructor() {
        this.mass = 1;
        this.position = new p5_1.default.Vector();
        this.velocity = new p5_1.default.Vector();
        this.acceleration = new p5_1.default.Vector();
        this.radius = Math.pow(this.mass * 10, 1. / 3);
        this.hue = Math.random() * 256;
    }
    /**
     * Calculates the acceleration at position otherPosition by this body
     * @param otherPosition
     */
    getAccelerationFromThis(otherPosition) {
        return Body.getAcceleration(otherPosition, this.position, this.mass);
    }
    /**
     * Calculates the acceleration at position thisPosition by a body with mass otherMass at position otherPosition
     * @param thisPosition
     * @param otherPosition
     * @param otherMass
     */
    static getAcceleration(thisPosition, otherPosition, otherMass) {
        if (p5_1.default.Vector.dist(thisPosition, otherPosition) < Number.EPSILON * 3) {
            return new p5_1.default.Vector();
        }
        const displacement = p5_1.default.Vector.sub(otherPosition, thisPosition);
        return displacement.mult(otherMass / Math.pow(displacement.magSq(), 3 / 2));
    }
    getPosition() {
        return this.position.copy();
    }
    setPosition(position) {
        this.position = position.copy();
    }
    getVelocity() {
        return this.velocity.copy();
    }
    setVelocity(velocity) {
        this.velocity = velocity.copy();
    }
    getMass() {
        return this.mass;
    }
    setMass(mass) {
        this.mass = mass;
        this.radius = Math.pow(this.mass * 10, 1. / 3);
    }
    getHue() {
        return this.hue;
    }
    setHue(hue) {
        this.hue = hue;
    }
    resetAcceleration() {
        this.acceleration.set(0, 0, 0);
    }
    addAcceleration(acceleration) {
        this.acceleration.add(acceleration);
    }
    getAcceleration() {
        return this.acceleration.copy();
    }
    bodyStep() {
        this.position.add(this.velocity).add(this.acceleration);
        this.velocity.add(this.acceleration);
        this.resetAcceleration();
    }
    draw(p) {
        p.push();
        p.colorMode(p.HSB);
        const color = p.color(`hsb(${Math.floor(this.hue)}, 100%, 100%)`);
        p.stroke(color);
        p.fill(color);
        p.translate(this.position);
        p.sphere(this.getRadius());
        p.pop();
    }
    getRadius() {
        return this.radius;
    }
}
exports.default = Body;
//# sourceMappingURL=Body.js.map