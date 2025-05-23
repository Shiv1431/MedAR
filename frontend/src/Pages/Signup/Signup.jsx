import React, { useState } from "react";
import { color, motion } from "framer-motion";
import { FaUserMd, FaGraduationCap, FaBookMedical, FaBrain } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import Radiobtn from "../Components/RadioBtn/Radiobtn";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from '../../Components/Footer/Footer';

const Signup = () => {
  // State to hold user input and errors
  const [Firstname, setFirstName] = useState("");
  const [Lastname, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [userType, setUserType] = useState('');
  const [err, setErr] = useState('');

  const navigate = useNavigate()


  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const newErrors = {};

    if (!Firstname.trim()) {
      newErrors.firstname = 'First name is required';
    }

    if (!Lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    }

    if (!Email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(Email)) {
      newErrors.email = 'Invalid email format';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!passwordRegex.test(Password)) {
      newErrors.password = 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.';
    }

    if (Object.keys(newErrors).length > 0) {
      // Update the errors state and prevent form submission
      setErrors(newErrors);
      return;
    }

    // Prepare data object to send to the backend
    const data = {
      Firstname: Firstname,
      Lastname: Lastname,
      Email: Email,
      Password: Password,
    };

    try {
      // Send data to backend (you need to implement this part)
      const response = await fetch(`http://localhost:8000/api/${userType}/signup`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Handle response
      const responseData = await response.json();

      setErr(responseData.message);

      if (response.ok) {
        // Registration successful, you can redirect or do something else
        console.log("Registration successful");
        navigate('/varifyEmail');
      } else if (response.status === 400) {
        // Handle specific validation errors returned by the server
        setErrors(responseData.errors || {});
      } else {
        // Other status codes (e.g., 500 Internal Server Error)
        console.error("Registration failed with status code:", response.status);
      }
    } catch (error) {
      setErrors(error.message);
     
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-gray-900 mb-2"
              >
                Create Your Account
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 mb-8"
              >
                Join our medical education platform today
              </motion.p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      value={Firstname}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your first name"
                    />
                    {errors.firstname && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      value={Lastname}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your last name"
                    />
                    {errors.lastname && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Create a password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center text-black">
                  <Radiobtn userType={userType} setUserType={setUserType} />
                </div>

                {err && (
                  <p className="text-sm text-red-600">{err}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Account
                </button>

                <div className="text-center">
                  <span className="text-gray-600">Already have an account? </span>
                  <NavLink to="/login" className="text-blue-600 hover:text-blue-800">
                    Log in
                  </NavLink>
                </div>
              </form>
            </motion.div>

            {/* Right Side - Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:block"
            >
              <div className="flex flex-col items-center justify-center space-y-8">
                <div className="text-center">
                  <FaUserMd className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900">Medical Learning Platform</h3>
                  <p className="text-gray-600 mt-2">Join our community of medical professionals and students</p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <FaGraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Expert-Led Courses</p>
                  </div>
                  <div className="text-center">
                    <FaBookMedical className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Comprehensive Resources</p>
                  </div>
                  <div className="text-center">
                    <FaBrain className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive Learning</p>
                  </div>
                  <div className="text-center">
                    <FaUserMd className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Professional Network</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
