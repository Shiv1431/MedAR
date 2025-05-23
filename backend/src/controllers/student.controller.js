import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { student } from "../models/student.model.js";
import { StudentDocs } from "../models/studentdocs.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import nodemailer from "nodemailer";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Teacher } from "../models/teacher.model.js";
import { Sendmail } from "../utils/Nodemailer.js";
import { upload } from "../config/cloudinary.config.js";
import { v2 as cloudinary } from 'cloudinary';

const verifyEmail = async (Email, Firstname, createdStudent_id) => {
  try {
    const emailsender = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: Email,
      subject: "Verify your E-mail",
      html: `
            <div style="text-align: center;">
                <p style="margin: 20px;"> Hi ${Firstname}, Please click the button below to verify your E-mail. </p>
                <img src="https://img.freepik.com/free-vector/illustration-e-mail-protection-concept-e-mail-envelope-with-file-document-attach-file-system-security-approved_1150-41788.jpg?size=626&ext=jpg&uid=R140292450&ga=GA1.1.553867909.1706200225&semt=ais" alt="Verification Image" style="width: 100%; height: auto;">
                <br>
                <a href="${process.env.FRONTEND_URL}/verify-email/student?id=${createdStudent_id}">
                    <button style="background-color: black; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 10px 0; cursor: pointer;">Verify Email</button>
                </a>
            </div>`,
    };

    emailsender.sendMail(mailOptions, function (error) {
      if (error) {
        throw new ApiError(400, "Sending email verification failed");
      } else {
        console.log("Verification mail sent successfully");
      }
    });
  } catch (error) {
    throw new ApiError(400, "Failed to send email verification");
  }
};

const generateAccessAndRefreshTokens = async (stdID) => {
  try {
    const std = await student.findById(stdID);

    const Accesstoken = std.generateAccessToken();
    const Refreshtoken = std.generateRefreshToken();

    std.Refreshtoken = Refreshtoken;
    await std.save({ validateBeforeSave: false });

    return { Accesstoken, Refreshtoken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const signup = asyncHandler(async (req, res) => {
  const { Firstname, Lastname, Email, Password } = req.body;

  if (
    [Firstname, Lastname, Email, Password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedStudent = await student.findOne({ Email: req.body.Email });
  if (existedStudent) {
    throw new ApiError(400, "Student already exist");
  }

  const cheakTeach = await Teacher.findOne({ Email: req.body.Email });

  if (cheakTeach) {
    throw new ApiError(400, "Email Belong to Teacher");
  }

  const newStudent = await student.create({
    Email,
    Firstname,
    Lastname,
    Password,
    Studentdetails: null,
  });

  const createdStudent = await student
    .findById(newStudent._id)
    .select("-Password ");

  if (!createdStudent) {
    throw new ApiError(501, "Student registration failed");
  }

  await verifyEmail(Email, Firstname, newStudent._id);

  return res
    .status(200)
    .json(new ApiResponse(200, createdStudent, "Signup successfull"));
});

const mailVerified = asyncHandler(async (req, res) => {
  const id = req.query.id;

  const updatedInfo = await student.updateOne(
    { _id: id },
    { $set: { Isverified: true } }
  );

  if (updatedInfo.nModified === 0) {
    throw new ApiError(404, "Student not found or already verified");
  }
  return res.send(`
        <div style="text-align: center; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <img src="https://cdn-icons-png.flaticon.com/128/4436/4436481.png" alt="Verify Email Icon" style="width: 100px; height: 100px;">
            <h1 style="font-size: 36px; font-weight: bold; padding: 20px;">Email Verified</h1>
            <h4>Your email address was successfully verified.</h4>
            <button style="padding: 10px 20px; background-color: #007bff; color: white; border: none; cursor: pointer; margin: 20px;" onclick="window.location.href = '${process.env.FRONTEND_URL}';">Go Back Home</button>
        </div>
        `);
});

const login = asyncHandler(async (req, res) => {
  const Email = req.user.Email;
  const Password = req.user.Password;

  if ([Email, Password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const StdLogin = await student.findOne({
    Email,
  });

  if (!StdLogin) {
    throw new ApiError(400, "Student does not exist");
  }

  if (!StdLogin.Isverified) {
    throw new ApiError(401, "Email is not verified");
  }

  const StdPassCheck = await StdLogin.isPasswordCorrect(Password);

  if (!StdPassCheck) {
    throw new ApiError(403, "Password is incorrect");
  }

  const tempStd = StdLogin._id;

  const { Accesstoken, Refreshtoken } = await generateAccessAndRefreshTokens(
    tempStd
  );

  const loggedInStd = await student
    .findById(tempStd)
    .select("-Password -Refreshtoken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  // Prepare response data with user and tokens
  const responseData = {
    user: loggedInStd,
    token: Accesstoken, // Include access token in response body
    refreshToken: Refreshtoken // Include refresh token in response body
  };

  return res
    .status(200)
    .cookie("Accesstoken", Accesstoken, options)
    .cookie("Refreshtoken", Refreshtoken, options)
    .json(
      new ApiResponse(
        200,
        responseData,
        "Logged in successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  await student.findByIdAndUpdate(
    req.Student._id,
    {
      $set: {
        Refreshtoken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("Accesstoken", options)
    .clearCookie("Refreshtoken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const getStudent = asyncHandler(async (req, res) => {
  const id = req.params.id;
  
  // Check if the requested ID matches the logged-in user
  if (req.Student._id.toString() !== id) {
    throw new ApiError(403, "Unauthorized access");
  }

  try {
    // Find the student and populate the Studentdetails
    const studentData = await student.findById(id)
      .select('-Password -Refreshtoken -__v')
      .populate('Studentdetails', '-__v -createdAt -updatedAt')
      .lean();

    if (!studentData) {
      throw new ApiError(404, 'Student not found');
    }

    // Create a default Studentdetails object if it's null
    const studentDetails = studentData.Studentdetails || {
      Phone: '',
      Address: '',
      Highesteducation: 'Not provided',
      SecondarySchool: 'Not provided',
      HigherSchool: 'Not provided',
      SecondaryMarks: 0,
      HigherMarks: 0,
      Aadhaar: 'Not provided',
      Secondary: 'Not provided',
      Higher: 'Not provided'
    };

    // Return the data in the structure expected by the frontend
    return res.status(200).json(
      new ApiResponse(200, {
        student: {
          ...studentData,
          Studentdetails: studentDetails
        },
        studentdetails: studentDetails
      }, "Student data retrieved successfully")
    );
  } catch (error) {
    console.error('Error in getStudent:', error);
    throw new ApiError(500, "Error retrieving student data");
  }
});

const addStudentDetails = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (req.Student._id.toString() !== id) {
    throw new ApiError(403, "Not authorized to perform this action");
  }

  const {
    Phone,
    Address,
    Highesteducation,
    SecondarySchool,
    HigherSchool,
    SecondaryMarks,
    HigherMarks,
  } = req.body;

  if (
    [
      Phone,
      Address,
      Highesteducation,
      SecondarySchool,
      HigherSchool,
      SecondaryMarks,
      HigherMarks,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const alreadyExist = await StudentDocs.findOne({ Phone });

  if (alreadyExist) {
    throw new ApiError(400, "phone number already exists");
  }

  const AadhaarLocalPath = req.files?.Aadhaar?.[0]?.path;
  const SecondaryLocalPath = req.files?.Secondary?.[0]?.path;
  const HigherLocalPath = req.files?.Higher?.[0]?.path;

  if (!AadhaarLocalPath) {
    throw new ApiError(400, "Aadhaar is required");
  }

  if (!SecondaryLocalPath) {
    throw new ApiError(400, "Secondary marksheet is required");
  }

  if (!HigherLocalPath) {
    throw new ApiError(400, "Higher marksheet is required");
  }

  const Aadhaar = await uploadOnCloudinary(AadhaarLocalPath);
  const Secondary = await uploadOnCloudinary(SecondaryLocalPath);
  const Higher = await uploadOnCloudinary(HigherLocalPath);

  const studentdetails = await StudentDocs.create({
    Phone,
    Address,
    Highesteducation,
    SecondarySchool,
    HigherSchool,
    SecondaryMarks,
    HigherMarks,
    Aadhaar: Aadhaar.url,
    Secondary: Secondary.url,
    Higher: Higher.url,
  });

  const theStudent = await student
    .findOneAndUpdate(
      { _id: id },
      { $set: { Isapproved: "pending", Studentdetails: studentdetails._id } },
      { new: true }
    )
    .select("-Password -Refreshtoken");

  if (!theStudent) {
    throw new ApiError(400, "failed to approve or reject || student not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, theStudent, "documents uploaded successfully"));
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { Email } = req.body;

  if (!Email) {
    throw new ApiError(400, "Email is required");
  }

  const User = await student.findOne({ Email });

  if (!User) {
    throw new ApiError(404, "email not found!!");
  }

  await User.generateResetToken();

  await User.save();

  const resetToken = `${process.env.FRONTEND_URL}/student/forgetpassword/${User.forgetPasswordToken}`;

  const subject = "RESET PASSWORD";

  const message = ` <p>Dear ${User.Firstname}${User.Lastname},</p>
   <p>We have received a request to reset your password. To proceed, please click on the following link: <a href="${resetToken}" target="_blank">reset your password</a>.</p>
   <p>If the link does not work for any reason, you can copy and paste the following URL into your browser's address bar:</p>
   <p>${resetToken}</p>
   <p>Thank you for being a valued member of the MedLearn community. If you have any questions or need further assistance, please do not hesitate to contact our support team.</p>
   <p>Best regards,</p>
   <p>The MedLearn Team</p>`;

  try {
    await Sendmail(Email, subject, message);

    res.status(200).json({
      success: true,
      message: `Reset password Email has been sent to ${Email} the email SuccessFully`,
    });
  } catch (error) {
    throw new ApiError(404, "operation failed!!");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password != confirmPassword) {
    throw new ApiError(400, "password does not match");
  }

  try {
    const user = await student.findOne({
      forgetPasswordToken: token,
      forgetPasswordExpiry: { $gt: Date.now() },
    });
    console.log("flag2", user);

    if (!user) {
      throw new ApiError(400, "Token is invalid or expired. Please try again.");
    }

    user.Password = password;
    user.forgetPasswordExpiry = undefined;
    user.forgetPasswordToken = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    throw new ApiError(500, "Internal server error!!!");
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  const { Firstname, Lastname, Email, Phone, Address } = req.body;
  const studentId = req.Student._id;

  try {
    // Find the student
    const studentData = await student.findById(studentId);
    if (!studentData) {
      throw new ApiError(404, "Student not found");
    }

    // Update student basic info
    studentData.Firstname = Firstname || studentData.Firstname;
    studentData.Lastname = Lastname || studentData.Lastname;
    studentData.Email = Email || studentData.Email;

    // Handle profile image upload
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      if (result) {
        studentData.ProfileImage = result.secure_url;
      }
    }

    // Update or create student details
    let studentDetails = await StudentDocs.findById(studentData.Studentdetails);
    if (!studentDetails) {
      studentDetails = new StudentDocs({
        Phone: Phone || '',
        Address: Address || '',
        Highesteducation: 'Not provided',
        SecondarySchool: 'Not provided',
        HigherSchool: 'Not provided',
        SecondaryMarks: 0,
        HigherMarks: 0,
        Aadhaar: 'Not provided',
        Secondary: 'Not provided',
        Higher: 'Not provided'
      });
      await studentDetails.save();
      studentData.Studentdetails = studentDetails._id;
    } else {
      studentDetails.Phone = Phone || studentDetails.Phone;
      studentDetails.Address = Address || studentDetails.Address;
      await studentDetails.save();
    }

    // Save the updated student data
    await studentData.save();

    // Fetch the updated data with populated student details
    const updatedStudent = await student.findById(studentId)
      .select('-Password -Refreshtoken -__v')
      .populate('Studentdetails', '-__v -createdAt -updatedAt');

    return res.status(200).json(
      new ApiResponse(200, {
        student: updatedStudent
      }, "Profile updated successfully")
    );
  } catch (error) {
    console.error('Error in updateProfile:', error);
    throw new ApiError(500, error.message || "Error updating profile");
  }
});

export const getCourses = asyncHandler(async (req, res) => {
    try {
        // For now, return some sample courses
        const courses = [
            {
                _id: '1',
                title: 'Anatomy Basics',
                description: 'Learn the fundamentals of human anatomy',
                category: 'anatomy',
                duration: '8 weeks'
            },
            {
                _id: '2',
                title: 'Physiology Fundamentals',
                description: 'Understanding human body functions',
                category: 'physiology',
                duration: '10 weeks'
            },
            {
                _id: '3',
                title: 'Biochemistry Essentials',
                description: 'Core concepts in biochemistry',
                category: 'biochemistry',
                duration: '6 weeks'
            }
        ];

        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            data: courses
        });
    } catch (error) {
        throw new ApiError(500, "Error fetching courses");
    }
});

export const getClasses = asyncHandler(async (req, res) => {
    try {
        // For now, return some sample classes
        const classes = [
            {
                _id: '1',
                courseName: 'Anatomy Basics',
                teacherName: 'Dr. Smith',
                schedule: 'Monday, 10:00 AM',
                duration: '2 hours'
            },
            {
                _id: '2',
                courseName: 'Physiology Fundamentals',
                teacherName: 'Dr. Johnson',
                schedule: 'Wednesday, 2:00 PM',
                duration: '2 hours'
            }
        ];

        return res.status(200).json({
            success: true,
            message: "Classes fetched successfully",
            data: classes
        });
    } catch (error) {
        throw new ApiError(500, "Error fetching classes");
    }
});

const verifyToken = asyncHandler(async (req, res) => {
  try {
    // If we reach here, the token is valid (authSTD middleware has already verified it)
    const student = await student.findById(req.Student._id)
      .select("-Password -Refreshtoken");

    if (!student) {
      throw new ApiError(401, "Invalid token");
    }

    return res.status(200).json(
      new ApiResponse(200, { student }, "Token is valid")
    );
  } catch (error) {
    throw new ApiError(401, "Invalid token");
  }
});

export {
  signup,
  mailVerified,
  login,
  logout,
  addStudentDetails,
  getStudent,
  forgetPassword,
  resetPassword,
  updateProfile,
  getCourses,
  getClasses,
  verifyToken
};
