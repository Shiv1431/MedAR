import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaAtom, FaFlask, FaDna, FaCalculator, FaLaptopCode } from 'react-icons/fa';
import Navbar from '../../../Components/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';

function Courses() {
  const [facList, setFacList] = useState([]);
  const [loading, setLoading] = useState(true);

  const teachersList = async(sub) => {
    setLoading(true);
    const response = await fetch(`/api/course/${sub}`, {
      method: 'GET',
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const data = await response.json();
    setFacList(data.data);
    setLoading(false);
  }

  const subjects = [
    { id: 'physics', icon: <FaAtom className="w-12 h-12" />, name: 'Physics' },
    { id: 'chemistry', icon: <FaFlask className="w-12 h-12" />, name: 'Chemistry' },
    { id: 'biology', icon: <FaDna className="w-12 h-12" />, name: 'Biology' },
    { id: 'math', icon: <FaCalculator className="w-12 h-12" />, name: 'Mathematics' },
    { id: 'computer', icon: <FaLaptopCode className="w-12 h-12" />, name: 'Computer Science' }
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
            Explore Our Courses
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 text-center mb-12"
          >
            Choose from a wide range of subjects taught by expert educators
          </motion.p>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => teachersList(subject.id)}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-center"
              >
                <div className="text-blue-600 mb-4">{subject.icon}</div>
                <h3 className="text-xl font-semibold">{subject.name}</h3>
              </motion.div>
            ))}
          </div>

          {/* Teachers List */}
          {!loading && facList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facList.map((fac, index) => (
                <motion.div
                  key={fac._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png" 
                      alt="profile" 
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">
                        {fac.enrolledteacher.Firstname} {fac.enrolledteacher.Lastname}
                      </h3>
                      <p className="text-blue-600">{fac.enrolledteacher.Email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-semibold">Education:</span> {fac.enrolledteacher.Email === "urttsg@gmail.com" 
                        ? "Post graduate from Calcutta University" 
                        : "Post graduate from Sister Nivedita university"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Experience:</span> {fac.enrolledteacher.Email === "urttsg@gmail.com" 
                        ? "1 year of teaching experience" 
                        : "2 years of teaching experience"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Courses;