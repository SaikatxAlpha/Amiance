const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary, deleteFile, extractPublicId } = require("../config/cloudinary");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

/* ── Cloudinary storage engine ─────────────────────────── */
const productStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "amiance/products",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
            { width: 1000, height: 1200, crop: "fill", gravity: "auto", quality: "auto:good" },
        ],
    },
});

const avatarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "amiance/avatars",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face", quality: "auto:good" },
        ],
    },
});

/* ── File filter — images only ─────────────────────────── */
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

/* ── Multer instances ──────────────────────────────────── */
const uploadProduct = multer({
    storage: productStorage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const uploadAvatar = multer({
    storage: avatarStorage,
    fileFilter: imageFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

/* ─────────────────────────────────────────────────────────
   POST /api/upload/product
   Admin only — upload a single product image to Cloudinary.
   Returns: { url, publicId }
───────────────────────────────────────────────────────── */
router.post(
    "/product",
    protect,
    admin,
    (req, res, next) => {
        uploadProduct.single("image")(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ success: false, message: err.message });
            }
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            next();
        });
    },
    (req, res) => {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }
        res.json({
            success: true,
            url: req.file.path,
            publicId: req.file.filename,
        });
    }
);

/* ─────────────────────────────────────────────────────────
   POST /api/upload/avatar
   Authenticated — upload the current user's avatar.
   Returns: { url, publicId }
───────────────────────────────────────────────────────── */
router.post(
    "/avatar",
    protect,
    (req, res, next) => {
        uploadAvatar.single("avatar")(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ success: false, message: err.message });
            }
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            next();
        });
    },
    async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: "No file uploaded" });
            }

            const User = require("../models/User");

            // Delete old avatar if it was hosted on Cloudinary
            const user = await User.findById(req.user._id);
            if (user?.avatar) {
                const oldPublicId = extractPublicId(user.avatar);
                if (oldPublicId) {
                    await deleteFile(oldPublicId).catch(() => { });
                }
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                { avatar: req.file.path },
                { new: true }
            );

            res.json({
                success: true,
                url: req.file.path,
                publicId: req.file.filename,
                user: updatedUser,
            });
        } catch (err) {
            next(err);
        }
    }
);

/* ─────────────────────────────────────────────────────────
   DELETE /api/upload
   Admin only — delete a Cloudinary asset by URL or publicId.
   Body: { url } or { publicId }
───────────────────────────────────────────────────────── */
router.delete("/", protect, admin, async (req, res, next) => {
    try {
        const { url, publicId } = req.body;

        const idToDelete = publicId || (url ? extractPublicId(url) : null);

        if (!idToDelete) {
            return res.status(400).json({ success: false, message: "Provide url or publicId" });
        }

        const result = await deleteFile(idToDelete);
        res.json({ success: true, result });
    } catch (err) {
        next(err);
    }
});

module.exports = router;