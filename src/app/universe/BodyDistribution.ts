import p5 from "p5"
import { UniverseInitializationOptions } from "../../Universe"
import { getRandomVectorInUnitSphere } from "../utils"
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
            const initialPosition = getRandomVectorInUnitSphere().mult(size)
            newBody.setPosition(initialPosition)
            newBody.setVelocity(new p5.Vector(0, 0, 0))
            newBody.setMass(Math.random())
            bodies.push(newBody)    
        }
        return bodies
    }
}
