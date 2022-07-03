"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const promise_1 = require("mysql2/promise");
const config_1 = require("../config/config");
exports.pool = (0, promise_1.createPool)({
    host: config_1.config.dbHost,
    user: config_1.config.dbUser,
    password: config_1.config.dbPassword,
    database: config_1.config.dbDatabase,
    namedPlaceholders: true,
    decimalNumbers: true,
    timezone: '+0100',
});
// Baza danych:	bikegara_api
// Host:	localhost
// Nazwa użytkownika:	bikegara_api
// Hasło:	C5cCMs4k
//# sourceMappingURL=db.js.map