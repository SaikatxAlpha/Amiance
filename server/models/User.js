const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "Name is required"], trim: true },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        phone: { type: String, default: "" },
        bio: { type: String, default: "" },
        avatar: { type: String, default: null },

        // Email verification
        isVerified: { type: Boolean, default: false },
        emailVerificationToken: { type: String, select: false },
        emailVerificationExpire: { type: Date, select: false },

        // Password reset
        resetPasswordToken: { type: String, select: false },
        resetPasswordExpire: { type: Date, select: false },

        addresses: [
            {
                label: { type: String, default: "Home" },
                name: String,
                line1: String,
                city: String,
                postcode: String,
                country: { type: String, default: "India" },
                isDefault: { type: Boolean, default: false },
            },
        ],
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        preferences: {
            defaultSize: { type: String, default: "M" },
            notifications: {
                drops: { type: Boolean, default: true },
                orders: { type: Boolean, default: true },
                promos: { type: Boolean, default: false },
                restock: { type: Boolean, default: false },
            },
        },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare entered password with hashed
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate email verification token
userSchema.methods.getEmailVerificationToken = function () {
    const token = crypto.randomBytes(32).toString("hex");
    this.emailVerificationToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24h
    return token;
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    const token = crypto.randomBytes(32).toString("hex");
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
    return token;
};

module.exports = mongoose.model("User", userSchema);