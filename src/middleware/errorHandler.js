const errorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: err.stack 
    });
};

module.exports = errorHandler;