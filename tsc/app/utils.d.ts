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
