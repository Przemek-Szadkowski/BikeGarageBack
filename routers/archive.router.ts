import {Request, Response, Router} from "express";
import {BikeRecord} from "../records/bike.record";

export const archiveRouter = Router()

    .get('/', async (req: Request, res: Response) => {
        const bikes = await BikeRecord.getAllArchivedBikes();
        console.log(bikes);
        res.json(bikes);
    })