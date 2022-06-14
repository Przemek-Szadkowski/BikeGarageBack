import {Request, Response, Router} from "express";
import {BikeRecord} from "../records/bike.record";
import {ValidationError} from "../utils/errors";

export const adminRouter = Router()

    .get('/dashboard', async (req: Request, res: Response) => {
        const bikes = await BikeRecord.getAllBikes();
        res.json(bikes);
    })
    .patch('/status/:status', async (req: Request, res: Response) => {
        const {id, status} = req.body;

        const bike = await BikeRecord.getOne(id);


        if(bike === null) {
            throw new ValidationError('Nie znaleziono roweru o podanym ID');
        }

        await bike.updateStatus(status);

        const bikeAfterUpdate = await BikeRecord.getOneByOrderNo(bike.orderNo);
        const bikesAfterUpdate = await BikeRecord.getAllBikes();
        console.log(bikesAfterUpdate);

        res.json({bikeAfterUpdate, bikesAfterUpdate});
    });