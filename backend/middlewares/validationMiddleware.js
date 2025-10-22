import { validationResult } from "express-validator"

export const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            success:false, 
            message: errors.array()[0].msg,
        })
    }
    next();
}