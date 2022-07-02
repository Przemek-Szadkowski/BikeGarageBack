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
exports.editBikeRouter = void 0;
const express_1 = require("express");
const bike_record_1 = require("../records/bike.record");
const errors_1 = require("../utils/errors");
exports.editBikeRouter = (0, express_1.Router)()
    .get('/:editedBike', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bike = yield bike_record_1.BikeRecord.getOneByOrderNo(req.params.editedBike);
    if (bike === null) {
        throw new errors_1.ValidationError('Nie znaleziono roweru o podanym ID');
    }
    bike.chat = [];
    res.json(bike);
}))
    .put('/:editedBike', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const editBike = new bike_record_1.BikeRecord(req.body.form);
    const bike = yield bike_record_1.BikeRecord.getOneByOrderNo(req.params.editedBike);
    if (bike === null) {
        throw new errors_1.ValidationError('Nie znaleziono roweru o podanym ID');
    }
    yield bike.update(editBike);
    res.json(bike.bikeModel);
}));
//# sourceMappingURL=editBike.router.js.map