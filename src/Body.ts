// to use p5 global functions you need to use p5 instance:
// https://p5js.org/reference/#/p5/p5
import p5 from "p5"

export default class Body {
  private mass = 1
  private position: p5.Vector = new p5.Vector()
  private previousPosition: p5.Vector = new p5.Vector()
  private force: p5.Vector = new p5.Vector()
  private radius = Math.pow(this.mass * 10, 1./3)

  /**
   * Calculates the acceleration at position otherPosition by this body
   * @param otherPosition
   */
  public getAccelerationFromThis(otherPosition: p5.Vector): p5.Vector {
    return Body.getAcceleration(otherPosition, this.position, this.mass)
  }

  /**
   * Calculates the acceleration at position thisPosition by a body with mass otherMass at position otherPosition
   * @param thisPosition
   * @param otherPosition
   * @param otherMass
   */
  public static getAcceleration(thisPosition: p5.Vector, otherPosition: p5.Vector, otherMass: number): p5.Vector {
    const displacement = p5.Vector.sub(otherPosition, thisPosition)
    return displacement.mult(otherMass / Math.pow(displacement.magSq(), 3/2))
  }

  public getPosition(): p5.Vector {
    return this.position.copy()
  }

  public setPosition(position: p5.Vector): void {
    this.position = position.copy()
  }

  public getVelocity(): p5.Vector {
    return this.position.copy().sub(this.previousPosition)
  }

  public setVelocity(velocity: p5.Vector): void {
    this.previousPosition = this.position.copy().sub(velocity)
  }

  public getMass(): number {
    return this.mass
  }

  public setMass(mass: number): void {
    this.mass = mass
    this.radius = Math.pow(this.mass * 10, 1./3)
  }

  public applyForce(force: p5.Vector): void {
    this.force.add(force)
  }

  public bodyStep(): void {
    const acceleration = this.force.div(this.mass)
    const newPosition = acceleration.add(
      this.position.copy().mult(2)
    ).sub(this.previousPosition)
    this.previousPosition.set(this.position)
    this.position.set(newPosition)
    this.force.mult(0)
  }

  public draw(p: p5): void {
    p.push()
    p.translate(this.position)
    p.sphere(this.getRadius())
    p.pop()
  }

  public getRadius(): number {
    return this.radius
  }
}
