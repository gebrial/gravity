import p5 from "p5";
export default class Slider extends p5.Element {
    private newValue;
    constructor(p: p5, sliderElement: p5.Element);
    setPosition(index: number): Slider;
    numberValue(): number;
    valueChanged(): boolean;
    updateValue(): void;
}
