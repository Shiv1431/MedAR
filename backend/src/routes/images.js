import express from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import Image from "../models/Image.js"
import sharp from "sharp"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for 3D models
  fileFilter: (req, file, cb) => {
    // Check if it's an image or a 3D model
    if (file.fieldname === "image") {
      const filetypes = /jpeg|jpg|png|gif/
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
      const mimetype = filetypes.test(file.mimetype)

      if (mimetype && extname) {
        return cb(null, true)
      } else {
        cb(new Error("Only image files are allowed!"))
      }
    } else if (file.fieldname === "model") {
      const filetypes = /glb|gltf/
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

      if (extname) {
        return cb(null, true)
      } else {
        cb(new Error("Only GLB or GLTF 3D model files are allowed!"))
      }
    } else {
      cb(new Error("Unexpected field"))
    }
  },
})

// Get all images for current user
router.get("/", async (req, res) => {
  try {
    const images = await Image.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(images)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single image
router.get("/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)

    if (!image) {
      return res.status(404).json({ message: "Image not found" })
    }

    // Increment view count
    image.views += 1
    image.recentlyViewed = true
    await image.save()

    res.json(image)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Upload new content (image or 3D model)
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "model", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, category } = req.body

      // Check if we have either an image or a model
      if (!req.files || (!req.files.image && !req.files.model)) {
        return res.status(400).json({ message: "No file provided" })
      }

      const imageData = {
        title,
        description,
        category,
        user: req.user.id,
        // Add some default labels for demo purposes
        labels: [
          {
            _id: `label-${Date.now()}-1`,
            text: "Feature 1",
            position: { x: 0.5, y: 0.2, z: 0.1 },
          },
          {
            _id: `label-${Date.now()}-2`,
            text: "Feature 2",
            position: { x: -0.5, y: 0.3, z: 0.1 },
          },
        ],
        // Add some default layers for demo purposes
        layers: [
          { name: "Base Layer", visible: true },
          { name: "Details", visible: true },
        ],
      }

      // Handle image upload
      if (req.files.image) {
        const imageFile = req.files.image[0]

        // Generate thumbnail
        const thumbnailPath = path.join(path.dirname(imageFile.path), "thumb-" + path.basename(imageFile.path))

        await sharp(imageFile.path).resize(300, 300, { fit: "inside" }).toFile(thumbnailPath)

        imageData.url = `/uploads/${path.basename(imageFile.path)}`
        imageData.thumbnailUrl = `/uploads/thumb-${path.basename(imageFile.path)}`
      }

      // Handle 3D model upload
      if (req.files.model) {
        const modelFile = req.files.model[0]
        imageData.modelUrl = `/uploads/${path.basename(modelFile.path)}`

        // Use a placeholder for thumbnail
        imageData.thumbnailUrl = `/placeholder-model.jpg`
        imageData.url = `/placeholder-model.jpg` // Fallback image
      }

      // Create image record
      const image = new Image(imageData)
      await image.save()

      res.status(201).json(image)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
)

// Update image
router.put("/:id", async (req, res) => {
  try {
    const { title, description, category, isFavorite, labels, layers } = req.body

    const image = await Image.findById(req.params.id)

    if (!image) {
      return res.status(404).json({ message: "Image not found" })
    }

    // Check ownership
    if (image.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this image" })
    }

    // Update fields
    if (title) image.title = title
    if (description !== undefined) image.description = description
    if (category) image.category = category
    if (isFavorite !== undefined) image.isFavorite = isFavorite
    if (labels) image.labels = labels
    if (layers) image.layers = layers

    await image.save()

    res.json(image)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete image
router.delete("/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)

    if (!image) {
      return res.status(404).json({ message: "Image not found" })
    }

    // Check ownership
    if (image.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this image" })
    }

    // Delete image files
    if (image.url) {
      const imagePath = path.join(__dirname, "..", image.url)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    if (image.thumbnailUrl) {
      const thumbnailPath = path.join(__dirname, "..", image.thumbnailUrl)
      if (fs.existsSync(thumbnailPath) && thumbnailPath.includes("thumb-")) {
        fs.unlinkSync(thumbnailPath)
      }
    }

    if (image.modelUrl) {
      const modelPath = path.join(__dirname, "..", image.modelUrl)
      if (fs.existsSync(modelPath)) {
        fs.unlinkSync(modelPath)
      }
    }

    await image.deleteOne()

    res.json({ message: "Content deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

