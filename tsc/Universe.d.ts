import p5 from "p5";
import { BodyDistribution } from "./app/universe/BodyDistribution";
export interface UniverseInitializationOptions {
    totalBodies: number;
    size: number;
    bodyDistribution: BodyDistribution;
}
export default class Universe {
    private bodies;
    constructor(options: UniverseInitializationOptions);
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
    private mixBodyColorsByMass;
    draw(p: p5): void;
    getCenterOfMass(): p5.Vector;
    /**
     * Returns the standard deviation of the distance between each body and the center of mass
     */
    getPositionStandardDeviation(): number;
    getTotalMomentumVector(): p5.Vector;
}
