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
    // Images
    "image/jpeg",
    "image/png",
    "image/webp",

    // PDF
    "application/pdf",

    // Word documents
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    // Excel documents
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];

const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx"
];

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1
    },

    fileFilter: (req, file, callback) => {
        const extension = path
            .extname(file.originalname)
            .toLowerCase();

        const isAllowedExtension =
            allowedExtensions.includes(extension);

        const isAllowedMimeType =
            allowedMimeTypes.includes(file.mimetype);

        if (!isAllowedExtension || !isAllowedMimeType) {
            return callback(
                new Error(
                    "Only images, PDF, Word, and Excel files are allowed"
                )
            );
        }

        callback(null, true);
    }
});

router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Please select a file to upload"
        });
    }

    return res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        file: {
            originalName: req.file.originalname,
            savedName: req.file.filename,
            mimeType: req.file.mimetype,
            size: req.file.size,
            path: req.file.path
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