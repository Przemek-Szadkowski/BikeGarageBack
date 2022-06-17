import {Request, Response, Router} from "express";
import {BikeRecord} from "../records/bike.record";
import {ValidationError} from "../utils/errors";

export const editBikeRouter = Router()

    .get('/:editedBike', async (req: Request, res: Response) => {

        const bike = await BikeRecord.getOneByOrderNo(req.params.editedBike);

        if(bike === null) {
                throw new ValidationError('Nie znaleziono roweru o podanym ID');
        }

        bike.chat = [];

        res.json(bike);
    })
    .put('/:editedBike', async (req: Request, res: Response) => {

        const editBike = new BikeRecord(req.body.form);

        const bike = await BikeRecord.getOneByOrderNo(req.params.editedBike);

        if(bike === null) {
            throw new ValidationError('Nie znaleziono roweru o podanym ID');
        }

        await bike.update({
            ...editBike,
        });

        res.json(bike.bikeModel);
    });