import mongoose from "mongoose";

const studentDocsSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student',
    required: true
  },
  Phone: {
    type: String,
    trim: true
  },
  Address: {
    type: String,
    trim: true
  },
  Aadhaar: {
    type: String,
    trim: true
  },
  Secondary: {
    type: String,
    trim: true
  },
  Higher: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export const StudentDocs = mongoose.model('StudentDocs', studentDocsSchema);
