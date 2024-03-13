"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../app/database");
class AbstractModels {
    constructor(db, req) {
        this.database = database_1.db_name;
        this.trxn = 'trxn';
        this.db = db;
        this.org_agency = req.agency_id;
    }
    query() {
        return this.db.queryBuilder();
    }
}
exports.default = AbstractModels;
//# sourceMappingURL=abstract.models.js.map