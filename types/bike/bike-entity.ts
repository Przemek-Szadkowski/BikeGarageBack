import {MessageEntity} from "../message";

export interface NewBikeEntity extends Omit<SimpleBikeEntity, 'id'> {
    id?: string;
}

export interface SimpleBikeEntity {
    id: string;
    orderNo: string;
    name: string;
    surname: string;
    bikeModel: string;
    serialNo: string;
    dateOfReception: object | string;
    phoneNo: string;
    downPayment: number;
    status: string;
    comments: string;
    chat: MessageEntity[] | [];
}