import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUserShield, FaLock, FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from '../Home/Header/Header';
import Footer from '../Footer/Footer';
import Navbar from "../../Components/Navbar/Navbar";

export default function AdminLogin() {
  const [User, setUser] = useState("");
  const [Password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors = {};

    if (!User.trim()) {
      newErrors.User = "User Name is required";
    }

    if (!Password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const data = {
      username: User,
      password: Password,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/login`, {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responesData = await response.json();
      setErr(responesData.message);
      const userid = responesData.data.admin._id;

      if (response.ok) {
        navigate(`/admin/${userid}`);
      } else if (response.status === 401) {
        setErrors({ password: responesData.message || "Incorrect password" });
      } else if (response.status === 403) {
        setErrors({ general: responesData.message || "Login failed" });
      } else if (response.status === 400) {
        setErrors({ general: responesData.message || "Admin does not exist" });
      } else {
        setErrors({ general: "An unexpected error occurred" });
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left side - Login Form */}
            <div className="w-full md:w-1/2 p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Portal</h2>
                <p className="text-gray-600">Secure access to administrative controls</p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserShield className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={User}
                    onChange={(e) => setUser(e.target.value)}
                  />
                  {errors.User && (
                    <p className="mt-1 text-sm text-red-600">{errors.User}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FaSignInAlt className="h-5 w-5" />
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </motion.div>

                {(errors.general || err) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-red-600 text-sm"
                  >
                    {errors.general || err}
                  </motion.div>
                )}
              </form>
            </div>

            {/* Right side - Image */}
            <div className="hidden md:block w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="h-full flex flex-col items-center justify-center text-white"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Welcome to MedLearn</h3>
                  <p className="text-blue-100">
                    Access the administrative dashboard to manage the platform and ensure smooth operations.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
