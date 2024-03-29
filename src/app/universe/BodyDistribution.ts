import p5 from "p5"
import { UniverseInitializationOptions } from "../../Universe"
import { getRandomCauchy, getRandomGuassian, getRandomVectorInUnitSphere, multiply } from "../utils"
import Body from "../../Body"

export abstract class BodyDistribution {
    public abstract initializeBodies(options: UniverseInitializationOptions): Body[]
}
  
export class EllipsoidBodyDistribution extends BodyDistribution {
    public initializeBodies(options: UniverseInitializationOptions): Body[] {
        const bodies: Body[] = []
        const { totalBodies, size } = options
        for (let i = 0; i < totalBodies; i++) {
            const newBody = new Body()
            const initialPosition = getRandomVectorInUnitSphere().mult(
                new p5.Vector(size, size / 10, size),
            )
            newBody.setPosition(initialPosition)
            newBody.setVelocity(new p5.Vector(0, 0, 0))
            newBody.setMass(Math.random())
            bodies.push(newBody)  
        }

        // apply radial velocity based on acceleration
        for (let ii = 0; ii < totalBodies; ii++) {
            // calculate forces applied on every body
            const body1 = bodies[ii]
            const body1Position = body1.getPosition()
            for (let jj = ii + 1; jj < totalBodies; jj++) {
                const body2 = bodies[jj]
                const body2Position = body2.getPosition()
                const direction = body1Position.copy().sub(body2Position)
                const distanceSq = direction.magSq() + size * size / 100 // smoothing factor
                body2.addAcceleration(multiply(direction, body1.getMass() / Math.pow(distanceSq, 3/2)))
                body1.addAcceleration(multiply(direction, -body2.getMass() / body1.getMass()))
            }

            const acceleration = body1.getAcceleration()
            const speed = Math.sqrt(acceleration.mag() * body1.getPosition().mag())

            const angularVelocity = new p5.Vector(0, 1, 0)
            const velocityDirection = body1.getPosition().copy().cross(angularVelocity)
            velocityDirection.setMag(speed / 2)
            body1.setVelocity(velocityDirection)

            body1.resetAcceleration()
        }

        return bodies
    }
}

export class RingBodyDistribution extends BodyDistribution {
    public initializeBodies(options: UniverseInitializationOptions): Body[] {
        const bodies: Body[] = []
        const { totalBodies, size } = options
        for (let i = 0; i < totalBodies; i++) {
            const newBody = new Body()
            const initialAngle = Math.random() * Math.PI * 2
            const offsetDistance = Math.random() * size / 10
            const initialPosition = new p5.Vector(
                Math.cos(initialAngle),
                0,
                Math.sin(initialAngle),
            ).setMag(size)
            const offsetVector = getRandomVectorInUnitSphere().setMag(offsetDistance)
            newBody.setPosition(initialPosition.add(offsetVector))
            newBody.setVelocity(new p5.Vector(0, 0, 0))
            newBody.setMass(Math.random())
            bodies.push(newBody)
          }
        return bodies
    }
}

export class SphereBodyDistribution extends BodyDistribution {
    public initializeBodies(options: UniverseInitializationOptions): Body[] {
        const bodies: Body[] = []
        const { totalBodies, size } = options
        for (let i = 0; i < totalBodies; i++) {
            const newBody = new Body()
            const initialPosition = getRandomVectorInUnitSphere()
                .normalize()
                .mult(size * getRandomGuassian())
            newBody.setPosition(initialPosition)
            newBody.setMass(Math.abs(getRandomCauchy()))
            bodies.push(newBody)
        }

        // calculate potential energy of each body
        for (let ii = 0; ii < totalBodies; ii++) {
            const body1 = bodies[ii]
            const body1Position = body1.getPosition()
            let potentialEnergy = 0
            for (let jj = 0; jj < totalBodies; jj++) {
                if (ii === jj) {
                    continue
                }

                const body2 = bodies[jj]
                const body2Position = body2.getPosition()
                const direction = body1Position.copy().sub(body2Position)
                const distance = direction.mag()
                potentialEnergy -= body1.getMass() * body2.getMass() / distance
            }

            // if we want to emulate a circular orbit, we should divide potential energy by 2, not speed
            // https://openstax.org/books/university-physics-volume-1/pages/13-4-satellite-orbits-and-energy#fs-id1168328363439
            const speed = Math.sqrt(2 * Math.abs(potentialEnergy) / body1.getMass())
            body1.setVelocity(getRandomVectorInUnitSphere().setMag(speed / 2))
        }
        return bodies
    }
}
