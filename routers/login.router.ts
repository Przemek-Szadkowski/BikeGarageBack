import {Request, Response, Router} from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {pool} from "../utils/db";

export const loginRouter = Router()

    .post('/', async (req: Request, res: Response) => {

        const {username, password} = req.body.credentials;

        const results: any = await pool.execute("SELECT * FROM `admin` WHERE login = :login", {
            login: username,
        });

        if(results[0].length === 0) {
            return res.status(401).json({
                error: 'Nie znaleziono użytkownika!',
            })
        }

        const admin = results[0][0];

        try {
            if (await bcrypt.compare(password, admin.password)) {

                const token = jwt.sign(
                {userId: admin.id},
                'RANDOM_TOKEN_SECRET',
                    {expiresIn: '24h'});

                await res.send({
                    token: token,
                });
            } else {
                return res.status(401).json({
                    error: 'Nieprawidłowe hasło!',
                })
            }
        } catch {
            res.status(500).json({
                error: 'Przepraszamy za chwilowe utrudnienia. Spróbuj ponownie za 2 minuty!',
            })
        }
    });