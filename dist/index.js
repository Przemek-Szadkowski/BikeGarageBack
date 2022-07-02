"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const errors_1 = require("./utils/errors");
const bike_router_1 = require("./routers/bike.router");
const admin_router_1 = require("./routers/admin.router");
const addBike_router_1 = require("./routers/addBike.router");
const editBike_router_1 = require("./routers/editBike.router");
const archive_router_1 = require("./routers/archive.router");
const login_router_1 = require("./routers/login.router");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
}));
app.use((0, express_1.json)());
app.use((0, express_rate_limit_1.default)({
    windowMs: 35 * 60 * 1000,
    max: 100,
}));
//Routes...
app.use('/login', login_router_1.loginRouter);
app.use('/bike', bike_router_1.bikeRouter);
app.use('/admin', admin_router_1.adminRouter);
app.use('/addBike', addBike_router_1.addBikeRouter);
app.use('/editBike', editBike_router_1.editBikeRouter);
app.use('/archive', archive_router_1.archiveRouter);
app.use(errors_1.handleError);
app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3001');
});
//# sourceMappingURL=index.js.map