"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    images: {
        type: [String],
        required: true
    },
    category: {
        type: String,
        default: ""
    },
    subcategory: {
        type: String,
        default: ""
    },
    sizes: {
        type: [String],
        default: []
    },
    bestseller: {
        type: Boolean,
        default: false
    },
    date: { type: Date,
        default: Date.now
    },
}, { timestamps: true });
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
//# sourceMappingURL=product-model.js.map