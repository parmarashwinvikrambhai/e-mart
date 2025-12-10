import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    items: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Product", 
                required: true 
            },
            quantity: Number,
            size: String
        }
    ],

    amount: Number,

    address: { 
        type: Object, 
        required: true 
    },

    status: { 
        type: String, 
        default: "Order Placed" 
    },

    paymentMethod: String,
    payment: { 
        type: String, 
        default: "pending"
    },

    date: { 
        type: Number, 
        default: Date.now 
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order