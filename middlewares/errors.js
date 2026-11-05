// Express passes (req, res, next) in this order. They were swapped, so this crashed
// with "res.status is not a function" and every unknown URL became a 500.
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: err.message });
};

module.exports = { notFound, errorHandler };
