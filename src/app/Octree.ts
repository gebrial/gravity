import p5 from "p5"
import Body from "../Body"

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
  