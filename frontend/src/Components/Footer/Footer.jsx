import React from 'react';
import { Link } from 'react-router-dom';
import { FaStethoscope, FaBookMedical, FaUserMd, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <FaStethoscope className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold">MedLearn VR</span>
            </div>
            <p className="text-gray-400">
              Transforming medical education through immersive VR technology and interactive learning.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-white">
                  Medical Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/library" className="text-gray-400 hover:text-white">
                  Medical Library
                </Link>
              </li>
              <li>
                <Link to="/cases" className="text-gray-400 hover:text-white">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/anatomy" className="text-gray-400 hover:text-white">
                  3D Anatomy Models
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-gray-400 hover:text-white">
                  Research Papers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-blue-500" />
                <span className="text-gray-400">shivsingh1309@gmail.com</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2 text-blue-500" />
                <span className="text-gray-400">+91 9260932028</span>
              </li>
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                <span className="text-gray-400">LPU, Jalandhar, Punjab, India</span>
              </li>
            </ul>
          </div>

          {/* Social Icons */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <FaFacebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <FaLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MedLearn VR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 