import {Request, Response, Router} from "express";
import {BikeRecord} from "../records/bike.record";
import {MessageRecord} from "../records/message.record";

export const bikeRouter = Router()

    .get('/:orderNo', async (req: Request, res: Response) => {
        const bike = await BikeRecord.getOneByOrderNo(req.params.orderNo);
        res.json(bike);
    })

    .post('/:orderNo', async (req: Request, res: Response) => {
        const bike = await BikeRecord.getOneByOrderNo(req.params.orderNo);


        const newMessage = new MessageRecord({
            text: req.body.textAreaVal,
            isClientAsk: req.body.isClientAsk,
            isNew: req.body.isNew,
        });

        await newMessage.insertMessage(bike.id);

        const messages = await MessageRecord.getMessagesById(bike.id);

        res.json(messages);
    })