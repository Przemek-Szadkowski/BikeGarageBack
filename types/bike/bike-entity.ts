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
    dateOfReception: object;
    phoneNo: string;
    downPayment: number;
    status: string;
    comments: string;
}

export interface MessageEntity {
    id: string;
    text: string;
    isClientAs: number;
    isNew: number;
}