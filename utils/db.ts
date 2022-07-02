import {createPool} from "mysql2/promise";
import {config} from "../config/config";

export const pool = createPool({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbDatabase,
    namedPlaceholders: true,
    decimalNumbers: true,
    timezone: '+0100',
})

// Baza danych:	bikegara_api
// Host:	localhost
// Nazwa użytkownika:	bikegara_api
// Hasło:	C5cCMs4k