const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const { protect } = require("../middleware/auth");
const { createOrder, verifySignature, fetchPayment } = require("../config/razorpay");

/* ─────────────────────────────────────────────────────────
   POST /api/payment/create-order
   Creates a Razorpay order for the given amount.
   Body: { amount, currency?, orderId }
───────────────────────────────────────────────────────── */
router.post("/create-order", protect, async (req, res, next) => {
    try {
        const { amount, currency = "INR", orderId } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount" });
        }

        const razorpayOrder = await createOrder(amount, currency, orderId || `ami_${Date.now()}`);

        res.json({
            success: true,
            razorpayOrder,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (err) {
        next(err);
    }
});

/* ─────────────────────────────────────────────────────────
   POST /api/payment/verify
   Verifies a Razorpay payment signature after checkout.
   Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId }
   orderId = our MongoDB Order._id
───────────────────────────────────────────────────────── */
router.post("/verify", protect, async (req, res, next) => {
    try {
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            orderId,
        } = req.body;

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return res.status(400).json({ success: false, message: "Missing payment fields" });
        }

        const isValid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        if (!isValid) {
            return res.status(400).json({ success: false, message: "Payment verification failed — invalid signature" });
        }

        // Fetch full payment details from Razorpay
        const paymentDetails = await fetchPayment(razorpayPaymentId);

        // Mark our order as paid
        if (orderId) {
            const order = await Order.findByIdAndUpdate(
                orderId,
                {
                    isPaid: true,
                    paidAt: Date.now(),
                    paymentResult: {
                        id: razorpayPaymentId,
                        status: paymentDetails.status,
                        update_time: new Date().toISOString(),
                    },
                },
                { new: true }
            );

            if (!order) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }

            return res.json({ success: true, message: "Payment verified", order });
        }

        res.json({ success: true, message: "Payment verified", paymentId: razorpayPaymentId });
    } catch (err) {
        next(err);
    }
});

/* ─────────────────────────────────────────────────────────
   POST /api/payment/webhook
   Razorpay webhook handler (signature verified via raw body).
   Register this URL in your Razorpay dashboard.
───────────────────────────────────────────────────────── */
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res, next) => {
    try {
        const crypto = require("crypto");
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.warn("RAZORPAY_WEBHOOK_SECRET not set — skipping signature check");
        } else {
            const receivedSignature = req.headers["x-razorpay-signature"];
            const expectedSignature = crypto
                .createHmac("sha256", webhookSecret)
                .update(req.body)
                .digest("hex");

            if (receivedSignature !== expectedSignature) {
                return res.status(400).json({ success: false, message: "Invalid webhook signature" });
            }
        }

        const event = JSON.parse(req.body.toString());
        const { event: eventName, payload } = event;

        if (eventName === "payment.captured") {
            const payment = payload.payment.entity;
            const notes = payment.notes || {};

            if (notes.orderId) {
                await Order.findByIdAndUpdate(notes.orderId, {
                    isPaid: true,
                    paidAt: Date.now(),
                    paymentResult: {
                        id: payment.id,
                        status: payment.status,
                        update_time: new Date().toISOString(),
                    },
                });
                console.log(`✅ Webhook: Order ${notes.orderId} marked as paid`);
            }
        }

        if (eventName === "payment.failed") {
            const payment = payload.payment.entity;
            console.warn(`❌ Webhook: Payment failed — ${payment.id}`);
            // You could notify the user via email here
        }

        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

/* ─────────────────────────────────────────────────────────
   GET /api/payment/key
   Returns the Razorpay publishable key (safe for client)
───────────────────────────────────────────────────────── */
router.get("/key", protect, (req, res) => {
    res.json({ success: true, key: process.env.RAZORPAY_KEY_ID });
});

module.exports = router;