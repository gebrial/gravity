import p5 from "p5"

export function zeroCenteredRandom(): number {
    return Math.random() * 2 - 1
}

export function insideEllipsoid(position: p5.Vector, radius: p5.Vector): boolean {
    const xComponent = position.x * position.x / radius.x / radius.x
    const yComponent = position.y * position.y / radius.y / radius.y
    const zComponent = position.z * position.z / radius.z / radius.z
    return xComponent + yComponent + zComponent <= 1
}

export function getRandomVectorInUnitSphere(): p5.Vector {
    let vector
    do {
        vector = new p5.Vector(
            zeroCenteredRandom(),
            zeroCenteredRandom(),
            zeroCenteredRandom(),
        )
    } while (vector.magSq() > 1)
    return vector
}

export function getRandomGuassian(): number {
    // Box-Muller transform
    const u1 = Math.random()
    const u2 = Math.random()
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

export function getRandomCauchy(): number {
    const u1 = getRandomGuassian()
    const u2 = getRandomGuassian()
    return u1 / u2
}