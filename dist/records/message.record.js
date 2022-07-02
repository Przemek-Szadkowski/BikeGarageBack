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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRecord = void 0;
const db_1 = require("../utils/db");
const uuid_1 = require("uuid");
const errors_1 = require("../utils/errors");
class MessageRecord {
    constructor(obj) {
        if (obj.text.length > 255) {
            throw new errors_1.ValidationError('Wiadomość nie może być dłuższa niż 255 znaków.');
        }
        if (obj.isClientAsk !== 0 && obj.isClientAsk !== 1) {
            throw new errors_1.ValidationError('Flaga symbolizująca pytanie klienta bądż odpowiedź serwisu może mieć wartoś 0 lub 1.');
        }
        if (obj.isNew !== 0 && obj.isNew !== 1) {
            throw new errors_1.ValidationError('Flaga symbolizująca nową wiadomość musi mieć oznaczenie 1, a wiadomość starszą 0.');
        }
        this.id = obj.id;
        this.text = obj.text;
        this.isClientAsk = obj.isClientAsk;
        this.isNew = obj.isNew;
    }
    static getMessagesById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [results] = yield db_1.pool.execute("SELECT `messages`.`id`, `messages`.`text`, `messages`.`isClientAsk`, `messages`.`isNew` FROM `messages` JOIN `bikes_messages` ON `messages`.`id` = `bikes_messages`.`msgId` JOIN `bikes` ON `bikes_messages`.`bikeId` = `bikes`.`id` WHERE `bikes_messages`.`bikeId` = :id", {
                id,
            });
            const messages = [];
            if (results.length !== 0) {
                results.forEach(result => messages.push(new MessageRecord(result)));
            }
            return results.length === 0 ? null : messages;
        });
    }
    changeMessageStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.pool.execute("UPDATE `messages` JOIN `bikes_messages` ON `messages`.`id` = `bikes_messages`.`msgId` JOIN `bikes` ON `bikes_messages`.`bikeId` = `bikes`.`id` SET `messages`.`isNew` = 0 WHERE `bikes_messages`.`bikeId` = :id", {
                id,
            });
        });
    }
    insertMessage(bikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id) {
                this.id = (0, uuid_1.v4)();
            }
            else {
                throw new Error('Nie można zapisać wiadomości, która już jest zapisana');
            }
            yield db_1.pool.execute("INSERT INTO `messages` (`id`, `text`, `isClientAsk`, `isNew`) VALUES(:id,:text,:isClientAsk,:isNew)", this);
            yield db_1.pool.execute("INSERT INTO `bikes_messages` (`bikeId`, `msgId`) VALUES(:bikeId,:id)", {
                bikeId,
                id: this.id,
            });
        });
    }
}
exports.MessageRecord = MessageRecord;
//# sourceMappingURL=message.record.js.map