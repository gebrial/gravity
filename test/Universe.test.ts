import Universe from "../src/Universe"
import { EllipsoidBodyDistribution, SphereBodyDistribution } from "../src/app/universe/BodyDistribution"

describe('Universe', () => {
    describe('body merging', () => {
        describe('merging disabled', () => {
            it('should not merge nearby bodies', () => {
                const universe = new Universe({
                    totalBodies: 20,
                    size: Number.EPSILON,
                    bodyDistribution: new EllipsoidBodyDistribution(),
                    shouldMergeNearbyBodies: false,
                })
                universe.universeStep()
                expect(universe.getBodyCount()).toBe(20)
            })
        
            it('should not merge bodies that are not nearby', () => {
                const universe = new Universe({
                    totalBodies: 2,
                    size: 100000,
                    bodyDistribution: new SphereBodyDistribution(),
                    shouldMergeNearbyBodies: false,
                })
                universe.universeStep()
                expect(universe.getBodyCount()).toBe(2)
            })        
        })

        describe('merging enabled', () => {
            it('should merge nearby bodies', () => {
                const universe = new Universe({
                    totalBodies: 20,
                    size: Number.EPSILON,
                    bodyDistribution: new EllipsoidBodyDistribution(),
                    shouldMergeNearbyBodies: true,
                })
                universe.universeStep()
                expect(universe.getBodyCount()).toBeLessThan(20)
            })
        
            it('should not merge bodies that are not nearby', () => {
                const universe = new Universe({
                    totalBodies: 2,
                    size: 100000,
                    bodyDistribution: new SphereBodyDistribution(),
                    shouldMergeNearbyBodies: true,
                })
                universe.universeStep()
                expect(universe.getBodyCount()).toBe(2)
            })
        })
    })
})