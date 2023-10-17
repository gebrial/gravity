"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const p5_1 = (0, tslib_1.__importDefault)(require("p5"));
class Select extends p5_1.default.Element {
    constructor(p, selectElement) {
        super(selectElement.elt, p);
        this.newValue = this.value().toString();
        this.select = selectElement;
    }
    setPosition(index) {
        this.position(10, 10 + index * 22);
        return this;
    }
    addOption(name, value) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.select.option(name, value);
        return this;
    }
    disableOption(name) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.select.disable(name);
        return this;
    }
    valueChanged() {
        return this.newValue !== this.value();
    }
    updateValue() {
        this.newValue = this.value().toString();
    }
}
exports.default = Select;
//# sourceMappingURL=Select.js.map