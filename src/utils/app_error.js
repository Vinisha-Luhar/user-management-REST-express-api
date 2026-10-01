class AppError extends Error{
    constructor(message,statuscode){
        super(message);
        this.statuscode=statuscode;
        this.isOperational = true;
        Error.captureStackTrace(this,this.constructor); // this will remove the stack trace from the error object
    }
}

module.exports = AppError;