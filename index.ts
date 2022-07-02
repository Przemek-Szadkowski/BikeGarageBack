import express, {json} from 'express';
import rateLimit from "express-rate-limit";
import cors from 'cors';
import 'express-async-errors';
import {handleError} from "./utils/errors";
import {bikeRouter} from "./routers/bike.router";
import {adminRouter} from "./routers/admin.router";
import {addBikeRouter} from "./routers/addBike.router";
import {editBikeRouter} from "./routers/editBike.router";
import {archiveRouter} from "./routers/archive.router";
import {loginRouter} from "./routers/login.router";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(json());
app.use(rateLimit({
    windowMs: 35 * 60 * 1000,
    max: 100,
}))

//Routes...
app.use('/login', loginRouter);
app.use('/bike', bikeRouter);
app.use('/admin', adminRouter);
app.use('/addBike', addBikeRouter);
app.use('/editBike', editBikeRouter);
app.use('/archive', archiveRouter);

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3001');
});