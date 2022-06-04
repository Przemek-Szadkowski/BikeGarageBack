import {Request, Response, Router} from "express";
import {BikeRecord} from "../records/bike.record";

export const adminRouter = Router()

    .get('/dashboard', async (req: Request, res: Response) => {
        const bikes = await BikeRecord.getAllBikes();
        res.json(bikes);
    })