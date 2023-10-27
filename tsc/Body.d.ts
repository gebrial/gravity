import p5 from "p5";
export default class Body {
    private mass;
    private position;
    private velocity;
    private acceleration;
    private radius;
    private hue;
    /**
     * Calculates the acceleration at position otherPosition by this body
     * @param otherPosition
     */
    getAccelerationFromThis(otherPosition: p5.Vector): p5.Vector;
    /**
     * Calculates the acceleration at position thisPosition by a body with mass otherMass at position otherPosition
     * @param thisPosition
     * @param otherPosition
     * @param otherMass
     */
    static getAcceleration(thisPosition: p5.Vector, otherPosition: p5.Vector, otherMass: number): p5.Vector;
    getPosition(): p5.Vector;
    setPosition(position: p5.Vector): void;
    getVelocity(): p5.Vector;
    setVelocity(velocity: p5.Vector): void;
    getMass(): number;
    setMass(mass: number): void;
    getHue(): number;
    setHue(hue: number): void;
    resetAcceleration(): void;
    addAcceleration(acceleration: p5.Vector): void;
    getAcceleration(): p5.Vector;
    bodyStep(): void;
    draw(p: p5): void;
    getRadius(): number;
}
