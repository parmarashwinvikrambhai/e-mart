import User from "../models/user-model";
import {IUser} from "../types/user-types"

const createUser = async (data:IUser) => {
    const user = new User(data);
    return await user.save();
}

export default {
    createUser
}