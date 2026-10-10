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

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
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

module.exports = router;