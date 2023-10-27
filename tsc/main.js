"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterateUniverse = void 0;
const tslib_1 = require("tslib");
const p5_1 = (0, tslib_1.__importDefault)(require("p5"));
const Slider_1 = (0, tslib_1.__importDefault)(require("./app/inputs/Slider"));
const Select_1 = (0, tslib_1.__importDefault)(require("./app/inputs/Select"));
const Universe_1 = (0, tslib_1.__importDefault)(require("./Universe"));
const BodyDistribution_1 = require("./app/universe/BodyDistribution");
let universeRequiresReset = true;
let bodyCountSlider;
function setBodyCountSliderAttributes() {
    bodyCountSlider.setPosition(0);
    bodyCountSlider.style('width', '80px');
    bodyCountSlider.attribute("min", "1");
    bodyCountSlider.attribute("max", "1000");
    bodyCountSlider.value(600);
}
function checkAndHandleBodyCountSliderChange() {
    if (bodyCountSlider.valueChanged()) {
        bodyCountSlider.updateValue();
        universeRequiresReset = true;
    }
}
let bodyDistribution = new BodyDistribution_1.EllipsoidBodyDistribution();
let initialBodyDistributionSelector;
function setInitialBodyDistributionSelectorAttributes() {
    initialBodyDistributionSelector.setPosition(1);
    initialBodyDistributionSelector.style('width', '80px');
    initialBodyDistributionSelector.addOption("ellipsoid");
    initialBodyDistributionSelector.addOption("ring");
    initialBodyDistributionSelector.addOption("sphere");
    // todo: implement these
    initialBodyDistributionSelector.addOption("spiral");
    initialBodyDistributionSelector.disableOption("spiral");
    initialBodyDistributionSelector.addOption("uniform");
    initialBodyDistributionSelector.disableOption("uniform");
}
function checkAndHandleInitialBodyDistributionSelectorChange() {
    if (initialBodyDistributionSelector.valueChanged()) {
        initialBodyDistributionSelector.updateValue();
        const newBodyDistributionString = initialBodyDistributionSelector.value();
        switch (newBodyDistributionString) {
            case "ellipsoid":
                bodyDistribution = new BodyDistribution_1.EllipsoidBodyDistribution();
                break;
            case "ring":
                bodyDistribution = new BodyDistribution_1.RingBodyDistribution();
                break;
            case "sphere":
                bodyDistribution = new BodyDistribution_1.SphereBodyDistribution();
                break;
            default:
                throw new Error(`Unknown body distribution: ${newBodyDistributionString}`);
        }
        universeRequiresReset = true;
    }
}
function createNewUniverseIfRequired() {
    if (!universeRequiresReset) {
        return universe;
    }
    const universeInitializationOptions = {
        totalBodies: bodyCountSlider.numberValue(),
        size: size,
        bodyDistribution: bodyDistribution,
        shouldMergeNearbyBodies: true,
    };
    universeRequiresReset = false;
    return new Universe_1.default(universeInitializationOptions);
}
const size = 800;
let universe;
const iterateUniverse = () => {
    const sketch = (p) => {
        p.setup = () => {
            const body = document.body;
            body.style.margin = "0";
            body.style.padding = "0";
            body.style.overflow = "hidden";
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            p.createCanvas(windowWidth, windowHeight, p.WEBGL);
            p.perspective(p.PI / 3.0, windowWidth / windowHeight, 0.1, 10000000);
            bodyCountSlider = new Slider_1.default(p, p.createSlider(1, 100));
            setBodyCountSliderAttributes();
            initialBodyDistributionSelector = new Select_1.default(p, p.createSelect());
            setInitialBodyDistributionSelectorAttributes();
            universe = createNewUniverseIfRequired();
        };
        p.draw = () => {
            checkAndHandleBodyCountSliderChange();
            checkAndHandleInitialBodyDistributionSelectorChange();
            universe = createNewUniverseIfRequired();
            p.background(0, 0, 0);
            p.orbitControl();
            universe.universeStep();
            const centerOfMass = universe.getCenterOfMass();
            p.translate(centerOfMass.mult(-1));
            p.fill(255);
            p.stroke(255);
            universe.draw(p);
        };
        p.windowResized = () => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            p.resizeCanvas(windowWidth, windowHeight);
        };
    };
    new p5_1.default(sketch);
};
exports.iterateUniverse = iterateUniverse;
//# sourceMappingURL=main.js.map