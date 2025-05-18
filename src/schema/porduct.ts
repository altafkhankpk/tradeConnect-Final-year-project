import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    orderPerDay: {
        type: Number,
        required: true,
    },
    platform: {
        type: String,
        required: true,
    },
    imageLink: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: true,
    },
    quotationCount: {
        type: Number,
        required: false,
        default: 0
    },
    destination: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        required: false,
    },
    productName: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
},{timestamps:true})

const Product = mongoose.model("Product", ProductSchema);

export default Product;
