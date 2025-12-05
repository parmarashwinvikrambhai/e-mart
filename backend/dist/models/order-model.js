"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: Boolean,
        default: false
    },
    date: {
        type: Number,
        default: Date.now
    }
}, { timestamps: true });
const Order = mongoose_1.default.model("Order", orderSchema);
exports.default = Order;
//# sourceMappingURL=order-model.js.map