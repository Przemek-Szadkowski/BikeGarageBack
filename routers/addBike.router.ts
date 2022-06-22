import {Request, Response, Router} from "express";
import {BikeRecord} from "../records/bike.record";

export const addBikeRouter = Router()

    .post('/', async (req: Request, res: Response) => {

        const bike = new BikeRecord(req.body);

        // convert date to format matching to database format
        const dateString: string = bike.dateOfReception.toLocaleString();
        bike.dateOfReception = dateString.slice(0,10);

        bike.downPayment = Number(bike.downPayment);

        await bike.insertBike();

        res.json(bike.bikeModel);

    });