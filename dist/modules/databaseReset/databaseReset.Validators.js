"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_validators_1 = __importDefault(require("../../abstracts/abstract.validators"));
class DatabaseResetValidators extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.database = [this.permissions.check(this.resources.database_backup, 'create')];
    }
}
exports.default = DatabaseResetValidators;
//# sourceMappingURL=databaseReset.Validators.js.map