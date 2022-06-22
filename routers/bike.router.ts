import {Request, Response, Router} from "express";
import {BikeRecord} from "../records/bike.record";
import {MessageRecord} from "../records/message.record";
import {ValidationError} from "../utils/errors";

export const bikeRouter = Router()

    .get('/:orderNo', async (req: Request, res: Response) => {

        const bike = await BikeRecord.getOneByOrderNo(req.params.orderNo);

        if(bike === null) throw new ValidationError('Nie istnieje zlecenie o podanym numerze');

        res.json(bike);

    })

    .post('/:orderNo', async (req: Request, res: Response) => {

        const bike = await BikeRecord.getOneByOrderNo(req.params.orderNo);

        if(bike === null) throw new ValidationError('Nie istnieje zlecenie o podanym numerze');

        const newMessage = new MessageRecord({
            text: req.body.textAreaVal,
            isClientAsk: req.body.isClientAsk,
            isNew: req.body.isNew,
        });

        await newMessage.insertMessage(bike.id);

        // to turn off new message symbol when answer is send
        if(!req.body.isClientAsk) {
            await newMessage.changeMessageStatus(bike.id);
        }

        const messages = await MessageRecord.getMessagesById(bike.id);

        res.json(messages);

    });