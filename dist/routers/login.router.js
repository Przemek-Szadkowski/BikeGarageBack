"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRouter = void 0;
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../utils/db");
exports.loginRouter = (0, express_1.Router)()
    .post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body.credentials;
    const results = yield db_1.pool.execute("SELECT * FROM `admin` WHERE login = :login", {
        login: username,
    });
    if (results[0].length === 0) {
        return res.status(401).json({
            error: 'Nie znaleziono użytkownika!',
        });
    }
    const admin = results[0][0];
    try {
        if (yield bcrypt_1.default.compare(password, admin.password)) {
            const token = jsonwebtoken_1.default.sign({ userId: admin.id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
            yield res.send({
                token: token,
            });
        }
        else {
            return res.status(401).json({
                error: 'Nieprawidłowe hasło!',
            });
        }
    }
    catch (_a) {
        res.status(500).json({
            error: 'Przepraszamy za chwilowe utrudnienia. Spróbuj ponownie za 2 minuty!',
        });
    }
}));
//# sourceMappingURL=login.router.js.map