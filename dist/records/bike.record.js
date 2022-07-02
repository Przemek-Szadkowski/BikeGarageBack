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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BikeRecord = void 0;
const uuid_1 = require("uuid");
const db_1 = require("../utils/db");
const regex_expressions_1 = require("../utils/regex-expressions");
const errors_1 = require("../utils/errors");
const message_record_1 = require("./message.record");
class BikeRecord {
    constructor(obj) {
        this.comments = '';
        if (!obj.orderNo || obj.orderNo.length > 10) {
            throw new errors_1.ValidationError('Numer zlecenia musi mieć 10 znaków!');
        }
        if (!obj.name || obj.name.length > 26) {
            throw new errors_1.ValidationError('Imię musi zostać podane i nie może być dłuższe niż 26 znaków.');
        }
        if (!obj.surname || obj.surname.length > 26) {
            throw new errors_1.ValidationError('Nazwisko musi zostać podane i nie może być dłuższe niż 50 znaków.');
        }
        if (obj.bikeModel.length > 50) {
            throw new errors_1.ValidationError('Nazwa modelu roweru nie może być dłuższa niż 50 znaków.');
        }
        if (obj.serialNo.length > 50) {
            throw new errors_1.ValidationError('Numer seryjny roweru nie może być dłuższy niż 50 znaków.');
        }
        if (!obj.dateOfReception) {
            throw new errors_1.ValidationError('Data przyjęcia zlecenia musi zostać podana w formacie YYYY-MM-DD');
        }
        if (obj.phoneNo.length > 18) {
            throw new errors_1.ValidationError('Numer telefonu nie może być dłuższy niż 18 znaków');
        }
        if (regex_expressions_1.decimalDownPaymentExpression.test(String(obj.downPayment))) {
            throw new errors_1.ValidationError('Kwota zaliczki musi być zapisana z precyzją do dwóch miejsc po ' +
                'przecinku i nie może być wyższa niż 99999.99 zł.');
        }
        if (obj.status.length > 40) {
            throw new errors_1.ValidationError('Status nie może być dłuższy niż 40 znaków');
        }
        if (obj.comments && obj.comments.length > 65535) {
            throw new errors_1.ValidationError('Komentarz może mieć maksymalnie 65,535 znaków');
        }
        this.id = obj.id;
        this.orderNo = obj.orderNo;
        this.name = obj.name;
        this.surname = obj.surname;
        this.bikeModel = obj.bikeModel;
        this.serialNo = obj.serialNo;
        this.dateOfReception = obj.dateOfReception;
        this.phoneNo = obj.phoneNo;
        this.downPayment = obj.downPayment;
        this.status = obj.status;
        this.comments = obj.comments;
        this.chat = obj.chat;
    }
    static getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [results] = yield db_1.pool.execute("SELECT * FROM `bikes` WHERE id = :id", {
                id,
            });
            return results.length === 0 ? null : new BikeRecord(results[0]);
        });
    }
    static getAllBikes() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const [results] = (yield db_1.pool.execute("SELECT * FROM `bikes` ORDER BY `dateOfReception` DESC"));
            try {
                for (var results_1 = __asyncValues(results), results_1_1; results_1_1 = yield results_1.next(), !results_1_1.done;) {
                    const result = results_1_1.value;
                    result.chat = yield message_record_1.MessageRecord.getMessagesById(result.id);
                    if (!result.chat) {
                        result.chat = [];
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (results_1_1 && !results_1_1.done && (_a = results_1.return)) yield _a.call(results_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return results.map(result => new BikeRecord(result));
        });
    }
    ;
    static getAllArchivedBikes() {
        return __awaiter(this, void 0, void 0, function* () {
            const [results] = (yield db_1.pool.execute("SELECT * FROM `bikes_archive` ORDER BY `dateOfReception` DESC"));
            return results.map(result => new BikeRecord(result));
        });
    }
    ;
    static getOneByOrderNo(orderNo) {
        return __awaiter(this, void 0, void 0, function* () {
            const [results] = yield db_1.pool.execute("SELECT * FROM `bikes` WHERE orderNo = :orderNo", {
                orderNo,
            });
            const messages = yield message_record_1.MessageRecord.getMessagesById(results[0].id);
            return results.length === 0 ? null : new BikeRecord(Object.assign(Object.assign({}, results[0]), { chat: messages }));
        });
    }
    ;
    static getHowManyRecordsAreInArchive() {
        return __awaiter(this, void 0, void 0, function* () {
            const [results] = yield db_1.pool.execute("SELECT COUNT(*) AS records FROM `bikes_archive`");
            return results;
        });
    }
    insertBike() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id) {
                this.id = (0, uuid_1.v4)();
            }
            else {
                throw new Error('Nie można zapisać zlecenia, które już istnieje');
            }
            yield db_1.pool.execute("INSERT INTO `bikes` (`id`, `orderNo`, `name`, `surname`, `bikeModel`, `serialNo`, `dateOfReception`, `phoneNo`, `downPayment`, `status`, `comments`) VALUES(:id, :orderNo, :name, :surname, :bikeModel, :serialNo, :dateOfReception, :phoneNo, :downPayment, :status, :comments)", {
                id: this.id,
                orderNo: this.orderNo,
                name: this.name,
                surname: this.surname,
                bikeModel: this.bikeModel,
                serialNo: this.serialNo,
                dateOfReception: this.dateOfReception,
                phoneNo: this.phoneNo,
                downPayment: this.downPayment,
                status: this.status,
                comments: this.comments
            });
        });
    }
    insertBikeToArchive() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.pool.execute("INSERT INTO `bikes_archive` (`id`, `orderNo`, `name`, `surname`, `bikeModel`, `serialNo`, `dateOfReception`, `phoneNo`, `downPayment`, `status`, `comments`) VALUES(:id, :orderNo, :name, :surname, :bikeModel, :serialNo, :dateOfReception, :phoneNo, :downPayment, :status, :comments)", {
                id: this.id,
                orderNo: this.orderNo,
                name: this.name,
                surname: this.surname,
                bikeModel: this.bikeModel,
                serialNo: this.serialNo,
                dateOfReception: this.dateOfReception,
                phoneNo: this.phoneNo,
                downPayment: this.downPayment,
                status: this.status,
                comments: this.comments
            });
        });
    }
    updateStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.pool.execute("UPDATE `bikes` SET `status` = :status WHERE `id` = :id", {
                id: this.id,
                status,
            });
        });
    }
    update({ id, name, surname, bikeModel, serialNo, phoneNo, downPayment, status, comments }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.pool.execute("UPDATE `bikes` SET `name` = :name, `surname` = :surname, `bikeModel` = :bikeModel, `serialNo` = :serialNo, `phoneNo` = :phoneNo, `downPayment` = :downPayment, `status` = :status, `comments` = :comments WHERE `id` = :id", {
                id,
                name,
                surname,
                bikeModel,
                serialNo,
                phoneNo,
                downPayment,
                status,
                comments,
            });
        });
    }
    deleteBike() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.pool.execute("DELETE FROM `bikes` WHERE `id` = :id", {
                id: this.id,
            });
        });
    }
    ;
}
exports.BikeRecord = BikeRecord;
//# sourceMappingURL=bike.record.js.map