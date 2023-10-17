import Body from "./Body";
import p5 from "p5";
import { BodyDistribution } from "./app/universe/BodyDistribution";
export declare class Octree {
    private leaf;
    private children;
    private startCorner;
    private size;
    private totalMass;
    private centerOfMass;
    private itemRecentlyAdded;
    constructor(items: Body[], startCorner: p5.Vector, size: number);
    addItems(items: Body[]): void;
    addItem(item: Body): void;
    private addFirstItem;
    private addNonFirstItem;
    isPointInside(point: p5.Vector): boolean;
    getStartCorner(): p5.Vector;
    getSize(): number;
    /**
     * Create child octants
     * @param startCorner
     * @param size side length of the parent cube
     * @private
     */
    private createChildOctrees;
    private updateMassInfos;
    getTotalMass(): number;
    getCenterOfMass(): p5.Vector;
    /**
     * Returns the gravitational acceleration caused by this octant on the point
     * @param point
     * @param threshold
     */
    getAcceleration(point: p5.Vector, threshold?: number): p5.Vector;
    /**
     * Calculates the gravitational acceleration on a point by this octant
     * @param point
     * @param bodyLocation
     * @param mass
     * @private
     */
    private getAccelerationByThis;
    /**
     * Checks whether the point is too close to approximate the acceleration based on center of mass.
     * Returns true if further subdivisions are needed.
     * @param point
     * @param threshold
     * @private
     */
    private isDistanceThesholdExceeded;
}
export interface UniverseInitializationOptions {
    totalBodies: number;
    size: number;
    bodyDistribution: BodyDistribution;
}
export default class Universe {
    private bodies;
    constructor(options: UniverseInitializationOptions);
    /**
     * Multiplies the vector by the scalar in place.
     * The built in p5.Vector.mult() function takes longer to execute than this one.
     * @param vector
     * @param scalar
     * @private
     */
    private multiply;
    /**
     * Calculates the gravitational force between two bodies, applies the forces, and updates the positions.
     * @param bodyPositions
     * @private
     */
    private calculateAndApplyForces;
    /**
     * Checks body positions for collisions. If there are any then it merges those bodies.
     * @param bodyPositions
     * @private
     */
    private checkAndMergeCollidingBodies;
    universeStep(): void;
    /**
     * Returns a new body object which is the result of merging the two bodies
     * @param body1
     * @param body2
     * @private
     */
    private mergeBodies;
    draw(p: p5): void;
    getCenterOfMass(): p5.Vector;
    /**
     * Returns the standard deviation of the distance between each body and the center of mass
     */
    getPositionStandardDeviation(): number;
    getTotalMomentumVector(): p5.Vector;
}
