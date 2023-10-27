import p5 from "p5";
import Body from "../Body";
export default class Octree {
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
