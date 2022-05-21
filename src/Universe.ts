import Body from "./Body"
import p5 from "p5"

export class Octree {
  private leaf: Body | undefined
  private children: Octree[] | undefined
  private startCorner: p5.Vector
  private size: number
  private totalMass = 0
  private centerOfMass = new p5.Vector
  private itemRecentlyAdded = false

  constructor(items: Body[], startCorner: p5.Vector, size: number) {
    this.startCorner = startCorner
    this.size = size
    if (items.length > 1) {
      this.children = this.createChildOctrees(startCorner, size)
    }

    this.addItems(items)
  }

  public addItems(items: Body[]): void {
    this.itemRecentlyAdded = true
    for (const item of items) {
      this.addItem(item)
    }
  }

  public addItem(item: Body): void {
    this.itemRecentlyAdded = true
    if (!this.leaf && !this.children) {
      // first element
      return this.addFirstItem(item)
    }

    this.addNonFirstItem(item)
  }

  private addFirstItem(item: Body): void {
    if (this.leaf || this.children) {
      throw new Error('first item already exists')
    }
    this.leaf = item
  }

  private addNonFirstItem(item: Body): void {
    if (!this.children) {
      this.children = this.createChildOctrees(this.startCorner, this.size)
    }

    if (this.leaf) {
      const tmp = this.leaf
      this.leaf = undefined
      this.addNonFirstItem(tmp)
    }

    let itemAdded = false
    this.children.forEach((child: Octree) => {
      if (child.isPointInside(item.getPosition())) {
        if (itemAdded) {
          throw new Error('item added to multiple octant')
        }

        itemAdded = true
        child.addItem(item)
      }
    })
  }

  public isPointInside(point: p5.Vector): boolean {
    if (point.x < this.startCorner.x || point.x >= this.startCorner.x + this.size) {
      return false
    }
    if (point.y < this.startCorner.y || point.y >= this.startCorner.y + this.size) {
      return false
    }
    if (point.z < this.startCorner.z || point.z >= this.startCorner.z + this.size) {
      return false
    }

    return true
  }

  public getStartCorner(): p5.Vector {
    return this.startCorner.copy()
  }

  public getSize(): number {
    return this.size
  }

  /**
   * Create child octants
   * @param startCorner
   * @param size side length of the parent cube
   * @private
   */
  private createChildOctrees(startCorner: p5.Vector, size: number): Octree[] {
    const octants: Octree[] = []
    for (let i = 0; i <= 1; i++){
      for (let j = 0; j <= 1; j++){
        for (let k = 0; k <= 1; k++){
          octants.push(new Octree([], startCorner.copy().add(
            i * size / 2,
            j * size / 2,
            k * size / 2,
          ), size / 2))
        }
      }
    }
    return octants
  }

  private updateMassInfos(): void {
    this.totalMass = 0
    this.centerOfMass = new p5.Vector()
    if (this.leaf) {
      this.totalMass = this.leaf.getMass()
      this.centerOfMass = this.leaf.getPosition()
    } else {
      this.children?.forEach((child: Octree) => {
        this.totalMass += child.getTotalMass()
      })
      let massSoFar = 0
      this.children?.forEach((child: Octree) => {
        const childMass = child.getTotalMass()
        if (childMass === 0) {
          return
        }
        const totalMass = massSoFar + childMass
        this.centerOfMass.mult(massSoFar/totalMass).add(child.getCenterOfMass().mult(childMass/totalMass))
        massSoFar = totalMass
      })
    }
    this.itemRecentlyAdded = false
  }

  public getTotalMass(): number {
    if (this.itemRecentlyAdded) {
      this.updateMassInfos()
    }

    return this.totalMass
  }

  public getCenterOfMass(): p5.Vector {
    if (this.itemRecentlyAdded) {
      this.updateMassInfos()
    }

    return this.centerOfMass.copy()
  }

  /**
   * Returns the gravitational acceleration caused by this octant on the point
   * @param point
   * @param threshold
   */
  public getAcceleration(point: p5.Vector, threshold = 0): p5.Vector {
    if (this.leaf || !this.isDistanceThesholdExceeded(point, threshold)) {
      return this.getAccelerationByThis(point.copy())
    }

    const acceleration = new p5.Vector()
    this.children?.forEach((child: Octree) => {
      acceleration.add(child.getAcceleration(point, threshold))
    })
    return acceleration
  }

  /**
   * Calculates the gravitational acceleration on a point by this octant
   * @param point
   * @param bodyLocation
   * @param mass
   * @private
   */
  private getAccelerationByThis(point: p5.Vector) {
    return Body.getAcceleration(point, this.getCenterOfMass(), this.getTotalMass())
  }

  /**
   * Checks whether the point is too close to approximate the acceleration based on center of mass.
   * Returns true if further subdivisions are needed.
   * @param point
   * @param threshold
   * @private
   */
  private isDistanceThesholdExceeded(point: p5.Vector, threshold: number): boolean {
    const quotient = this.size / this.getCenterOfMass().dist(point)
    return quotient > threshold
  }
}

export default class Universe {
  private bodies: Body[] = [];
  constructor(totalBodies: number, size: number) {
    for (let i = 0; i < totalBodies; i++) {
      const newBody = new Body()
      let initialPosition
      do {
        initialPosition = new p5.Vector(
          this.random(size),
          this.random(size/10),
          this.random(size)
        )
      } while (!this.insideEllipsoid(initialPosition, size, size/10, size))
      newBody.setPosition(initialPosition)
      newBody.setVelocity(new p5.Vector(
        this.random(),
        this.random(),
        this.random()
      ))
      newBody.setMass(Math.random())
      this.bodies.push(newBody)
    }
  }

  /**
   * Returns whether the position is inside the ellipsoid defined by x, y, z centered at 0, 0, 0
   * @param position
   * @param x x-radius
   * @param y y-radius
   * @param z z-radius
   * @private
   */
  private insideEllipsoid(position: p5.Vector, x: number, y: number, z: number): boolean {
    const xComponent = position.x * position.x / x / x
    const yComponent = position.y * position.y / y / y
    const zComponent = position.z * position.z / z / z
    return xComponent + yComponent + zComponent <= 1
  }

  /**
   * Returns a random number with a maximum magnitude
   * @param maxMagnitude
   */
  private random(maxMagnitude = 0): number {
    return Math.random() * maxMagnitude * 2 - maxMagnitude
  }

  /**
   * Multiplies the vector by the scalar in place.
   * The built in p5.Vector.mult() function takes longer to execute than this one.
   * @param vector
   * @param scalar
   * @private
   */
  private multiply(vector: p5.Vector, scalar: number): p5.Vector {
    return vector.set(vector.x * scalar, vector.y * scalar, vector.z * scalar)
  }

  /**
   * Calculates the gravitational force between two bodies, applies the forces, and updates the positions.
   * @param bodyPositions
   * @private
   */
  private calculateAndApplyForces(bodyPositions: p5.Vector[]): void {
    for (let i = 0; i < this.bodies.length; i++) {
      const body1Position = bodyPositions[i]
      const tmp = new p5.Vector(0, 0, 0)
      for (let j = i + 1; j < this.bodies.length; j++) {
        const body2Position = bodyPositions[j]
        const body1 = this.bodies[i]
        const body2 = this.bodies[j]
        const distanceSq = tmp.set(body1Position).sub(body2Position).magSq()
        const force = body1.getMass() * body2.getMass() / Math.pow(distanceSq, 3/2)
        const direction = tmp
        body2.applyForce(this.multiply(direction, force))
        body1.applyForce(this.multiply(direction, -1))
      }
    }
    for (let i = 0; i < this.bodies.length; i++) {
      this.bodies[i].bodyStep()
    }
  }

  /**
   * Checks body positions for collisions. If there are any then it merges those bodies.
   * @param bodyPositions
   * @private
   */
  private checkAndMergeCollidingBodies(bodyPositions: p5.Vector[]): void {
    const bodiesToRemove: Body[] = []
    const bodiesToAdd: Body[] = []
    for (let i = 0; i < this.bodies.length; i++) {
      const body1 = this.bodies[i]
      if (bodiesToRemove.includes(body1)) {
        continue
      }
      const body1Position = bodyPositions[i]
      const body1Radius = body1.getRadius()
      const tmp = new p5.Vector(0, 0, 0)
      for (let j = i + 1; j < this.bodies.length; j++) {
        const body2 = this.bodies[j]
        if (bodiesToRemove.includes(body2)) {
          continue
        }
        const body2Position = bodyPositions[j]
        const distanceSq = tmp.set(body1Position).sub(body2Position).magSq()
        if (distanceSq < Math.pow(body1Radius + body2.getRadius(), 2)) {
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

  public universeStep(): void {
    const bodyPositions = this.bodies.map(body => body.getPosition())
    this.calculateAndApplyForces(bodyPositions)
    this.checkAndMergeCollidingBodies(bodyPositions)
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
    const momentumVector = new p5.Vector(0, 0, 0)
    for (let i = 0; i < this.bodies.length; i++) {
      const body = this.bodies[i]
      momentumVector.add(body.getVelocity().mult(body.getMass()))
    }
    return momentumVector
  }
}
