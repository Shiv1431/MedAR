import React, { useEffect, useState } from "react";
import Input from "../DocumentVerification/InputComponent/Input.jsx";
import InputUpload from "../DocumentVerification/Inputupload/InputUpload.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import logo from "../../Images/logo.svg";
import { motion } from "framer-motion";
import { FaUserMd, FaGraduationCap, FaIdCard, FaFileAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";

const StudentDocument = () => {
  const [data, setdata] = useState([]);
  const [error, setError] = useState("");
  const { Data } = useParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/student/StudentDocument/${Data}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const user = await response.json();
        setdata(user.data);
      } catch (error) {
        setError(error.message);
      }
    };

    getData();
  }, []);

  const [formData, setFormData] = useState({
    Phone: data.Phone || "",
    Address: data.Address || "",
    Highesteducation: data.Highesteducation || "",
    SecondarySchool: data.SecondarySchool || "",
    HigherSchool: data.HigherSchool || "",
    SecondaryMarks: data.SecondaryMarks || "",
    HigherMarks: data.HigherMarks || "",
    Aadhaar: null,
    Secondary: null,
    Higher: null,
  });

  const handleFileChange = (fileType, e) => {
    setFormData({
      ...formData,
      [fileType]: e.target.files[0],
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    const formDataObj = new FormData();

    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/student/verification/${Data}`, {
        method: "POST",
        body: formDataObj,
      });

      const responseData = await response.json();
      console.log("response", responseData);

      setLoader(false);
      if (!response.ok) {
        setError(responseData.message);
      } else {
        console.log("Form submitted successfully!");
        navigate("/pending");
      }
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const handleApprove = async (status) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/student/verification/${Data}/approve`,
        { status, remarks },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      console.log("Verification status updated successfully!");
      navigate("/pending");
    } catch (e) {
      console.error("Error:", e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <FaFileAlt className="mr-3" />
            Document Verification
          </h1>
        </div>

        <div className="p-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaUserMd className="mr-2 text-blue-600" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-gray-600">First Name</p>
                <p className="font-medium text-gray-900">{data.Firstname}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">Last Name</p>
                <p className="font-medium text-gray-900">{data.Lastname}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{data.Email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{data.Phone}</p>
              </div>
            </div>
          </motion.div>

          {/* Educational Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaGraduationCap className="mr-2 text-blue-600" />
              Educational Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-gray-600">Qualification</p>
                <p className="font-medium text-gray-900">{data.Qualification}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">Experience</p>
                <p className="font-medium text-gray-900">{data.Experience}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">Expertise</p>
                <p className="font-medium text-gray-900">{data.Expertise}</p>
              </div>
            </div>
          </motion.div>

          {/* Document Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaIdCard className="mr-2 text-blue-600" />
              Document Preview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-2">Identity Document</p>
                <img
                  src={data.Document}
                  alt="Identity Document"
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                />
              </div>
              <div>
                <p className="text-gray-600 mb-2">Profile Picture</p>
                <img
                  src={data.Profile}
                  alt="Profile"
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                />
              </div>
            </div>
          </motion.div>

          {/* Approval Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleApprove("approved")}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FaCheckCircle className="mr-2" />
                Approve
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleApprove("rejected")}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <FaTimesCircle className="mr-2" />
                Reject
              </motion.button>
            </div>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks (required for rejection)"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDocument;
