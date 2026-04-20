const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

// GET /api/products — get all with optional filter
router.get("/", async (req, res, next) => {
    try {
        const { category, badge, search } = req.query;
        const query = {};
        if (category) query.category = category.toLowerCase();
        if (badge) query.badge = badge.toUpperCase();
        if (search) query.name = { $regex: search, $options: "i" };

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: products.length, products });
    } catch (err) { next(err); }
});

// GET /api/products/:id
router.get("/:id", async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        res.json({ success: true, product });
    } catch (err) { next(err); }
});

// POST /api/products — admin only
router.post("/", protect, admin, async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product });
    } catch (err) { next(err); }
});

// PUT /api/products/:id — admin only
router.put("/:id", protect, admin, async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        res.json({ success: true, product });
    } catch (err) { next(err); }
});

// DELETE /api/products/:id — admin only
router.delete("/:id", protect, admin, async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        res.json({ success: true, message: "Product deleted" });
    } catch (err) { next(err); }
});

module.exports = router;