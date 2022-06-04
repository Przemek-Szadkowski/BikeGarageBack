import express, {json} from 'express';
import cors from 'cors';
import 'express-async-errors';
import {handleError} from "./utils/errors";
import {bikeRouter} from "./routers/bike.router";
import {adminRouter} from "./routers/admin.router";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(json());

//Routes...
app.use('/bike', bikeRouter);
app.use('/admin', adminRouter);

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3001');
});