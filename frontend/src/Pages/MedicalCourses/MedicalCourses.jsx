import React from "react";
import { motion } from "framer-motion";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const MedicalCourses = () => {
  const courses = [
    {
      id: 1,
      title: "Anatomy & Physiology",
      description: "Comprehensive course covering human anatomy and physiology, from cells to organ systems.",
      duration: "12 weeks",
      level: "Beginner to Intermediate",
      instructor: "Dr. Sarah Johnson",
      videos: [
        {
          title: "Introduction to Human Anatomy",
          youtubeId: "0Bmhjf0rKe8",
          description: "Basic overview of human anatomy and its importance in medical studies."
        },
        {
          title: "The Skeletal System",
          youtubeId: "rDGqkMHPDqE",
          description: "Detailed study of bones, joints, and the skeletal system."
        },
        {
          title: "The Muscular System",
          youtubeId: "Ktv-CaOt6UQ",
          description: "Understanding muscles, their functions, and types."
        }
      ]
    },
    {
      id: 2,
      title: "Medical Terminology",
      description: "Learn the language of medicine with this comprehensive terminology course.",
      duration: "8 weeks",
      level: "Beginner",
      instructor: "Prof. Michael Chen",
      videos: [
        {
          title: "Medical Terminology Basics",
          youtubeId: "D3v4jH_5XeM",
          description: "Introduction to medical prefixes, suffixes, and root words."
        },
        {
          title: "Body Systems Terminology",
          youtubeId: "7S0Xx-4qQ1U",
          description: "Medical terms related to different body systems."
        }
      ]
    },
    {
      id: 3,
      title: "Clinical Skills",
      description: "Practical training in essential clinical skills for medical professionals.",
      duration: "10 weeks",
      level: "Intermediate",
      instructor: "Dr. Emily Rodriguez",
      videos: [
        {
          title: "Basic Clinical Examination",
          youtubeId: "gG8kh8MfnGY",
          description: "Learn the fundamentals of patient examination."
        },
        {
          title: "Vital Signs Assessment",
          youtubeId: "G5XGJQ6Tp2I",
          description: "How to measure and interpret vital signs."
        }
      ]
    },
    {
      id: 4,
      title: "Pathology",
      description: "Study of diseases, their causes, and effects on the human body.",
      duration: "14 weeks",
      level: "Advanced",
      instructor: "Dr. James Wilson",
      videos: [
        {
          title: "Introduction to Pathology",
          youtubeId: "6Xm0LszGVtI",
          description: "Overview of disease processes and pathology basics."
        },
        {
          title: "Common Pathological Conditions",
          youtubeId: "Y5gL1z1NwvE",
          description: "Study of frequently encountered pathological conditions."
        }
      ]
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Medical Courses
            </h1>
            <p className="text-gray-600 text-lg">
              Comprehensive medical education for aspiring healthcare professionals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{course.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Level</p>
                      <p className="font-medium">{course.level}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Instructor</p>
                      <p className="font-medium">{course.instructor}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Course Videos
                  </h3>
                  <div className="space-y-4">
                    {course.videos.map((video, index) => (
                      <div key={index} className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {video.title}
                        </h4>
                        <div className="aspect-w-16 aspect-h-9 mb-2">
                          <iframe
                            src={`https://www.youtube.com/embed/${video.youtubeId}`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full rounded-lg"
                          ></iframe>
                        </div>
                        <p className="text-sm text-gray-600">
                          {video.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MedicalCourses; 