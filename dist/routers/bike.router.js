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
exports.bikeRouter = void 0;
const express_1 = require("express");
const bike_record_1 = require("../records/bike.record");
const message_record_1 = require("../records/message.record");
const errors_1 = require("../utils/errors");
exports.bikeRouter = (0, express_1.Router)()
    .get('/:orderNo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bike = yield bike_record_1.BikeRecord.getOneByOrderNo(req.params.orderNo);
    if (bike === null)
        throw new errors_1.ValidationError('Nie istnieje zlecenie o podanym numerze');
    res.json(bike);
}))
    .post('/:orderNo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bike = yield bike_record_1.BikeRecord.getOneByOrderNo(req.params.orderNo);
    if (bike === null)
        throw new errors_1.ValidationError('Nie istnieje zlecenie o podanym numerze');
    const newMessage = new message_record_1.MessageRecord({
        text: req.body.textAreaVal,
        isClientAsk: req.body.isClientAsk,
        isNew: req.body.isNew,
    });
    yield newMessage.insertMessage(bike.id);
    // to turn off new message symbol when answer is send
    if (!req.body.isClientAsk) {
        yield newMessage.changeMessageStatus(bike.id);
    }
    const messages = yield message_record_1.MessageRecord.getMessagesById(bike.id);
    res.json(messages);
}));
//# sourceMappingURL=bike.router.js.map