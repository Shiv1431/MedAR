import {Router} from "express";
import {signup, mailVerified, login, logout, addStudentDetails, getStudent, forgetPassword, resetPassword, updateProfile, getCourses, getClasses, verifyToken } from "../controllers/student.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import {authSTD} from "../middlewares/stdAuth.middleware.js"
import { authSchema } from "../middlewares/joiLogin.middleware.js";

const router = Router()

// Authentication routes
router.route("/signup").post(signup)
router.route("/verify").get(mailVerified)
router.route("/login").post(authSchema, login)
router.route("/logout").post(authSTD, logout)
router.route("/forgetpassword").post(forgetPassword)
router.route('/forgetpassword/:token').post(resetPassword)
router.route("/verify-token").get(authSTD, verifyToken)

// Student profile and document routes
router.route("/StudentDocument/:id").get(authSTD, getStudent)
router.route("/profile/:id").get(authSTD, getStudent)
router.route("/:id").get(authSTD, getStudent)

// Profile update route
router.route('/profile/update').put(
    authSTD,
    upload.single('profileImage'),
    updateProfile
);

// Document verification route
router.route("/Verification/:id").post(
    authSTD,
    upload.fields([
        {
            name: "Aadhaar",
            maxCount: 1,
        },
        {
            name: "Secondary",
            maxCount: 1,
        },
        {
            name: "Higher",
            maxCount: 1
        }
    ]),
    addStudentDetails
);

// Courses and Classes routes
router.route('/courses').get(authSTD, getCourses);
router.route('/classes').get(authSTD, getClasses);

export default router;