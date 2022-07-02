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
exports.adminRouter = void 0;
const express_1 = require("express");
const bike_record_1 = require("../records/bike.record");
const errors_1 = require("../utils/errors");
exports.adminRouter = (0, express_1.Router)()
    .get('/dashboard', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bikes = yield bike_record_1.BikeRecord.getAllBikes();
    const rows = yield bike_record_1.BikeRecord.getHowManyRecordsAreInArchive();
    res.json([bikes, rows]);
}))
    .get('/dashboard/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bikes = yield bike_record_1.BikeRecord.getAllBikes();
    res.json([bikes]);
}))
    .patch('/status/:status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, status } = req.body;
    const bike = yield bike_record_1.BikeRecord.getOne(id);
    if (bike === null) {
        throw new errors_1.ValidationError('Nie znaleziono zlecenia o podanym ID');
    }
    yield bike.updateStatus(status);
    const bikeAfterUpdate = yield bike_record_1.BikeRecord.getOneByOrderNo(bike.orderNo);
    if (bikeAfterUpdate === null)
        throw new errors_1.ValidationError('Nie istnieje zlecenie o podanym numerze');
    const bikesAfterUpdate = yield bike_record_1.BikeRecord.getAllBikes();
    res.json({ bikeAfterUpdate, bikesAfterUpdate });
}))
    .delete('/dashboard/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bike = yield bike_record_1.BikeRecord.getOne(req.params.id);
    if (!bike) {
        throw new errors_1.ValidationError('Nie istnieje zlecenie o podanym ID');
    }
    yield bike.insertBikeToArchive();
    yield bike.deleteBike();
    res.end();
}));
//# sourceMappingURL=admin.router.js.map