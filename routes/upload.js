const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../images"));
    },
    filename: function (req, file, cb) {
        // basename + a safe character set: a name like "../../index.js" must not
        // be able to write outside the images folder.
        const safeName = path.basename(file.originalname).replace(/[^\w.-]/g, "_");
        cb(null, `${Date.now()}-${safeName}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: MAX_SIZE },
    fileFilter: function (req, file, cb) {
        if (ALLOWED_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PNG, JPEG or WebP images are allowed"));
        }
    },
});

/**
 * @desc Upload an image (for example an author's photo)
 * @route /api/upload
 * @method POST
 * @access private (only admin)
 */
router.post("/", verifyTokenAndAdmin, (req, res) => {
    upload.single("image")(req, res, (error) => {
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: "No image was sent" });
        }
        res.status(200).json({ message: "image is updated successfully", file: req.file.filename });
    });
});

module.exports = router;
