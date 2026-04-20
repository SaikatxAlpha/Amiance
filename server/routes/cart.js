const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { protect } = require("../middleware/auth");

// GET /api/cart
router.get("/", protect, async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        res.json({ success: true, cart: cart || { items: [] } });
    } catch (err) { next(err); }
});

// POST /api/cart — add item
router.post("/", protect, async (req, res, next) => {
    try {
        const { productId, name, image, price, qty = 1, size = "M" } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId && item.size === size
        );

        if (existingItem) {
            existingItem.qty += qty;
        } else {
            cart.items.push({ product: productId, name, image, price, qty, size });
        }

        await cart.save();
        res.json({ success: true, cart });
    } catch (err) { next(err); }
});

// PUT /api/cart/:itemId — update qty
router.put("/:itemId", protect, async (req, res, next) => {
    try {
        const { qty } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        const item = cart.items.id(req.params.itemId);
        if (!item) return res.status(404).json({ success: false, message: "Item not found" });

        if (qty <= 0) {
            item.deleteOne();
        } else {
            item.qty = qty;
        }

        await cart.save();
        res.json({ success: true, cart });
    } catch (err) { next(err); }
});

// DELETE /api/cart/:itemId — remove item
router.delete("/:itemId", protect, async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
        await cart.save();
        res.json({ success: true, cart });
    } catch (err) { next(err); }
});

module.exports = router;