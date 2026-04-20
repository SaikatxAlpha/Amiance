const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const Cart = require("../models/Cart");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");
const { sendOrderConfirmationEmail } = require("../utils/email");

// POST /api/orders — create order (supports COD + card)
router.post("/", protect, async (req, res, next) => {
    try {
        const {
            items,
            shippingAddress,
            paymentMethod = "card",
            subtotal,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "No order items" });
        }

        if (!["card", "cod", "upi"].includes(paymentMethod)) {
            return res.status(400).json({ success: false, message: "Invalid payment method" });
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            paymentMethod,
            subtotal,
            shippingPrice,
            totalPrice,
            // COD orders are not pre-paid
            isPaid: paymentMethod !== "cod",
            paidAt: paymentMethod !== "cod" ? Date.now() : undefined,
        });

        // Clear the user's cart after order
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

        // Send confirmation email
        try {
            await sendOrderConfirmationEmail(req.user, order);
        } catch (emailErr) {
            console.error("Order email error:", emailErr);
        }

        res.status(201).json({ success: true, order });
    } catch (err) {
        next(err);
    }
});

// GET /api/orders/my — logged-in user's orders
router.get("/my", protect, async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) {
        next(err);
    }
});

// GET /api/orders — admin: all orders
router.get("/", protect, admin, async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) {
        next(err);
    }
});

// GET /api/orders/:id
router.get("/:id", protect, async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if (!order)
            return res.status(404).json({ success: false, message: "Order not found" });

        if (
            order.user._id.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        res.json({ success: true, order });
    } catch (err) {
        next(err);
    }
});

// PUT /api/orders/:id/pay — mark COD order as paid on delivery
router.put("/:id/pay", protect, admin, async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { isPaid: true, paidAt: Date.now() },
            { new: true }
        );
        if (!order)
            return res.status(404).json({ success: false, message: "Order not found" });
        res.json({ success: true, order });
    } catch (err) {
        next(err);
    }
});

// PUT /api/orders/:id/status — admin only
router.put("/:id/status", protect, admin, async (req, res, next) => {
    try {
        const { status } = req.body;
        const update = { status };
        if (status === "Delivered") {
            update.isDelivered = true;
            update.deliveredAt = Date.now();
            // If COD, mark as paid on delivery
            const order = await Order.findById(req.params.id);
            if (order && order.paymentMethod === "cod") {
                update.isPaid = true;
                update.paidAt = Date.now();
            }
        }

        const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!order)
            return res.status(404).json({ success: false, message: "Order not found" });
        res.json({ success: true, order });
    } catch (err) {
        next(err);
    }
});

module.exports = router;