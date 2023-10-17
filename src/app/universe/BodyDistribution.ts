import p5 from "p5"
import { UniverseInitializationOptions } from "../../Universe"
import { insideEllipsoid, zeroCenteredRandom } from "../utils"
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
        let initialPosition
        do {
          initialPosition = new p5.Vector(
            zeroCenteredRandom() * size,
            zeroCenteredRandom() * size / 10,
            zeroCenteredRandom() * size,
          )
        } while (!insideEllipsoid(initialPosition, new p5.Vector(size, size/10, size)))
        newBody.setPosition(initialPosition)
        newBody.setVelocity(new p5.Vector(0, 0, 0))
        newBody.setMass(Math.random())
        bodies.push(newBody)
      }
      return bodies
    }
}
