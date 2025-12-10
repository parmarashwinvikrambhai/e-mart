import { Types } from "mongoose";

export interface IOrderItem {
    productId: Types.ObjectId | string;
    quantity?: number;
    size?: string;
}

export interface IAddress {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
}

export interface IOrder {
    _id?: Types.ObjectId | string;
    userId: Types.ObjectId | string;
    items: IOrderItem[];
    amount: number;
    address: IAddress;
    status: string;           
    paymentMethod: string;
    payment: string;         
    date?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IUpdateOrder {
   
    status?: string;
    payment?:string;
    
}
