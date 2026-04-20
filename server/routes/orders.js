const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const Cart = require("../models/Cart");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

// POST /api/orders — create order
router.post("/", protect, async (req, res, next) => {
    try {
        const { items, shippingAddress, paymentMethod, subtotal, shippingPrice, totalPrice } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "No order items" });
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            paymentMethod,
            subtotal,
            shippingPrice,
            totalPrice,
        });

        // Clear the user's cart after order
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

        res.status(201).json({ success: true, order });
    } catch (err) { next(err); }
});

// GET /api/orders/my — logged-in user's orders
router.get("/my", protect, async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) { next(err); }
});

// GET /api/orders — admin: all orders
router.get("/", protect, admin, async (req, res, next) => {
    try {
        const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) { next(err); }
});

// GET /api/orders/:id
router.get("/:id", protect, async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        // Only allow owner or admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        res.json({ success: true, order });
    } catch (err) { next(err); }
});

// PUT /api/orders/:id/status — admin only
router.put("/:id/status", protect, admin, async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status,
                ...(status === "Delivered" && { isDelivered: true, deliveredAt: Date.now() }),
            },
            { new: true }
        );
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        res.json({ success: true, order });
    } catch (err) { next(err); }
});

module.exports = router;