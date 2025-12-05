import Order from "../models/order-model";
import { IOrder } from "../types/order-types"

const createOrder = async (data:IOrder) => {
    const order = new Order(data);
    return await order.save();
}

const getOrder = async (user_id:string) => {
    return await Order.find({
        userId:user_id
    }).populate("items.productId", "name price images").sort({ date: -1 });
}

export default {
    createOrder,
    getOrder
   }