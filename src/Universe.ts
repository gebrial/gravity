import Body from "./Body"
import p5 from "p5"

export default class Universe {
  private bodies: Body[] = [];
  constructor(totalBodies: number) {
    for (let i = 0; i < totalBodies; i++) {
      const newBody = new Body()
      newBody.setPosition(new p5.Vector(Math.random()*400, Math.random()*400))
      newBody.setVelocity(new p5.Vector(Math.random()*2 - 1, Math.random()*2 - 1))
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
  }

  public draw(p: p5): void {
    for (let i = 0; i < this.bodies.length; i++) {
      this.bodies[i].draw(p)
    }
  }
}
