"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(message, status, type) {
        super(message);
        this.status = status;
        this.type = type;
    }
}
exports.default = CustomError;
//# sourceMappingURL=customError.js.map