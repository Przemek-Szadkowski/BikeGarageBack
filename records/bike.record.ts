import {MessageEntity, NewBikeEntity, SimpleBikeEntity} from "../types";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {ValidationError} from "../utils/errors";
import {decimalDownPaymentExpression} from "../utils/regex-expressions";
import {MessageRecord} from "./message.record";

type BikeRecordResults = [SimpleBikeEntity[], FieldPacket[]];

export class BikeRecord implements SimpleBikeEntity {
    public id: string;
    public orderNo: string;
    public name: string;
    public surname: string;
    public bikeModel: string;
    public serialNo: string;
    public dateOfReception: object;
    public phoneNo: string;
    public downPayment: number;
    public status: string;
    public comments: string;
    public chat: object;

    constructor(obj: NewBikeEntity) {
        // in this garage order number has 11 characters
        if (!obj.orderNo || obj.orderNo.length > 11) {
            throw new ValidationError('Numer zlecenia musi mieć 11 znaków!');
        }

        if (!obj.name || obj.name.length > 26) {
            throw new ValidationError('Imię musi zostać podane i nie może być dłuższe niż 26 znaków.');
        }

        if (!obj.surname || obj.surname.length > 26) {
            throw new ValidationError('Nazwisko musi zostać podane i nie może być dłuższe niż 50 znaków.');
        }

        if (obj.bikeModel.length > 50) {
            throw new ValidationError('Nazwa modelu roweru nie może być dłuższa niż 50 znaków.');
        }

        if (obj.serialNo.length > 50) {
            throw new ValidationError('Numer seryjny roweru nie może być dłuższy niż 50 znaków.');
        }

        if (!obj.dateOfReception) {
            throw new ValidationError('Data przyjęcia zlecenia musi zostać podana w formacie YYYY-MM-DD');
        }

        if (obj.phoneNo.length > 18) {
            throw new ValidationError('Numer telefonu nie może być dłuższy niż 18 znaków');
        }

        if (decimalDownPaymentExpression.test(String(obj.downPayment))) {
            throw new ValidationError('Kwota zaliczki musi być zapisana z precyzją do dwóch miejsc po ' +
                'przecinku i nie może być wyższa niż 99999.99 zł.');
        }

        if (obj.status.length > 20) {
            throw new ValidationError('Status nie może być dłuższy niż 20 znaków');
        }

        if (obj.comments.length > 65535) {
            throw new ValidationError('Komentarz może mieć maksymalnie 65,535 znaków');
        }

        this.id = obj.id;
        this.orderNo = obj.orderNo;
        this.name = obj.name;
        this.surname = obj.surname;
        this.bikeModel = obj.bikeModel;
        this.serialNo = obj.serialNo;
        this.dateOfReception = obj.dateOfReception;
        this.phoneNo = obj.phoneNo;
        this.downPayment = obj.downPayment;
        this.status = obj.status;
        this.comments = obj.comments;
        this.chat = obj.chat;
    }

    static async getOne(id: string): Promise<BikeRecord | null> {
        const [results] = await pool.execute("SELECT * FROM `bikes` WHERE id = :id", {
            id,
        }) as BikeRecordResults;

        return results.length === 0 ? null : new BikeRecord(results[0]);
    }

    static async getOneByOrderNo(orderNo: string): Promise<BikeRecord | null> {
        const [results] = await pool.execute("SELECT * FROM `bikes` WHERE orderNo = :orderNo", {
            orderNo,
        }) as BikeRecordResults;

        const messages = await MessageRecord.getMessagesByOrderNo(results[0].id);
        console.log(messages);

        return results.length === 0 ? null : new BikeRecord({
            ...results[0],
            chat: messages,
        });
    }
}