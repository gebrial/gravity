import Universe from "./Universe"
import p5 from "p5"
import Slider from "./app/inputs/Slider"

let bodyCountSlider: Slider
function setBodyCountSliderAttributes(): void {
  bodyCountSlider.setPosition(0)
  bodyCountSlider.style('width', '80px');
  bodyCountSlider.attribute("min", "1")
  bodyCountSlider.attribute("max", "1000")
  bodyCountSlider.value(600)
}

const size = 800
let universe: Universe

export const iterateUniverse = (): void => {
  const sketch = (p: p5) => {
    p.setup = () => {
      const body = document.body
      body.style.margin = "0"
      body.style.padding = "0"
      body.style.overflow = "hidden"
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      p.createCanvas(windowWidth, windowHeight, p.WEBGL)

      bodyCountSlider = new Slider(p)
      setBodyCountSliderAttributes()

      universe = new Universe(bodyCountSlider.numberValue(), size)
    }

    p.draw = () => {
      if (bodyCountSlider.valueChanged()) {
        bodyCountSlider.updateValue()
        universe = new Universe(bodyCountSlider.numberValue(), size)
      }

      p.background(0, 0, 0)
      p.orbitControl()
      universe.universeStep()
      const centerOfMass = universe.getCenterOfMass()
      p.translate(centerOfMass.mult(-1))
      p.fill(255)
      p.stroke(255)
      universe.draw(p)
    }

    p.windowResized = () => {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      p.resizeCanvas(windowWidth, windowHeight)
    }
  }

  new p5(sketch)
}
