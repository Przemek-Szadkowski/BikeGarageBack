import {Request, Response, Router} from "express";
import {BikeRecord} from "../records/bike.record";

export const archiveRouter = Router()

    .get('/archive', async (req: Request, res: Response) => {
        const bikes = await BikeRecord.getAllArchivedBikes();
        res.json(bikes);
    })