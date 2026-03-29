const errorHandler = (err, req, res, next) => {
    console.error("❌ Error detectado:", err.stack);
    
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: "Error interno del servidor",
        message: err.message || "Ocurrió un error inesperado"
    });
};

module.exports = errorHandler;