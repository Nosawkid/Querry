export const notFound = (req, res, next) => {
    res.status(404).json({ message: `Requested source not found: ${req.originalUrl}` })
}

export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode
    let message = err.message

    if (err.name === "CastError" && err.kind === 'ObjectId') {
        statusCode = 404
        message = "Resource Not Found"
    }

    if (err.name === "MongoError" && err.code === 11000) {
        statusCode = 400
        message = "Field already exists"
    }

    res.status(statusCode).json({ message: message, stack: process.env.NODE_ENV === "development" ? err.stack : null })
}