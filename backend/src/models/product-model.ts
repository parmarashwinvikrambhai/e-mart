import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
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
    date: 
    { type: Date, 
        default: Date.now 
    },
}, { timestamps: true })

const Product = mongoose.model("Product", productSchema);
export default Product;
