import p5 from "p5";
export default class Select extends p5.Element {
    private select;
    private newValue;
    constructor(p: p5, selectElement: p5.Element);
    setPosition(index: number): Select;
    addOption(name: string, value?: string): Select;
    disableOption(name: string): Select;
    valueChanged(): boolean;
    updateValue(): void;
}
