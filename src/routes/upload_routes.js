const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const router = express.Router();

const uploadDir = path.join(process.cwd(),"uploads");

fs.mkdirSync(uploadDir,{recursive:true});

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        callback(null,uniqueName);
    }
});


const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp"
];

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1
    },

    fileFilter: (req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();

        if (
            !allowedExtensions.includes(extension) ||
            !allowedMimeTypes.includes(file.mimetype)
        ) {
            return callback(
                new Error("Only JPG, PNG, and WebP images are allowed")
            );
        }

        callback(null, true);
    }
});

router.post("/image",upload.single("image"),(req,res)=>{
    if(!req.file){
        return res.status(400).json({
            success: false,
            message: "Please upload an image"
        });
    }

    res.status(201).json({
        success: true,
        message: "Image Uploaded Successfully",
        file: {
            origionalName: req.file.originalname,
            savedname: req.file.filename,
            size: req.file.size,
        }
    });
});

router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                success: false,
                message: "File size must not exceed 10 MB"
            });
        }

        if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                success: false,
                message: "Only one file can be uploaded at a time"
            });
        }

        return res.status(400).json({
            success: false,
            message: "Invalid file upload"
        });
    }

    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message || "File upload failed"
        });
    }

    next();
});

module.exports = router;