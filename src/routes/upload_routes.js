const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { Readable } = require("stream");
const { getGridFSBucket } = require("../utils/gridfs");

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


const gridFSUpload = multer({
    storage: multer.memoryStorage(),

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
        });   }

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


router.get("/", (req, res) => {
    const files = fs.readdirSync(uploadDir);

    return res.status(200).json({
        success: true,
        count: files.length,
        files: files
    });
});


router.get("/:filename", (req, res, next) => {
    const filename = req.params.filename;

    // Prevent users from accessing files outside the uploads folder.
    if (path.basename(filename) !== filename) {
        return res.status(400).json({
            success: false,
            message: "Invalid filename"
        });
    }

    const filePath = path.join(uploadDir, filename);

    return res.download(filePath, filename, (err) => {
        if (err && !res.headersSent) {
            if (err.status === 404 || err.code === "ENOENT") {
                return res.status(404).json({
                    success: false,
                    message: "File not found"
                });
            }

            next(err);
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


router.post(
    "/upload-gridfs",
    gridFSUpload.single("file"),
    async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Please select a file to upload"
                });
            }

            const bucket = getGridFSBucket();

            const extension = path
                .extname(req.file.originalname)
                .toLowerCase();

            const uniqueFilename =
                `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

            const uploadStream = bucket.openUploadStream(
                uniqueFilename,
                {
                    metadata: {
                        originalName: req.file.originalname,
                        contentType: req.file.mimetype
                    }
                }
            );

            await new Promise((resolve, reject) => {
                uploadStream.once("finish", resolve);
                uploadStream.once("error", reject);

                Readable.from([req.file.buffer]).pipe(uploadStream);
            });

            return res.status(201).json({
                success: true,
                message: "File uploaded to GridFS successfully",
                file: {
                    id: uploadStream.id.toString(),
                    filename: uniqueFilename,
                    originalName: req.file.originalname,
                    contentType: req.file.mimetype,
                    size: req.file.size
                }
            });
        } catch (error) {
            next(error);
        }
    }
);


module.exports = router;