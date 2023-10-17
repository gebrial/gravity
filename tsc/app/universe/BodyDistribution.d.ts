import { UniverseInitializationOptions } from "../../Universe";
import Body from "../../Body";
export declare abstract class BodyDistribution {
    abstract initializeBodies(options: UniverseInitializationOptions): Body[];
}
export declare class EllipsoidBodyDistribution extends BodyDistribution {
    initializeBodies(options: UniverseInitializationOptions): Body[];
}
export declare class RingBodyDistribution extends BodyDistribution {
    initializeBodies(options: UniverseInitializationOptions): Body[];
}
export declare class SphereBodyDistribution extends BodyDistribution {
    initializeBodies(options: UniverseInitializationOptions): Body[];
}
