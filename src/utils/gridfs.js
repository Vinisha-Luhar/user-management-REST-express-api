
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let bucket;

function getGridFSBucket() {
    if (bucket) {
        return bucket;
    }

    const db = mongoose.connection.db;

    if (!db) {
        throw new Error("MongoDB connection is not ready");
    }

    bucket = new GridFSBucket(db, {
        bucketName: "uploads"
    });

    return bucket;
}

module.exports = {
    getGridFSBucket
};
