import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: { 
        type: String, 
        unique: true, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    profilePic: {
        type: String,   
        default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    isAdmin: { type: Boolean, default: false },
    cartData: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Product" 
            },
            quantity: Number,
            size: String
        }
    ]

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User
