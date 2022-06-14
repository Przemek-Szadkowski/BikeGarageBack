import {Request, Response, Router} from "express";
import {BikeRecord} from "../records/bike.record";

export const addBikeRouter = Router()

    .post('/', async (req: Request, res: Response) => {
        const bike = new BikeRecord(req.body);
        await bike.insertBike();
        res.json(bike.name);
        console.log(bike);
    });