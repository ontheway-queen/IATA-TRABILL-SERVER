"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClientLib {
    static parseMobileData(mobile) {
        const mobileInfo = [];
        if (mobile) {
            for (let i = 0; i < mobile.length; i++) {
                const element = mobile[i];
                const toPush = element.number;
                mobileInfo.push(toPush);
            }
        }
        return mobileInfo;
    }
}
exports.default = ClientLib;
//# sourceMappingURL=lib.js.map