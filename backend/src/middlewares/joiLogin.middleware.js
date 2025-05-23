import joi from "@hapi/joi"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"

const authSchema = asyncHandler(async (req, _, next) => {
    const schema = joi.object({
        Email: joi.string().email().lowercase().required(),
        Password: joi.string().min(6).max(16).required()
    })

    try {
        await schema.validateAsync(req.body)
        next()
    } catch (error) {
        throw new ApiError(400, error.details[0].message)
    }
})

export { authSchema }



