import { Octree } from "./Universe"
import Body from "./Body"
import p5 from "p5"
import spyOn = jest.spyOn

function getCenterOfMass(bodies: Body[]): p5.Vector {
  const centerOfMass = new p5.Vector(0, 0)
  let totalMass = 0
  for (let i = 0; i < bodies.length; i++) {
    const bodyMass = bodies[i].getMass()
    totalMass += bodyMass
    centerOfMass.add(bodies[i].getPosition().mult(bodyMass))
  }
  centerOfMass.div(totalMass)
  return centerOfMass
}

describe('octree', () => {
  it('store a body and get mass information', () => {
    const body: Body = new Body()
    const octree: Octree = new Octree([body], new p5.Vector(), 1)
    expect(octree.getCenterOfMass()).toEqual(body.getPosition())
    expect(octree.getTotalMass()).toEqual(body.getMass())
  })

  it('store a body and get force information', () => {
    const body: Body = new Body()
    const octree: Octree = new Octree([body], new p5.Vector(), 1)
    const somePosition = new p5.Vector(1, 0, 0)
    const expectedAcceleration = Body.getAcceleration(somePosition, body.getPosition(), body.getMass())
    expect(p5.Vector.dist(octree.getAcceleration(somePosition), expectedAcceleration)).toBeLessThan(expectedAcceleration.mag()/100)
  })

  it('store multiple bodies and get mass information', () => {
    const bodies: Body[] = []
    for (let i = 0; i < 10; i++) {
      const newBody = new Body()
      newBody.setMass(Math.random())
      newBody.setPosition(new p5.Vector(Math.random(), Math.random(), Math.random()))
      bodies.push(newBody)
    }
    const octree: Octree = new Octree(bodies, new p5.Vector(-2, -2, -2), 4)
    const bodiesMass = bodies.reduce((acc, body) => acc + body.getMass(), 0)
    expect(octree.getTotalMass() - bodiesMass).toBeLessThan(Number.EPSILON*bodies.length)
    const octreeCenterOfMass = octree.getCenterOfMass()
    const realCenterOfMass = getCenterOfMass(bodies)
    expect(p5.Vector.dist(octreeCenterOfMass, realCenterOfMass)).toBeLessThan(Number.EPSILON*bodies.length)
  })

  it('store multiple bodies and get force information', () => {
    const testingPosition = new p5.Vector(Math.random(), Math.random(), Math.random())
    const bodies: Body[] = []
    const totalAcceleration = new p5.Vector()
    for (let i = 0; i < 10; i++) {
      const newBody = new Body()
      newBody.setMass(Math.random())
      newBody.setPosition(new p5.Vector(Math.random(), Math.random(), Math.random()))
      bodies.push(newBody)

      totalAcceleration.add(newBody.getAccelerationFromThis(testingPosition))
    }
    const octree: Octree = new Octree(bodies, new p5.Vector(-2, -2, -2), 4)
    expect(p5.Vector.dist(octree.getAcceleration(testingPosition), totalAcceleration)).toBeLessThan(totalAcceleration.mag()/100)
  })

  it('store multiple bodies and get force information with few calls', () => {
    const testingPosition = new p5.Vector(Math.random(), Math.random(), Math.random()).setMag(100)
    const bodies: Body[] = []
    const totalAcceleration = new p5.Vector()
    for (let i = 0; i < 10; i++) {
      const newBody = new Body()
      newBody.setMass(Math.random())
      newBody.setPosition(new p5.Vector(Math.random(), Math.random(), Math.random()))
      bodies.push(newBody)

      totalAcceleration.add(newBody.getAccelerationFromThis(testingPosition))
    }
    const octree: Octree = new Octree(bodies, new p5.Vector(-2, -2, -2), 4)
    spyOn(Body, 'getAcceleration')
    const octreeAcceleration = octree.getAcceleration(testingPosition, 1)
    expect(p5.Vector.dist(octreeAcceleration, totalAcceleration)).toBeLessThan(totalAcceleration.mag()/100)
    expect(Body.getAcceleration).toHaveBeenCalledTimes(1)
  })

  it('get acceleration for point at body of multiple bodies', () => {
    let testingPosition: p5.Vector
    const bodies: Body[] = []
    const totalAcceleration = new p5.Vector()
    for (let i = 0; i < 10; i++) {
      const newBody = new Body()
      newBody.setMass(Math.random())
      newBody.setPosition(new p5.Vector(Math.random(), Math.random(), Math.random()))
      bodies.push(newBody)
      testingPosition = bodies[0].getPosition()

      totalAcceleration.add(newBody.getAccelerationFromThis(testingPosition))
    }
    testingPosition = bodies[0].getPosition()
    const octree: Octree = new Octree(bodies, new p5.Vector(-2, -2, -2), 4)
    const octreeAcceleration = octree.getAcceleration(testingPosition, 0)
    expect(p5.Vector.dist(octreeAcceleration, totalAcceleration)).toBeLessThan(Number.EPSILON*bodies.length)
  })

  it('get acceleration for point at body of single body', () => {
    const octree: Octree = new Octree([new Body()], new p5.Vector(-0.5, -0.5, -0.5), 1)
    const octreeAcceleration = octree.getAcceleration(new p5.Vector())
    expect(p5.Vector.dist(octreeAcceleration, new p5.Vector())).toBeLessThan(Number.EPSILON)
  })
})
