import {createPool} from "mysql2/promise";

export const pool = createPool({
    host: 'localhost',
    user: 'root',
    database: 'bike_garage',
    namedPlaceholders: true,
    decimalNumbers: true,
})