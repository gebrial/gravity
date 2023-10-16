export function getNumberFromStringOrNumber(value: string | number): number {
    if (typeof value === "string") {
        return parseInt(value)
    }

    return value
  }
  