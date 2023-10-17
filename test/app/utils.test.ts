import { mixHues } from "../../src/app/utils"

describe('utils', () => {
    describe('mixHues', () => {
        // mixHues should average the hues of two bodies, weighted by their mass
        it('hue only differences', () => {
            expect(mixHues({hue: 0, mass: 1}, {hue: 1, mass: 1})).toBe(0.5)
            expect(mixHues({hue: 0, mass: 1}, {hue: 2, mass: 1})).toBe(1)
            expect(mixHues({hue: 0, mass: 1}, {hue: 3, mass: 1})).toBe(1.5)
            expect(mixHues({hue: 0, mass: 1}, {hue: 4, mass: 1})).toBe(2)

            expect(mixHues({hue: 100, mass: 1}, {hue: 200, mass: 1})).toBe(150)
            expect(mixHues({hue: 200, mass: 1}, {hue: 100, mass: 1})).toBe(150)
        })

        it('mass differences only', () => {
            expect(mixHues({hue: 0, mass: 1}, {hue: 0, mass: 2})).toBe(0)
            expect(mixHues({hue: 0, mass: 1}, {hue: 0, mass: 3})).toBe(0)
            expect(mixHues({hue: 0, mass: 1}, {hue: 0, mass: 4})).toBe(0)

            expect(mixHues({hue: 100, mass: 1}, {hue: 100, mass: 1000})).toBe(100)
            expect(mixHues({hue: 10, mass: 1000}, {hue: 10, mass: 1})).toBe(10)
        })

        it('hue and mass differences', () => {
            expect(mixHues({hue: 0, mass: 1}, {hue: 1, mass: 2})).toBe(2/3)
            expect(mixHues({hue: 0, mass: 1}, {hue: 2, mass: 2})).toBe(4/3)
            expect(mixHues({hue: 0, mass: 1}, {hue: 3, mass: 2})).toBe(2)

            expect(mixHues({hue: 200, mass: 10}, {hue: 100, mass: 20})).toBe((200*10 + 100*20)/30)
            expect(mixHues({hue: 100, mass: 20}, {hue: 200, mass: 10})).toBe((200*10 + 100*20)/30)
        })

        it('big hue differences only', () => {
            expect(mixHues({hue: 30, mass: 1}, {hue: 226, mass: 1})).toBe(0)
            expect(mixHues({hue: 226, mass: 1}, {hue: 30, mass: 1})).toBe(0)
            
            expect(mixHues({hue: 20, mass: 1}, {hue: 226, mass: 1})).toBe(251)
            expect(mixHues({hue: 10, mass: 1}, {hue: 226, mass: 1})).toBe(246)
            expect(mixHues({hue: 0, mass: 1}, {hue: 226, mass: 1})).toBe(241)
        })
    })
})