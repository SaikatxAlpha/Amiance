const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    image: String,
    price: Number,
    qty: Number,
    size: String,
});

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [orderItemSchema],
        shippingAddress: {
            name: String,
            address: String,
            city: String,
            postcode: String,
            country: String,
        },
        paymentMethod: { type: String, default: "card" },
        paymentResult: {
            id: String,
            status: String,
            update_time: String,
        },
        subtotal: { type: Number, required: true },
        shippingPrice: { type: Number, default: 5 },
        totalPrice: { type: Number, required: true },
        status: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Processing",
        },
        isPaid: { type: Boolean, default: false },
        paidAt: Date,
        isDelivered: { type: Boolean, default: false },
        deliveredAt: Date,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);