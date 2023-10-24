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

export interface BodyHueMass {
    hue: number
    mass: number
}
export function mixHues(body1: BodyHueMass, body2: BodyHueMass): number {
    const hue1 = body1.hue
    const hue2 = body2.hue

    const mass1 = body1.mass
    const mass2 = body2.mass

    if (Math.abs(hue1 - hue2) > 256/2) {
        // big hue difference, wrap around
        if (hue1 < hue2) {
            return mixHues({hue: hue1 + 256, mass: mass1}, body2) % 256
        } else {
            return mixHues(body1, {hue: hue2 + 256, mass: mass2}) % 256
        }
    }
    return (body1.hue * mass1 + body2.hue * mass2) / (mass1 + mass2)
}

  /**
   * Multiplies the vector by the scalar in place.
   * The built in p5.Vector.mult() function takes longer to execute than this one.
   * @param vector
   * @param scalar
   * @private
   */
  export function multiply(vector: p5.Vector, scalar: number): p5.Vector {
    return vector.set(vector.x * scalar, vector.y * scalar, vector.z * scalar)
  }
