import Order from "../models/order-model";
import { IOrder, type IUpdateOrder } from "../types/order-types"

const createOrder = async (data:IOrder) => {
    const order = new Order(data);
    return await order.save();
}

const getOrder = async (user_id:string) => {
    return await Order.find({
        userId:user_id
    }).populate("items.productId", "name price images").populate("userId", "name email").sort({ date: -1 });
}

const getAllOrders = async () => {
    return await Order.find()
        .populate("items.productId", "name price images").populate("userId", "name email")
        .sort({ date: -1 });
};

const updateOrderStatus = async (id: string, data: IUpdateOrder) => {
    return await Order.findByIdAndUpdate(id , data, { new: true });
}

const findOrderById = async (orderId: string) => {
    return await Order.findById(orderId)
        .populate("items.productId");
}


export default {
    createOrder,
    getOrder,
    getAllOrders,
    updateOrderStatus,
    findOrderById 
   }