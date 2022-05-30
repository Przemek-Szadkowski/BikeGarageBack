import express, {json, Request, Response} from 'express';
import cors from 'cors';
import 'express-async-errors';
import {handleError} from "./utils/errors";
import {BikeRecord} from "./records/bike.record";
import {MessageRecord} from "./records/message.record";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(json());

//Routes...

app.get('/bike/:orderNo', async (req: Request, res: Response) => {
    const bike = await BikeRecord.getOneByOrderNo(req.params.orderNo);
    res.json(bike);
});

app.post('/bike/:orderNo', async (req: Request, res: Response) => {
    const bike = await BikeRecord.getOneByOrderNo(req.body.orderNo);

    const newMessage = new MessageRecord({
        text: req.body.textAreaVal,
        isClientAsk: req.body.isClientAsk,
        isNew: req.body.isNew,
    });

    await newMessage.insertMessage(bike.id);

    const messages = await MessageRecord.getMessagesByOrderNo(bike.id);

    res.json(messages);
})

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3001');
});