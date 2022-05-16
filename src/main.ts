import Universe from "./Universe"
import p5 from "p5"

const totalBodies = 600
const size = 800
const universe = new Universe(totalBodies, size)
export const iterateUniverse = (): void => {
  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(size, size, p.WEBGL)
    }

    p.draw = () => {
      p.background(0, 0, 0)
      p.orbitControl()
      universe.universeStep()
      const centerOfMass = universe.getCenterOfMass()
      p.translate(centerOfMass.mult(-1))
      p.fill(255)
      p.stroke(255)
      universe.draw(p)
    }
  }

  new p5(sketch)
}
