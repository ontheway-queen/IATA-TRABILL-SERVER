"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationErr extends Error {
    constructor(error) {
        super(error.array()[0].msg);
        (this.status = 400),
            (this.type = `Invalid input type for '${error.array()[0].param}'`);
    }
}
exports.default = ValidationErr;
//# sourceMappingURL=validationError.js.map