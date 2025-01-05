module.exports = {
    sendSuccess(res, data, statusCode = 200) {
        
        res.status(statusCode).json(data); 
    },
    sendError(res, message, error = null, statusCode = 500) {
        
        res.status(statusCode).json({ error }); 
    }
};