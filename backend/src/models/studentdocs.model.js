import mongoose from "mongoose";

const studentdocsSchema = new mongoose.Schema(
  {
    Phone: {
      type: String,
      required: true,
      unique: true,
    },
    Address: {
      type: String,
      required: true,
    },
    Highesteducation: {
      type: String,
      required: true,
    },
    SecondarySchool: {
      type: String,
      required: true,
    },
    HigherSchool: {
      type: String,
      required: true,
    },
    SecondaryMarks: {
      type: Number,
      required: true,
    },
    HigherMarks: {
      type: Number,
      required: true,
    },
    Aadhaar: {
      type: String,
      required: true,
    },
    Secondary: {
      type: String,
      required: true,
    },
    Higher: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const StudentDocs = mongoose.model("StudentDocs", studentdocsSchema);
