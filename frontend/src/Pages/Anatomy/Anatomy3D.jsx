import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Box,
  PerspectiveCamera,
} from "@react-three/drei";
import { motion } from "framer-motion";
import { FaHeartbeat, FaLungs, FaFilter, FaSquare } from "react-icons/fa";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import * as THREE from "three";

function Model({ url, onError }) {
  const { scene } = useGLTF(url);
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <primitive
        object={scene}
        scale={[1.5, 1.5, 1.5]}
        position={[0, 0, 0]}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
    </>
  );
}

function PlaceholderModel() {
  return (
    <Box args={[1, 1, 1]}>
      <meshStandardMaterial color="hotpink" />
    </Box>
  );
}

function CameraBackground() {
  const videoRef = useRef();
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = document.createElement("video");
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");
    video.setAttribute("autoplay", "");
    video.style.position = "absolute";
    video.style.top = "0";
    video.style.left = "0";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    video.style.zIndex = "0";

    const container = document.getElementById("canvas-container");
    if (container) {
      container.appendChild(video);
      videoRef.current = video;
    }

    const constraints = {
      video: { facingMode: "environment" },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream;
        video.play().then(() => {
          setVideoReady(true);
        });
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
      });

    return () => {
      if (videoRef.current) {
        const video = videoRef.current;
        if (video.srcObject) {
          video.srcObject.getTracks().forEach((track) => track.stop());
        }
        const container = document.getElementById("canvas-container");
        if (container && container.contains(video)) {
          container.removeChild(video);
        }
      }
    };
  }, []);

  return null;
}

const Anatomy3D = () => {
  const [selectedModel, setSelectedModel] = useState("heart");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const models = {
    heart: {
      name: "Heart",
      icon: <FaHeartbeat className="w-8 h-8" />,
      path: "/models/heart.glb",
      description:
        "The heart is a muscular organ that pumps blood throughout the body.",
    },
    lungs: {
      name: "Lungs",
      icon: <FaLungs className="w-8 h-8" />,
      path: "/models/lungs.glb",
      description:
        "The lungs are the primary organs of the respiratory system.",
    },
    liver: {
      name: "Liver",
      icon: <FaSquare className="w-8 h-8" />,
      path: "/models/liver.glb",
      description:
        "The liver is the largest internal organ and performs many vital functions.",
    },
    kidneys: {
      name: "Kidneys",
      icon: <FaFilter className="w-8 h-8" />,
      path: "/models/kidney.glb",
      description:
        "The kidneys filter waste products from the blood and produce urine.",
    },
    brain: {
      name: "Brain",
      icon: <FaSquare className="w-8 h-8" />,
      path: "/models/brain.glb",
      description:
        "The brain is the control center of the nervous system, responsible for thought, memory, and emotion.",
    },
    intestine: {
      name: "Intestine",
      icon: <FaSquare className="w-8 h-8" />,
      path: "/models/intestine.glb",
      description:
        "The intestines are responsible for digestion and absorption of nutrients from food.",
    },
    gallbladder: {
      name: "Gall Bladder",
      icon: <FaSquare className="w-8 h-8" />,
      path: "/models/gallbladder.glb",
      description:
        "The gallbladder stores and concentrates bile, which helps in the digestion of fats.",
    },
    stomach: {
      name: "Stomach",
      icon: <FaSquare className="w-8 h-8" />,
      path: "/models/stomach.glb",
      description:
        "The stomach is a muscular organ that breaks down food and mixes it with digestive juices.",
    },
    pancreas: {
      name: "Pancreas",
      icon: <FaSquare className="w-8 h-8" />,
      path: "/models/pancreas.glb",
      description:
        "The pancreas produces enzymes for digestion and hormones for blood sugar regulation.",
    },
  };

  const handleModelError = (errorMessage) => {
    console.error("Model loading error:", errorMessage);
    setError(errorMessage);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log("Selected model:", selectedModel);
    console.log("Model path:", models[selectedModel].path);
    setIsLoading(true);
    setError(null);
  }, [selectedModel]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              3D Anatomy Models
            </h1>
            <p className="text-gray-600">
              Explore detailed 3D models of human organs with interactive
              controls
            </p>
          </motion.div>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {Object.entries(models).map(([key, model]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedModel(key);
                  setError(null);
                  setIsLoading(true);
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-lg transition-all duration-300 ${
                  selectedModel === key
                    ? "bg-blue-600 text-white shadow-blue-200"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:shadow-md"
                }`}
              >
                {model.icon}
                <span className="text-sm font-medium text-center mt-2">
                  {model.name}
                </span>
              </motion.button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 relative overflow-hidden">
            <div id="canvas-container" className="relative h-[500px]">
              <CameraBackground />
              <Canvas className="relative z-10">
                <Suspense fallback={<PlaceholderModel />}>
                  <Model
                    url={models[selectedModel].path}
                    onError={handleModelError}
                  />
                </Suspense>
              </Canvas>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {models[selectedModel].name}
              </h3>
              <p className="text-gray-600">{models[selectedModel].description}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Anatomy3D;
