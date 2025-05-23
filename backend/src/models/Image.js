import mongoose from "mongoose"

const labelSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  text: String,
  position: {
    x: Number,
    y: Number,
    z: Number,
  },
  targetPosition: {
    x: Number,
    y: Number,
    z: Number,
  },
})

const layerSchema = new mongoose.Schema({
  name: String,
  visible: {
    type: Boolean,
    default: true,
  },
})

const imageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["anatomy", "pathology", "radiology", "histology", "other"],
    },
    url: {
      type: String,
    },
    thumbnailUrl: {
      type: String,
    },
    modelUrl: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    labels: [labelSchema],
    layers: [layerSchema],
    isFavorite: {
      type: Boolean,
      default: false,
    },
    recentlyViewed: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

const Image = mongoose.model("Image", imageSchema)

export default Image

