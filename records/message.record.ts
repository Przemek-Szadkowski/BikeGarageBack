import {MessageEntity, NewMessageEntity} from "../types";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {ValidationError} from "../utils/errors";
import {v4 as uuid} from "uuid";

type MessageRecordResults = [MessageEntity[], FieldPacket[]];

export class MessageRecord implements MessageEntity {
    public id: string;
    public text: string;
    public isClientAsk: number;
    public isNew: number;

    constructor(obj: NewMessageEntity) {
        if(obj.text.length > 255) {
            throw new ValidationError('Wiadomość nie może być dłuższa niż 255 znaków.');
        }
        if(obj.isClientAsk !== 0 && obj.isClientAsk !== 1 ) {
            throw new ValidationError('Flaga symbolizująca pytanie klienta bądż odpowiedź serwisu może mieć wartoś 0 lub 1.');
        }
        if(obj.isNew !== 0 && obj.isNew !== 1) {
            throw new ValidationError('Flaga symbolizująca nową wiadomość musi mieć oznaczenie 1, a wiadomość starszą 0.');
        }

        this.id = obj.id;
        this.text = obj.text;
        this.isClientAsk = obj.isClientAsk;
        this.isNew = obj.isNew;
    }

    static async getMessagesByOrderNo(id: string): Promise<MessageEntity[] | null> {
        const [results] = await pool.execute(
            "SELECT `messages`.`text`, `messages`.`isClientAsk`, `messages`.`isNew` FROM `messages` JOIN `bikes_messages` ON `messages`.`id` = `bikes_messages`.`msgId` JOIN `bikes` ON `bikes_messages`.`bikeId` = `bikes`.`id` WHERE `bikes_messages`.`bikeId` = :id", {
                id,
            }) as MessageRecordResults;


        const messages: MessageEntity[] = [];

        if(results.length !== 0) {
            results.forEach(result => messages.push(new MessageRecord(result)));
        }

        return results.length === 0 ? null : messages;
    }

    async insertMessage(bikeId: string): Promise<void> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new Error('Cannot insert something that is already inserted!');
        }

        await pool.execute("INSERT INTO `messages` (`id`, `text`, `isClientAsk`, `isNew`) VALUES(:id,:text,:isClientAsk,:isNew)", this);
        await pool.execute("INSERT INTO `bikes_messages` (`bikeId`, `msgId`) VALUES(:bikeId,:id)", {
            bikeId,
            id: this.id,
        });
    }
}