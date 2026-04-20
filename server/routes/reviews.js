const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

// GET /api/reviews/:productId
router.get("/:productId", async (req, res, next) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate("user", "name")
            .sort({ createdAt: -1 });
        res.json({ success: true, reviews });
    } catch (err) { next(err); }
});

// POST /api/reviews/:productId
router.post("/:productId", protect, async (req, res, next) => {
    try {
        const { rating, comment } = req.body;

        const existing = await Review.findOne({
            product: req.params.productId,
            user: req.user._id,
        });
        if (existing) {
            return res.status(400).json({ success: false, message: "You have already reviewed this product" });
        }

        const review = await Review.create({
            product: req.params.productId,
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        });

        // Recalculate product ratings
        const allReviews = await Review.find({ product: req.params.productId });
        const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

        await Product.findByIdAndUpdate(req.params.productId, {
            ratings: avgRating.toFixed(1),
            numReviews: allReviews.length,
        });

        res.status(201).json({ success: true, review });
    } catch (err) { next(err); }
});

// DELETE /api/reviews/:id
router.delete("/:id", protect, async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ success: false, message: "Review not found" });

        if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        await review.deleteOne();
        res.json({ success: true, message: "Review removed" });
    } catch (err) { next(err); }
});

module.exports = router;