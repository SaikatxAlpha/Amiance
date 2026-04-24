const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Orders");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

/* All routes here require auth + admin role */
router.use(protect, admin);

/* ─────────────────────────────────────────────────────────
   GET /api/admin/stats
   Dashboard summary: revenue, orders, customers, products
───────────────────────────────────────────────────────── */
router.get("/stats", async (req, res, next) => {
    try {
        const [
            totalOrders,
            totalProducts,
            totalCustomers,
            revenueAgg,
            recentOrders,
            ordersByStatus,
        ] = await Promise.all([
            Order.countDocuments(),
            Product.countDocuments(),
            User.countDocuments({ role: "user" }),
            Order.aggregate([
                { $match: { isPaid: true } },
                { $group: { _id: null, total: { $sum: "$totalPrice" } } },
            ]),
            Order.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("user", "name email"),
            Order.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]),
        ]);

        const revenue = revenueAgg[0]?.total || 0;
        const statusMap = Object.fromEntries(
            ordersByStatus.map((s) => [s._id, s.count])
        );

        res.json({
            success: true,
            stats: {
                revenue,
                totalOrders,
                totalProducts,
                totalCustomers,
                ordersByStatus: statusMap,
            },
            recentOrders,
        });
    } catch (err) {
        next(err);
    }
});

/* ─────────────────────────────────────────────────────────
   COUPON CRUD
   GET    /api/admin/coupons
   POST   /api/admin/coupons
   PUT    /api/admin/coupons/:id
   DELETE /api/admin/coupons/:id
───────────────────────────────────────────────────────── */
router.get("/coupons", async (req, res, next) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json({ success: true, coupons });
    } catch (err) {
        next(err);
    }
});

router.post("/coupons", async (req, res, next) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json({ success: true, coupon });
    } catch (err) {
        next(err);
    }
});

router.put("/coupons/:id", async (req, res, next) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!coupon)
            return res.status(404).json({ success: false, message: "Coupon not found" });
        res.json({ success: true, coupon });
    } catch (err) {
        next(err);
    }
});

router.delete("/coupons/:id", async (req, res, next) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon)
            return res.status(404).json({ success: false, message: "Coupon not found" });
        res.json({ success: true, message: "Coupon deleted" });
    } catch (err) {
        next(err);
    }
});

/* ─────────────────────────────────────────────────────────
   POST /api/admin/coupons/validate
   Body: { code, orderAmount, userId }
   Validate a coupon code and return the discount amount
───────────────────────────────────────────────────────── */
router.post("/coupons/validate", async (req, res, next) => {
    try {
        const { code, orderAmount, userId } = req.body;
        if (!code || !orderAmount) {
            return res.status(400).json({ success: false, message: "Code and orderAmount are required" });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (!coupon)
            return res.status(404).json({ success: false, message: "Invalid coupon code" });

        if (orderAmount < coupon.minOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount of ₹${coupon.minOrderAmount.toLocaleString("en-IN")} required`,
            });
        }

        const { valid, reason } = coupon.isValidForUser(userId || req.user._id);
        if (!valid)
            return res.status(400).json({ success: false, message: reason });

        const discountAmount = coupon.calculateDiscount(orderAmount);
        res.json({
            success: true,
            coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue },
            discountAmount: Math.round(discountAmount),
        });
    } catch (err) {
        next(err);
    }
});

/* ─────────────────────────────────────────────────────────
   PUT /api/admin/users/:id/role
   Toggle user role between "user" and "admin"
───────────────────────────────────────────────────────── */
router.put("/users/:id/role", async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ success: false, message: "Role must be 'user' or 'admin'" });
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user });
    } catch (err) {
        next(err);
    }
});

/* ─────────────────────────────────────────────────────────
   DELETE /api/admin/users/:id
   Hard delete a user account (admin only)
───────────────────────────────────────────────────────── */
router.delete("/users/:id", async (req, res, next) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: "You cannot delete your own account" });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, message: "User deleted" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;