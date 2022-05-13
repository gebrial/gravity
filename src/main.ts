import Universe from "./Universe"
import p5 from "p5"

const totalBodies = 100
const universe = new Universe(totalBodies)
export const iterateUniverse = (): void => {
  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(400, 400)
    }

    p.draw = () => {
      p.background('#000')
      universe.step()
      universe.draw(p)
    }
  }

  new p5(sketch)
}
