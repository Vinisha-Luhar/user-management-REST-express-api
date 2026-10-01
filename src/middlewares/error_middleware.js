const errorHandler = (error,req,res,next) => {
    console.log(error);

    console.log("MESSAGE:",error.message);
    console.log("STATUS CODE",error.statuscode);
    console.log("IS OPRATIONAL",error.isOperational);

    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: error.isOperational ? error.message : "Internal Server Error"
    });
};

module.exports = errorHandler;