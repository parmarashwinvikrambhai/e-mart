"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
    isAdmin: { type: Boolean, default: false },
    cartData: [
        {
            productId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: Number,
            size: String
        }
    ]
}, { timestamps: true });
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=user-model.js.map