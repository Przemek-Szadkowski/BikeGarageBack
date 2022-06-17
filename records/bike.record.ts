import {MessageEntity, NewBikeEntity, SimpleBikeEntity} from "../types";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from "uuid";
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
    public dateOfReception: object | string;
    public phoneNo: string;
    public downPayment: number;
    public status: string;
    public comments: string = '';
    public chat: MessageEntity[];

    constructor(obj: NewBikeEntity) {
        if (!obj.orderNo || obj.orderNo.length > 10) {
            throw new ValidationError('Numer zlecenia musi mieć 10 znaków!');
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

        if (obj.status.length > 40) {
            throw new ValidationError('Status nie może być dłuższy niż 40 znaków');
        }

        if (obj.comments && obj.comments.length > 65535) {
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

    static async getAllBikes(): Promise<BikeRecord[]> {
        const [results] = (await pool.execute("SELECT * FROM `bikes` ORDER BY `dateOfReception` DESC")) as BikeRecordResults;

        for await (const result of results) {
            result.chat = await MessageRecord.getMessagesById(result.id);
            if(!result.chat) {
                result.chat = [];
            }
        }

        return results.map(result => new BikeRecord(result));

    };

    static async getOneByOrderNo(orderNo: string): Promise<BikeRecord | null> {
        try {
            const [results] = await pool.execute("SELECT * FROM `bikes` WHERE orderNo = :orderNo", {
                orderNo,
            }) as BikeRecordResults;

            const messages = await MessageRecord.getMessagesById(results[0].id);

            return results.length === 0 ? null : new BikeRecord({
                ...results[0],
                chat: messages,
            });
        } catch {
            throw new ValidationError('Nie istnieje zlecenie o podanym numerze');
        }

    };

    async insertBike(): Promise<void> {
        if(!this.id) {
            this.id = uuid();
        } else {
            throw new Error('Cannot insert something that is already inserted!')
        }

        await pool.execute("INSERT INTO `bikes` (`id`, `orderNo`, `name`, `surname`, `bikeModel`, `serialNo`, `dateOfReception`, `phoneNo`, `downPayment`, `status`, `comments`) VALUES(:id, :orderNo, :name, :surname, :bikeModel, :serialNo, :dateOfReception, :phoneNo, :downPayment, :status, :comments)", {
            id: this.id,
            orderNo: this.orderNo,
            name: this.name,
            surname: this.surname,
            bikeModel: this.bikeModel,
            serialNo: this.serialNo,
            dateOfReception: this.dateOfReception,
            phoneNo: this.phoneNo,
            downPayment: this.downPayment,
            status: this.status,
            comments: this.comments
        });
    }

    async updateStatus(status: string): Promise<void> {
        await pool.execute("UPDATE `bikes` SET `status` = :status WHERE `id` = :id", {
            id: this.id,
            status,
        });
    }

    async update({id, name, surname, bikeModel, serialNo, phoneNo, downPayment, status, comments} : {
                     id: string,
                     name: string,
                     surname: string,
                     bikeModel: string,
                     serialNo: string,
                     phoneNo: string,
                     downPayment: number,
                     status: string,
                     comments: string
    }): Promise<void> {
        await pool.execute("UPDATE `bikes` SET `name` = :name, `surname` = :surname, `bikeModel` = :bikeModel, `serialNo` = :serialNo, `phoneNo` = :phoneNo, `downPayment` = :downPayment, `status` = :status, `comments` = :comments WHERE `id` = :id", {
            id,
            name,
            surname,
            bikeModel,
            serialNo,
            phoneNo,
            downPayment,
            status,
            comments,
        });
    }
}