const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Coupon code is required"],
            unique: true,
            uppercase: true,
            trim: true,
            minlength: [3, "Code must be at least 3 characters"],
            maxlength: [20, "Code must be at most 20 characters"],
        },
        description: {
            type: String,
            default: "",
        },
        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: [true, "Discount type is required"],
        },
        discountValue: {
            type: Number,
            required: [true, "Discount value is required"],
            min: [0, "Discount value cannot be negative"],
        },
        minOrderAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        maxDiscountAmount: {
            // Only relevant for percentage coupons — caps the discount
            type: Number,
            default: null,
        },
        usageLimit: {
            // Total number of times this coupon can be used across all users
            type: Number,
            default: null, // null = unlimited
        },
        usageCount: {
            type: Number,
            default: 0,
        },
        perUserLimit: {
            // How many times a single user can use this coupon
            type: Number,
            default: 1,
        },
        usedBy: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                usedAt: { type: Date, default: Date.now },
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        expiresAt: {
            type: Date,
            default: null, // null = no expiry
        },
        applicableCategories: {
            // If empty, applies to all categories
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

/* ── Indexes ── */
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, expiresAt: 1 });

/* ── Instance method: calculate discount for a given order amount ── */
couponSchema.methods.calculateDiscount = function (orderAmount) {
    if (this.discountType === "fixed") {
        return Math.min(this.discountValue, orderAmount);
    }
    // percentage
    const raw = (orderAmount * this.discountValue) / 100;
    return this.maxDiscountAmount ? Math.min(raw, this.maxDiscountAmount) : raw;
};

/* ── Instance method: check if coupon is valid for a user ── */
couponSchema.methods.isValidForUser = function (userId) {
    if (!this.isActive) return { valid: false, reason: "Coupon is inactive" };
    if (this.expiresAt && new Date() > this.expiresAt)
        return { valid: false, reason: "Coupon has expired" };
    if (this.usageLimit !== null && this.usageCount >= this.usageLimit)
        return { valid: false, reason: "Coupon usage limit reached" };

    const userUsage = this.usedBy.filter(
        (u) => u.user.toString() === userId.toString()
    ).length;
    if (userUsage >= this.perUserLimit)
        return { valid: false, reason: "You have already used this coupon" };

    return { valid: true };
};

module.exports = mongoose.model("Coupon", couponSchema);