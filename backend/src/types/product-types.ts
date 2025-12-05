import { Types } from "mongoose";

export interface IProduct {
    _id?: Types.ObjectId | string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    subcategory?: string;
    sizes: string[];
    bestseller?: boolean;
    date?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
