const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "Product name is required"], trim: true },
        description: { type: String, required: [true, "Description is required"] },
        price: { type: Number, required: [true, "Price is required"], min: 0 },
        image: { type: String, required: [true, "Image is required"] },
        category: {
            type: String,
            required: true,
            enum: ["tops", "bottoms", "outerwear", "accessories"],
            lowercase: true,
        },
        tag: { type: String, default: "Drop 01" },
        badge: {
            type: String,
            enum: ["NEW", "BESTSELLER", "LIMITED", "SOLD OUT", null],
            default: null,
        },
        colorHex: { type: String, default: "#a7c957" },
        stock: { type: Number, default: 100, min: 0 },
        sizes: {
            type: [String],
            default: ["XS", "S", "M", "L", "XL", "XXL"],
        },
        ratings: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        featured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);