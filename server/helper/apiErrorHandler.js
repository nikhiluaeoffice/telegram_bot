const apiErrorhandler = (err, req, res, next) => {
    if (err.isApiError) {
        res.status(err.statusCode).json({
            statusCode: err.statusCode,
            responseMessage: err.responseMessage,
        });
        return;
    }
    if (err.message == 'Validation error') {
        res.status(502).json({
            statusCode: 502,
            responseMessage: err.original.message,
        });
        return;
    }
    res.status(err.code || 500).json({
        statusCode: err.code || 500,
        responseMessage: err.message,
    });
    return;
};
module.exports = apiErrorhandler;