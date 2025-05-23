import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { admin } from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import dotnev from "dotenv";
dotnev.config()

const authAdmin = asyncHandler(async (req, _, next) => {
    console.log("Received Cookies:", req.cookies); // Check cookies

    const accToken = req.cookies?.Accesstoken;
    if (!accToken) {
        throw new ApiError(401, "Unauthorized: No Access Token in Cookies");
    }

    try {
        console.log("Access Token Received:", accToken); // Log token
        const decodedAccToken = jwt.verify(accToken, c34896dba890ea4a0b364ca5d53242f87cd23e1cc4279140e80c56720bc8f4a2);
        console.log("Decoded Token:", decodedAccToken); // Log decoded token

        const Admin = await admin.findById(decodedAccToken?._id).select("-password -Refreshtoken");
        console.log("Admin Found:", Admin); // Log admin info

        if (!Admin) {
            throw new ApiError(401, "Invalid Access Token: Admin Not Found");
        }

        req.Admin = Admin;
        next();
    } catch (error) {
        console.log("JWT Verification Error:", error.message);
        throw new ApiError(401, "Invalid or Expired Access Token");
    }
});

export { authAdmin }