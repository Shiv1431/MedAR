import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaLightbulb, FaUsers, FaBook } from 'react-icons/fa';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';

function About() {
  const features = [
    {
      icon: <FaGraduationCap className="w-12 h-12" />,
      title: "Quality Education",
      description: "Access to high-quality educational resources and expert instructors"
    },
    {
      icon: <FaLightbulb className="w-12 h-12" />,
      title: "Innovative Learning",
      description: "Interactive and engaging learning experiences using modern technology"
    },
    {
      icon: <FaUsers className="w-12 h-12" />,
      title: "Global Community",
      description: "Join a diverse community of learners from around the world"
    },
    {
      icon: <FaBook className="w-12 h-12" />,
      title: "Comprehensive Resources",
      description: "Extensive library of study materials and practice exercises"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-8"
          >
            About MedLearn
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 text-center mb-12"
          >
            Empowering learners through innovative education
          </motion.p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Story Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900 mb-6"
            >
              Our Story
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-lg mb-8"
            >
              MedLearn was born out of a passion for learning and a desire to make quality education accessible to everyone. We understand the challenges faced by modern learners and strive to provide a solution that is both convenient and effective.
            </motion.p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900 mb-6"
            >
              Our Mission
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-lg"
            >
              Our mission is simple yet profound: to empower individuals through education. We aim to create a global learning community where students can discover new passions, enhance their skills, and achieve their academic and professional goals. By leveraging technology and innovative teaching methods, we strive to make learning engaging, interactive, and enjoyable.
            </motion.p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;