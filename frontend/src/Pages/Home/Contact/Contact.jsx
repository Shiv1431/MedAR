import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handlemsg = async(e) => {
    e.preventDefault();
    if(name === '' || email === '' || msg === '') {
      alert("All fields are required!");
    } else if(!/\S+@\S+\.\S+/.test(email)) {
      alert("Enter a valid email!");
    } else {
      const data = { name, email, message: msg };
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        alert(result.message);
        setName('');
        setEmail('');
        setMsg('');
      } catch (error) {
        console.error("Error sending message:", error);
        alert("An error occurred. Please try again later.");
      }
    }
  };

  const contactInfo = [
    {
      icon: <FaEnvelope className="w-8 h-8" />,
      title: "Email",
      info: "support@MedLearn.com"
    },
    {
      icon: <FaPhone className="w-8 h-8" />,
      title: "Phone",
      info: "+1 (555) 123-4567"
    },
    {
      icon: <FaMapMarkerAlt className="w-8 h-8" />,
      title: "Address",
      info: "123 Education Street, Learning City, 12345"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-8"
          >
            Contact Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 text-center mb-12"
          >
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="text-blue-600 mt-1">{item.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.info}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your message"
                  />
                </div>
                <button
                  onClick={handlemsg}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contact;