import express, {json} from 'express';
import cors from 'cors';
import 'express-async-errors';
import {handleError} from "./utils/errors";
import {BikeRecord} from "./records/bike.record";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(json());

//Routes...

app.get('/bike/:orderNo', async (req, res) => {
    const bike = await BikeRecord.getOneByOrderNo(req.params.orderNo);
    res.json(bike);
})

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3001');
});