import p5 from "p5"

export default class Select extends p5.Element {
    private select: p5.Element
    private newValue: string = this.value().toString()

    constructor(p: p5) {
        const select = p.createSelect()
        super(select.elt, p)
        this.select = select
    }

    public setPosition(index: number): Select {
        this.position(10, 10 + index * 22)
        return this
    }

    public addOption(name: string, value?: string): Select {
        // @ts-ignore
        this.select.option(name, value)
        return this
    }

    public disableOption(name: string): Select {
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