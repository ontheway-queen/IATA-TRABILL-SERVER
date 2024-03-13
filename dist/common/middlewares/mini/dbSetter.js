"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DBSetter {
    setDb(req, _res, next) {
        // const [user] = req.subdomains;
        // req.user = req.headers.tenant as string;
        req.role_id = 1;
        next();
    }
}
exports.default = DBSetter;
//# sourceMappingURL=dbSetter.js.map