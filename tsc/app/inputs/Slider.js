"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const p5_1 = (0, tslib_1.__importDefault)(require("p5"));
const util_1 = require("./util");
class Slider extends p5_1.default.Element {
    constructor(p, sliderElement) {
        super(sliderElement.elt, p);
        this.newValue = this.numberValue();
    }
    setPosition(index) {
        this.position(10, 10 + index * 22);
        return this;
    }
    numberValue() {
        return (0, util_1.getNumberFromStringOrNumber)(this.value());
    }
    valueChanged() {
        return this.newValue !== this.numberValue();
    }
    updateValue() {
        this.newValue = this.numberValue();
    }
}
exports.default = Slider;
//# sourceMappingURL=Slider.js.map