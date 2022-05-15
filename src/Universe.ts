import Body from "./Body"
import p5 from "p5"

export default class Universe {
  private bodies: Body[] = [];
  constructor(totalBodies: number, size: number) {
    for (let i = 0; i < totalBodies; i++) {
      const newBody = new Body()
      newBody.setPosition(new p5.Vector(Math.random()*size, Math.random()*size, Math.random()*size))
      newBody.setVelocity(new p5.Vector(Math.random()*2 - 1, Math.random()*2 - 1, Math.random()*2 - 1))
      newBody.setMass(Math.random())
      this.bodies.push(newBody)
    }
  }

  public step(): void {
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const body1 = this.bodies[i]
        const body2 = this.bodies[j]
        const distance = body1.getPosition().dist(body2.getPosition())
        const force = body1.getMass() * body2.getMass() / Math.pow(distance, 2)
        const direction = body1.getPosition().sub(body2.getPosition()).normalize()
        body1.applyForce(direction.mult(-force))
        body2.applyForce(direction.mult(force))
      }
    }
    for (let i = 0; i < this.bodies.length; i++) {
      this.bodies[i].step()
    }

    const bodiesToRemove: Body[] = []
    const bodiesToAdd: Body[] = []
    for (let i = 0; i < this.bodies.length; i++) {
      const body1 = this.bodies[i]
      if (bodiesToRemove.includes(body1)) {
        continue
      }
      for (let j = i + 1; j < this.bodies.length; j++) {
        const body2 = this.bodies[j]
        if (bodiesToRemove.includes(body2)) {
          continue
        }
        const distance = body1.getPosition().dist(body2.getPosition())
        if (distance < body1.getRadius() + body2.getRadius()) {
          const newBody = this.mergeBodies(body1, body2)
          bodiesToRemove.push(body1)
          bodiesToRemove.push(body2)
          bodiesToAdd.push(newBody)
          break
        }
      }
    }
    bodiesToRemove.forEach(body => {
      this.bodies.splice(this.bodies.indexOf(body), 1)
    })
    this.bodies.push(...bodiesToAdd)
  }

  /**
   * Returns a new body object which is the result of merging the two bodies
   * @param body1
   * @param body2
   * @private
   */
  private mergeBodies(body1: Body, body2: Body): Body {
    const body1Mass = body1.getMass()
    const body2Mass = body2.getMass()
    const newMass = body1Mass + body2Mass

    // completely inelastic collision, maximum conversion of kinetic energy to "heat"
    // position and velocity are weighted by mass of each body
    const newPosition = body1.getPosition().mult(body1Mass/newMass).add(body2.getPosition().mult(body2Mass/newMass))
    const newVelocity = body1.getVelocity().mult(body1Mass/newMass).add(body2.getVelocity().mult(body2Mass/newMass))

    const newBody = new Body()
    newBody.setMass(newMass)
    newBody.setPosition(newPosition)
    newBody.setVelocity(newVelocity)
    return newBody
  }

  public draw(p: p5): void {
    for (let i = 0; i < this.bodies.length; i++) {
      this.bodies[i].draw(p)
    }
  }

  public getCenterOfMass(): p5.Vector {
    const centerOfMass = new p5.Vector(0, 0)
    let totalMass = 0
    for (let i = 0; i < this.bodies.length; i++) {
      const bodyMass = this.bodies[i].getMass()
      totalMass += bodyMass
      centerOfMass.add(this.bodies[i].getPosition().mult(bodyMass))
    }
    centerOfMass.div(totalMass)
    return centerOfMass
  }

  /**
   * Returns the standard deviation of the distance between each body and the center of mass
   */
  public getPositionStandardDeviation(): number {
    const centerOfMass = this.getCenterOfMass()
    let totalDistance = 0
    for (let i = 0; i < this.bodies.length; i++) {
      const distance = this.bodies[i].getPosition().sub(centerOfMass).magSq()
      totalDistance += distance
    }
    return Math.sqrt(totalDistance / this.bodies.length)
  }

  public getTotalMomentumVector(): p5.Vector {
    const momentumVector = new p5.Vector(0, 0)
    for (let i = 0; i < this.bodies.length; i++) {
      const body = this.bodies[i]
      momentumVector.add(body.getVelocity().mult(body.getMass()))
    }
    return momentumVector
  }
}
