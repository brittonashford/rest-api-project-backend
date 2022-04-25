//async helper function
exports.asyncHandler = (cb) => {
    return async(req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            //punt to global error handler
            next(error);
        }
    }
}