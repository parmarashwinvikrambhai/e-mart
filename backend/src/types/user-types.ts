import { Types } from "mongoose";

export interface CartItem {
    productId?: Types.ObjectId | string;
    quantity?: number;
    size?: string;
}

export interface IUser {
    _id?: Types.ObjectId | string;
    name: string;
    email: string;
    password: string;
    isAdmin?: boolean;  
    cartData?: CartItem[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUpdateUser {
    name: string;
    email: string;
    
}