"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Constants {
    static fields(count) {
        const fields = [];
        for (let i = 0; i < count; i++) {
            fields.push({ name: `scan_copy_${i}`, maxCount: 1 });
        }
        return fields;
    }
}
exports.default = Constants;
//# sourceMappingURL=constants.js.map