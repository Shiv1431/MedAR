import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {student} from "../models/student.model.js";
import jwt from "jsonwebtoken";

const authSTD = asyncHandler(async(req,_,next) =>{
    let accToken;
    
    // Check for token in Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        accToken = authHeader.split(' ')[1];
    } 
    // Fall back to cookies if not found in header
    else {
        accToken = req.cookies?.Accesstoken;
    }

    if(!accToken) {
        throw new ApiError(401, "No authentication token provided")
    }

    const decodedAccToken = jwt.verify(accToken,
        process.env.ACCESS_TOKEN_SECRET)

    const Student = await student.findById(decodedAccToken?._id).select("-Password -Refreshtoken")

    if(!Student){
        throw new ApiError(401, "invalid access token")
    }
    req.Student = Student
    next()
})

export { authSTD }