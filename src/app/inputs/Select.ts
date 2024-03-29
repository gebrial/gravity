import p5 from "p5"

export default class Select extends p5.Element {
    private select: p5.Element
    private newValue: string = this.value().toString()

    constructor(p: p5, selectElement: p5.Element) {
        super(selectElement.elt, p)
        this.select = selectElement
    }

    public setPosition(index: number): Select {
        this.position(10, 10 + index * 22)
        return this
    }

    public addOption(name: string, value?: string): Select {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.select.option(name, value)
        return this
    }

    public disableOption(name: string): Select {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.select.disable(name)
        return this
    }

    public valueChanged(): boolean {
        return this.newValue !== this.value()
    }

    public updateValue(): void {
        this.newValue = this.value().toString()
    }
}