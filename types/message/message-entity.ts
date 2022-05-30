export interface NewMessageEntity extends Omit<MessageEntity, 'id'> {
    id?: string;
}

export interface MessageEntity {
    id: string;
    text: string;
    isClientAsk: number;
    isNew: number;
}