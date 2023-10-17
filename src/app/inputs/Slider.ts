import p5 from "p5"
import { getNumberFromStringOrNumber } from "./util"

export default class Slider extends p5.Element{
    private newValue: number = this.numberValue()

    constructor(p: p5, sliderElement: p5.Element) {
        super(sliderElement.elt, p)
    }

    public setPosition(index: number): Slider {
        this.position(10, 10 + index * 22)
        return this
    }

    public numberValue(): number {
        return getNumberFromStringOrNumber(this.value())
    }

    public valueChanged(): boolean {
        return this.newValue !== this.numberValue()
    }

    public updateValue(): void {
        this.newValue = this.numberValue()
    }
}