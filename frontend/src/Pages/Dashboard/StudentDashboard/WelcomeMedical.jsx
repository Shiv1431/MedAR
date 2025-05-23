import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaVrCardboard, FaBrain, FaBookMedical, FaUserMd } from 'react-icons/fa';

const WelcomeMedical = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to MedLearn VR
          </h1>
          <p className="text-xl text-gray-600">
            Your immersive medical education journey starts here
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: <FaVrCardboard className="h-8 w-8" />,
              title: "3D Anatomy Explorer",
              description: "Interact with detailed 3D models of human organs and systems in VR",
              link: "/ar-anatomy"
            },
            {
              icon: <FaBrain className="h-8 w-8" />,
              title: "Interactive Learning",
              description: "Engage with interactive medical case studies and simulations",
              link: "/cases"
            },
            {
              icon: <FaBookMedical className="h-8 w-8" />,
              title: "Medical Library",
              description: "Access comprehensive medical resources and study materials",
              link: "/library"
            },
            {
              icon: <FaUserMd className="h-8 w-8" />,
              title: "Expert Sessions",
              description: "Join live sessions with medical professionals",
              link: "/sessions"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <Link
                to={feature.link}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Explore →
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="bg-blue-600 text-white rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Experience Medical VR?</h2>
          <p className="mb-6">
            Start your journey into the future of medical education with our VR-enabled learning modules.
          </p>
          <Link
            to="/ar-anatomy"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
          >
            Launch VR Experience
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeMedical; 