import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import bodyParser from "body-parser";
import session from "express-session";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials"
    ],
    exposedHeaders: ["Set-Cookie"],
    maxAge: 86400 // 24 hours
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

export const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

// Access environment variables
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.GEMINI_API_KEY;

// Middleware to handle HTTP post requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "This is the secret key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "Hi\n" }],
      },

      {
        role: "model",
        parts: [
          { text: "Hi, Welcome to MedLearn, how may i help you??\n" },
        ],
      },

      {
        role: "model",
        parts: [
          {
            text: "EduSphere is a user-friendly and feature-rich online learning platform designed to connect students and teachers in an interactive and structured environment. \nIt enables students to explore, purchase, and track their courses while allowing teachers to create, manage, and monetize their content.\n Admins ensure high-quality standards by approving users and courses before they go live. \nThe platform offers secure authentication with role-based access using JWT, ensuring data security. To maintain credibility, students and teachers must submit applications for approval, with admins reviewing them to ensure only qualified educators join. Each user gets a personalized dashboard—students can track their progress, access live classes, and communicate with teachers; teachers can manage courses, schedule live sessions, and interact with students; and admins can oversee platform activities. EduSphere integrates Stripe, PayPal, and Razorpay for secure payments, allowing seamless course purchases. Live video classes powered by WebRTC and Google Meet enhance real-time learning, while an in-platform messaging system facilitates student-teacher communication. Additionally, an AI chatbot provides instant assistance, addressing common queries related to courses, payments, or technical issues. EduSphere aims to create a seamless, engaging, and interactive learning experience for everyone.",
          },
        ],
      },

      {
        role: "user",
        parts: [{ text: "how can i contact the admin?" }],
      },

      {
        role: "model",
        parts: [
          {
            text: "If u want to contact admin u can mail him from the contact us page with your email id and other details \n",
          },
        ],
      },

      {
        role: "user",
        parts: [{ text: "Does this platform have online classes feature?" }],
      },

      {
        role: "model",
        parts: [
          {
            text: "Yes teacher may schedule online classes for u and when scheduled it will be visible to you dashboard :)\n",
          },
        ],
      },

      {
        role: "user",
        parts: [{ text: "I need to know about the offered courses \n" }],
      },

      {
        role: "model",
        parts: [
          {
            text: "You can browse through the course section and explore all the courses available \n and also u can find the teachers \n",
          },
        ],
      },

      {
        role: "user",
        parts: [{ text: "Is there any online payment facialty available\n" }],
      },

      {
        role: "model",
        parts: [
          {
            text: "Yes this platform has been integrated with the Razorpay payment gateway to provide ease in paying the courses fee\n",
          },
        ],
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

// otp verifcation

app.post("/chat", async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log("incoming /chat req", userInput);
    if (!userInput) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//student routes
import studentRouter from "./routes/student.routes.js";
app.use("/api/student", studentRouter);

//teacher routes
import teacherRouter from "./routes/teacher.routes.js";
app.use("/api/teacher", teacherRouter);

//course routes
import courseRouter from "./routes/course.routes.js";
app.use("/api/course", courseRouter);

import adminRouter from "./routes/admin.routes.js";
app.use("/api/admin", adminRouter);

import paymentRouter from "./routes/payment.routes.js";
app.use("/api/payment", paymentRouter);

export { app };
