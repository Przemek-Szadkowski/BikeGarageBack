import {Request, Response, Router} from "express";
import bcrypt from 'bcrypt';
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
                // na froncie ogarnąć wyświetlanie info o nieprawdiłowym użytkowniku,
                // prawdopodobnie jakiś komponent w adminlogform któy będzie się renderował
                // gdy przesłąny zostanie error???
            })
        }

        const admin = results[0][0];

        try {
            if (await bcrypt.compare(password, admin.password)) {
                // tutaj token jwt i send do frontu
            } else {
                // tutaj przesłać info, że hasło jest nieprawdiłowe
            }
        } catch {
                // tutaj przesłać info, że wystąpił błąd
        }

        // a tego się pozbyć po dokończeniu try catch
        await res.send({
            token: admin.login,
        });
    });