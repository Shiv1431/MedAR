import React, { useState, useEffect } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import {
  FaUserMd,
  FaHospital,
  FaStethoscope,
  FaUserGraduate,
  FaClipboardList,
} from "react-icons/fa";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../Images/logo.svg";
import Course from "./Course";
import axios from "axios";

const Admin = () => {
  const { data } = useParams();
  const navigator = useNavigate();

  const [StudentData, setStudentData] = useState([]);
  const [TeacherData, setTeacherData] = useState([]);
  const [adminID, setAdminID] = useState(null);
  const [error, setErrors] = useState("");
  const [allmsg, setAllMsg] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getAllMsg = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/admin/messages/all`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        setAllMsg(data.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    getAllMsg();
  }, []);

  const Approval = async (ID, type, approve) => {
    try {
      const data = {
        Isapproved: approve,
      };

      const response = await fetch(
        `http://localhost:8000/api/admin/${adminID}/approve/${type}/${ID}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Approval request failed");
      }

      if (type === "student") {
        setStudentData((prev) => prev.filter((student) => student._id !== ID));
      } else if (type === "teacher") {
        setTeacherData((prev) => prev.filter((teacher) => teacher._id !== ID));
      }
    } catch (error) {
      setError(error.message); // Ensure `setError` is correctly named
    }
  };

  const docDetails = async (type, ID) => {
    navigator(`/VarifyDoc/${type}/${adminID}/${ID}`);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/admin/${data}/approve`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        } else {
          const result = await response.json();

          setStudentData(result.data.studentsforApproval);
          setTeacherData(result.data.teachersforApproval);
          setAdminID(result.data.admin._id);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <NavLink to="/" className="flex items-center">
              <img src={logo} alt="logo" className="h-10 w-auto" />
              <h1 className="ml-3 text-2xl font-bold text-white">MedLearn</h1>
            </NavLink>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <IoIosNotificationsOutline className="h-6 w-6 text-white hover:text-blue-200 transition-colors" />
                {allmsg && allmsg.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                    {allmsg.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => navigator("/")}
                className="bg-white text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-900 flex items-center"
          >
            <FaClipboardList className="mr-2" />
            Verification Requests
          </motion.h1>

          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <IoIosNotificationsOutline className="mr-2" />
              Messages
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigator(`/admin/course/${data}`)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaStethoscope className="mr-2" />
              Course Requests
            </motion.button>
          </div>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed right-4 top-20 w-96 bg-white rounded-lg shadow-xl overflow-hidden"
          >
            <div className="bg-blue-600 text-white py-3 px-4">
              <h3 className="text-lg font-semibold">Messages</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {allmsg &&
                allmsg.map((msg, index) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    key={index}
                    className="p-4 border-b hover:bg-gray-50"
                  >
                    <p className="font-semibold text-gray-900">{msg.name}</p>
                    <p className="text-blue-600 text-sm">{msg.email}</p>
                    <p className="mt-2 text-gray-600">{msg.message}</p>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student Requests */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="bg-blue-600 text-white p-4 flex items-center">
              <FaUserGraduate className="mr-2" />
              <h2 className="text-lg font-semibold">Student Requests</h2>
            </div>
            <div className="p-4">
              {StudentData && StudentData.length > 0 ? (
                StudentData.map(
                  (student) =>
                    student.Isapproved === "pending" && (
                      <motion.div
                        key={student._id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => docDetails("student", student._id)}
                        className="mb-4 p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaUserGraduate className="text-blue-600 mr-3" />
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {student.Firstname + " " + student.Lastname}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Status:{" "}
                                <span className="text-orange-500 font-medium">
                                  {student.Isapproved}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                )
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No pending student requests
                </p>
              )}
            </div>
          </motion.div>

          {/* Teacher Requests */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="bg-blue-600 text-white p-4 flex items-center">
              <FaUserMd className="mr-2" />
              <h2 className="text-lg font-semibold">
                Medical Professional Requests
              </h2>
            </div>
            <div className="p-4">
              {TeacherData && TeacherData.length > 0 ? (
                TeacherData.map(
                  (teacher) =>
                    teacher.Isapproved === "pending" && (
                      <motion.div
                        key={teacher._id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => docDetails("teacher", teacher._id)}
                        className="mb-4 p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaUserMd className="text-blue-600 mr-3" />
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {teacher.Firstname + " " + teacher.Lastname}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Status:{" "}
                                <span className="text-orange-500 font-medium">
                                  {teacher.Isapproved}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                )
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No pending medical professional requests
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
