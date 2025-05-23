import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStethoscope, FaBookMedical, FaUserMd, FaBrain, FaHeartbeat, FaLungs } from 'react-icons/fa';
import Navbar from '../../../Components/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';

const Landing = () => {
  const features = [
    {
      icon: <FaStethoscope className="w-12 h-12" />,
      title: "Interactive Learning",
      description: "Engage with 3D models and virtual dissections"
    },
    {
      icon: <FaBookMedical className="w-12 h-12" />,
      title: "Comprehensive Resources",
      description: "Access to medical textbooks, case studies, and research papers"
    },
    {
      icon: <FaUserMd className="w-12 h-12" />,
      title: "Expert Guidance",
      description: "Learn from experienced medical professionals"
    }
  ];

  const anatomyModels = [
    {
      icon: <FaBrain className="w-12 h-12" />,
      title: "Brain Anatomy",
      description: "Explore detailed 3D models of the human brain"
    },
    {
      icon: <FaHeartbeat className="w-12 h-12" />,
      title: "Cardiovascular System",
      description: "Study the heart and circulatory system in 3D"
    },
    {
      icon: <FaLungs className="w-12 h-12" />,
      title: "Respiratory System",
      description: "Interactive models of lungs and airways"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              >
                Welcome to MedLearn VR
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-600 mb-8"
              >
                Your Gateway to Immersive Medical Education
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Link
                  to="/login"
                  className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Start Learning
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose MedLearn VR?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-blue-50 p-6 rounded-lg text-center"
                >
                  <div className="text-blue-600 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 3D Anatomy Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Explore 3D Anatomy Models
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {anatomyModels.map((model, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="text-blue-600 mb-4">{model.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{model.title}</h3>
                  <p className="text-gray-600 mb-4">{model.description}</p>
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Explore →
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Medical Education?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of medical students who are already learning with MedLearn VR
            </p>
            <Link
              to="/signup"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Landing;
