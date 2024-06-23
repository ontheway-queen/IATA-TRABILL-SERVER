"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const admin_auth_router_1 = __importDefault(require("../auth/admin_auth.router"));
const checkAuth_1 = __importDefault(require("../common/middlewares/authChecker/checkAuth"));
const errorHandler_1 = __importDefault(require("../common/middlewares/errorHandlers/errorHandler"));
const mini_1 = __importDefault(require("../common/middlewares/mini/mini"));
const config_1 = __importDefault(require("../config/config"));
const routes_1 = __importDefault(require("./routes"));
const logger_1 = __importDefault(require("../common/utils/logger/logger"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = config_1.default.PORT;
        this.authChecker = new checkAuth_1.default();
        this.miniMW = new mini_1.default();
        this.log = new logger_1.default();
        this.initMiddlewares();
        this.initRouters(new admin_auth_router_1.default());
        this.moduleRouters();
        this.notFoundRouter();
        this.errorHandler();
        const desiredTimezone = 'Asia/Dhaka';
        moment_timezone_1.default.tz.setDefault(desiredTimezone);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`server is listening at ${this.port}....`);
        });
    }
    initMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, morgan_1.default)('dev', {
            skip: (req, res) => req.originalUrl === '/metrics',
        }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cors_1.default)({ origin: this.miniMW.cors, credentials: true }));
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
    }
    initRouters(adminRouter) {
        this.app.get('/', (_req, res) => {
            res.send('app is running successfully...');
        });
        this.app.use('/api/v1/auth', adminRouter.routers);
    }
    moduleRouters() {
        /**
         * @router {Auth checker}
         */
        this.app.use(this.authChecker.check);
        (0, routes_1.default)(this.app);
    }
    notFoundRouter() {
        this.app.use(this.miniMW[404]);
    }
    errorHandler() {
        const errorHandler = new errorHandler_1.default();
        this.app.use(errorHandler.handleErrors);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map