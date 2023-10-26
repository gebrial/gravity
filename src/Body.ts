// to use p5 global functions you need to use p5 instance:
// https://p5js.org/reference/#/p5/p5
import p5 from "p5"

export default class Body {
  private mass = 1
  private position: p5.Vector = new p5.Vector()
  private velocity: p5.Vector = new p5.Vector()
  private acceleration: p5.Vector = new p5.Vector()
  private radius = Math.pow(this.mass * 10, 1./3)
  private hue: number = Math.random() * 256

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
    if (p5.Vector.dist(thisPosition, otherPosition) < Number.EPSILON*3) {
      return new p5.Vector()
    }
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
    return this.velocity.copy()
  }

  public setVelocity(velocity: p5.Vector): void {
    this.velocity = velocity.copy()
  }

  public getMass(): number {
    return this.mass
  }

  public setMass(mass: number): void {
    this.mass = mass
    this.radius = Math.pow(this.mass * 10, 1./3)
  }

  public getHue(): number {
    return this.hue
  }

  public setHue(hue: number): void {
    this.hue = hue
  }

  public resetAcceleration(): void {
    this.acceleration.set(0, 0, 0)
  }

  public addAcceleration(acceleration: p5.Vector): void {
    this.acceleration.add(acceleration)
  }

  public getAcceleration(): p5.Vector {
    return this.acceleration.copy()
  }

  public bodyStep(): void {
    this.position.add(this.velocity).add(this.acceleration)
    this.velocity.add(this.acceleration)
    this.resetAcceleration()
  }

  public draw(p: p5): void {
    p.push()

    p.colorMode(p.HSB)
    const color = p.color(`hsb(${Math.floor(this.hue)}, 100%, 100%)`)
    p.stroke(color)
    p.fill(color)

    p.translate(this.position)
    p.sphere(this.getRadius())
    p.pop()
  }

  public getRadius(): number {
    return this.radius
  }
}
