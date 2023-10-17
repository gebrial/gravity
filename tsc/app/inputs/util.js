"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumberFromStringOrNumber = void 0;
function getNumberFromStringOrNumber(value) {
    if (typeof value === "string") {
        return parseInt(value);
    }
    return value;
}
exports.getNumberFromStringOrNumber = getNumberFromStringOrNumber;
//# sourceMappingURL=util.js.map