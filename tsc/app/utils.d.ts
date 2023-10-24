import p5 from "p5";
export declare function zeroCenteredRandom(): number;
export declare function insideEllipsoid(position: p5.Vector, radius: p5.Vector): boolean;
export declare function getRandomVectorInUnitSphere(): p5.Vector;
export declare function getRandomGuassian(): number;
export declare function getRandomCauchy(): number;
export interface BodyHueMass {
    hue: number;
    mass: number;
}
export declare function mixHues(body1: BodyHueMass, body2: BodyHueMass): number;
/**
 * Multiplies the vector by the scalar in place.
 * The built in p5.Vector.mult() function takes longer to execute than this one.
 * @param vector
 * @param scalar
 * @private
 */
export declare function multiply(vector: p5.Vector, scalar: number): p5.Vector;
