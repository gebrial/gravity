import Universe from "./Universe"
import p5 from "p5"

const totalBodies = 500
const size = 800
const universe = new Universe(totalBodies, size)
export const iterateUniverse = (): void => {
  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(size, size)
    }

    p.draw = () => {
      p.background('#000')
      universe.step()
      const centerOfMass = universe.getCenterOfMass()
      p.translate(new p5.Vector(p.width / 2, p.height / 2, 0).sub(centerOfMass))
      universe.draw(p)
    }
  }

  new p5(sketch)
}
