import { Octree } from "./Universe"
import Body from "./Body"
import p5 from "p5"

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
})
