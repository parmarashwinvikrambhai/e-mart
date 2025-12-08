import User from "../models/user-model";
import { IUser, IUpdateUser } from "../types/user-types"

const createUser = async (data:IUser) => {
    const user = new User(data);
    return await user.save();
}

const updateUser = async (userId: string, data: IUpdateUser) => {
    return await User.findOneAndUpdate({
        _id: userId
    }, data, { new: true });
}

export default {
    createUser,
    updateUser
}