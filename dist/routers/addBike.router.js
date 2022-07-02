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
exports.addBikeRouter = void 0;
const express_1 = require("express");
const bike_record_1 = require("../records/bike.record");
exports.addBikeRouter = (0, express_1.Router)()
    .post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bike = new bike_record_1.BikeRecord(req.body);
    // convert date to format matching to database format
    const dateString = bike.dateOfReception.toLocaleString();
    bike.dateOfReception = dateString.slice(0, 10);
    bike.downPayment = Number(bike.downPayment);
    yield bike.insertBike();
    res.json(bike.bikeModel);
}));
//# sourceMappingURL=addBike.router.js.map