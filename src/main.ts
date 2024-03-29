import p5 from "p5"
import Slider from "./app/inputs/Slider"
import Select from "./app/inputs/Select"
import Universe, { UniverseInitializationOptions } from "./Universe"
import { BodyDistribution, EllipsoidBodyDistribution, RingBodyDistribution, SphereBodyDistribution } from "./app/universe/BodyDistribution"

let universeRequiresReset = true

let bodyCountSlider: Slider
function setBodyCountSliderAttributes(): void {
  bodyCountSlider.setPosition(0)
  bodyCountSlider.style('width', '80px');
  bodyCountSlider.attribute("min", "1")
  bodyCountSlider.attribute("max", "1000")
  bodyCountSlider.value(600)
}

function checkAndHandleBodyCountSliderChange(): void {
  if (bodyCountSlider.valueChanged()) {
    bodyCountSlider.updateValue()
    universeRequiresReset = true
  }
}


let bodyDistribution: BodyDistribution = new EllipsoidBodyDistribution()
let initialBodyDistributionSelector: Select
function setInitialBodyDistributionSelectorAttributes(): void {
  initialBodyDistributionSelector.setPosition(1)
  initialBodyDistributionSelector.style('width', '80px');

  initialBodyDistributionSelector.addOption("ellipsoid")
  initialBodyDistributionSelector.addOption("ring")
  initialBodyDistributionSelector.addOption("sphere")

  // todo: implement these
  initialBodyDistributionSelector.addOption("spiral")
  initialBodyDistributionSelector.disableOption("spiral")
  initialBodyDistributionSelector.addOption("uniform")  
  initialBodyDistributionSelector.disableOption("uniform")  
}

function checkAndHandleInitialBodyDistributionSelectorChange(): void {
  if (initialBodyDistributionSelector.valueChanged()) {
    initialBodyDistributionSelector.updateValue()
    const newBodyDistributionString = initialBodyDistributionSelector.value()
    switch (newBodyDistributionString) {
      case "ellipsoid":
        bodyDistribution = new EllipsoidBodyDistribution()
        break
      case "ring":
        bodyDistribution = new RingBodyDistribution()
        break
      case "sphere":
        bodyDistribution = new SphereBodyDistribution()
        break
      default:
        throw new Error(`Unknown body distribution: ${newBodyDistributionString}`)
    }
    universeRequiresReset = true
  }
}

function createNewUniverseIfRequired(): Universe {
  if (!universeRequiresReset) {
    return universe
  }

  const universeInitializationOptions: UniverseInitializationOptions = {
    totalBodies: bodyCountSlider.numberValue(),
    size: size,
    bodyDistribution: bodyDistribution,
    shouldMergeNearbyBodies: true,
  }
  universeRequiresReset = false
  return new Universe(universeInitializationOptions)
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
      p.perspective(p.PI / 3.0, windowWidth / windowHeight, 0.1, 10000000)

      bodyCountSlider = new Slider(p, p.createSlider(1, 100))
      setBodyCountSliderAttributes()

      initialBodyDistributionSelector = new Select(p, p.createSelect())
      setInitialBodyDistributionSelectorAttributes()
      universe = createNewUniverseIfRequired()
    }

    p.draw = () => {
      checkAndHandleBodyCountSliderChange()
      checkAndHandleInitialBodyDistributionSelectorChange()
      universe = createNewUniverseIfRequired()

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
