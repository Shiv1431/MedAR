import express from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import db from "./database/db.js";

import { fileURLToPath } from "url";
import { app } from "./app.js";
import imageRoutes from "./routes/images.js";

dotenv.config({
  path: "./.env",
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/images", imageRoutes);

app.get("/", (req, res) => {
  res.send({
    activeStatus:true,
    error:false,
    message:"Server is running"
  });
})

db()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(" mongodb connection failed !!! ", err);
  });
