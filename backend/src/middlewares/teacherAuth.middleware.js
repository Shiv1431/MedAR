import { ApiError } from "../utils/ApiError.js";
import {Teacher} from "../models/teacher.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const authTeacher = asyncHandler(async(req,_,next)=>{
    const accToken = req.cookies?.Accesstoken

    if(!accToken){
        throw new ApiError(401, "unauthorized req")
    }

    const decodedAccToken = jwt.verify(accToken,
        c34896dba890ea4a0b364ca5d53242f87cd23e1cc4279140e80c56720bc8f4a2)

    const teacher = await Teacher.findById(decodedAccToken?._id).select("-Password -Refreshtoken")

    if(!teacher){
        throw new ApiError(401, "invalid access token")
    }


    req.teacher = teacher
    next()
})

export {authTeacher}