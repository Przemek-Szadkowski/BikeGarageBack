import {Request, Response, Router} from "express";
import {BikeRecord} from "../records/bike.record";
import {ValidationError} from "../utils/errors";
import {MessageRecord} from "../records/message.record";

export const adminRouter = Router()

    .get('/dashboard', async (req: Request, res: Response) => {
        const bikes = await BikeRecord.getAllBikes();
        const rows = await BikeRecord.getHowManyRecordsAreInArchive();
        res.json([bikes, rows]);
    })
    .patch('/status/:status', async (req: Request, res: Response) => {
        const {id, status} = req.body;

        const bike = await BikeRecord.getOne(id);


        if(bike === null) {
            throw new ValidationError('Nie znaleziono zlecenia o podanym ID');
        }

        await bike.updateStatus(status);

        const bikeAfterUpdate = await BikeRecord.getOneByOrderNo(bike.orderNo);
        const bikesAfterUpdate = await BikeRecord.getAllBikes();

        res.json({bikeAfterUpdate, bikesAfterUpdate});
    })
    .delete('/dashboard/:id', async(req: Request, res: Response) => {
        const bike = await BikeRecord.getOne(req.params.id);

        if(!bike) {
            throw new ValidationError('Nie istnieje zlecenie o podanym ID');
        }

        await bike.insertBikeToArchive();

        await bike.deleteAndMoveToArchive();

        res.end()
    })