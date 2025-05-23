import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

function VarifyDoc() {
    const { type, adminID, ID } = useParams();
    const [data, setData] = useState(null);
    const navigator = useNavigate();
    const [value, setValue] = useState("");

    const handleMessage = (event) => {
        setValue(event.target.value);
    };

    const Approval = async(id, type, approve, email)=>{
        try {
          const data = {
            Isapproved : approve,
            remarks : value,
            email: email,
          }
    
          const response = await fetch(`http://localhost:8000/api/admin/${adminID}/approve/${type}/${id}`, {
            method: 'POST',
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(data),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const result = await response.json();
          navigator(`/admin/${adminID}`);
    
        } catch (error) {
          console.error("Error:", error.message);
        }
      }

    useEffect(() => {
        const getData = async () => {
            try {
              const docData = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/${adminID}/documents/${type}/${ID}`, {
                method: "GET",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
              });
          
              if (docData.status === 401) {
                console.error("Unauthorized: Check if token is missing or expired");
                return;
              }
          
              const response = await docData.json();
              setData(response.data);
            } catch (err) {
              console.log("Error fetching data:", err.message);
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
                        <div className="flex items-center">
                            <button 
                                onClick={() => navigator(`/admin/${adminID}`)} 
                                className="text-white hover:text-blue-200 transition-colors flex items-center"
                            >
                                <span className="text-2xl mr-2">◀</span>
                                <span className="text-lg font-semibold">Back</span>
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-white flex items-center">Document Details</h2>
                        <button 
                            onClick={() => navigator('/')} 
                            className="bg-white text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {type === "student" && data && data.theStudent && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-700">
                                <div>
                                    <p className="font-semibold">Full Name</p>
                                    <p>{data.theStudent.Firstname} {data.theStudent.Lastname}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Phone No</p>
                                    <p>{data.studentDocs.Phone}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Highest Education</p>
                                    <p>{data.studentDocs.Highesteducation}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Address</p>
                                    <p>{data.studentDocs.Address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <img src={data.studentDocs.Secondary} alt="Secondary" className="w-full rounded-lg mb-4"/>
                                <p className="text-gray-700">
                                    <span className="font-semibold">10th Marksheet:</span> 
                                    <span className="text-green-600 ml-2">{data.studentDocs.SecondaryMarks}%</span>
                                </p>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <img src={data.studentDocs.Higher} alt="Higher" className="w-full rounded-lg mb-4"/>
                                <p className="text-gray-700">
                                    <span className="font-semibold">12th Marksheet:</span> 
                                    <span className="text-green-600 ml-2">{data.studentDocs.HigherMarks}%</span>
                                </p>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <img src={data.studentDocs.Aadhaar} alt="Aadhaar" className="w-full rounded-lg mb-4"/>
                                <p className="text-gray-700 font-semibold">Aadhar Card</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <textarea 
                                value={value} 
                                onChange={handleMessage} 
                                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Write reason for rejecting application..."
                            />
                            <div className="flex justify-end space-x-4 mt-4">
                                <button 
                                    onClick={() => Approval(data.theStudent._id, "student", "approved", data.theStudent.Email)}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Approve
                                </button>
                                <button 
                                    onClick={() => Approval(data.theStudent._id, "student", "rejected", data.theStudent.Email)}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Reject
                                </button>
                                <button 
                                    onClick={() => Approval(data.theStudent._id, "student", "reupload", data.theStudent.Email)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Reupload
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {type === "teacher" && data && data.theTeacher && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-700">
                                <div>
                                    <p className="font-semibold">Full Name</p>
                                    <p>{data.theTeacher.Firstname} {data.theTeacher.Lastname}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Phone No</p>
                                    <p>{data.teacherDocs.Phone}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Experience</p>
                                    <p>{data.teacherDocs.Experience} years</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Address</p>
                                    <p>{data.teacherDocs.Address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <img src={data.teacherDocs.Secondary} alt="Secondary" className="w-full rounded-lg mb-4"/>
                                <p className="text-gray-700">
                                    <span className="font-semibold">10th Marksheet:</span> 
                                    <span className="text-green-600 ml-2">{data.teacherDocs.SecondaryMarks}%</span>
                                </p>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <img src={data.teacherDocs.Higher} alt="Higher" className="w-full rounded-lg mb-4"/>
                                <p className="text-gray-700">
                                    <span className="font-semibold">12th Marksheet:</span> 
                                    <span className="text-green-600 ml-2">{data.teacherDocs.HigherMarks}%</span>
                                </p>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <img src={data.teacherDocs.UG} alt="UG" className="w-full rounded-lg mb-4"/>
                                <p className="text-gray-700">
                                    <span className="font-semibold">U.G. Marksheet:</span> 
                                    <span className="text-green-600 ml-2">{data.teacherDocs.UGmarks}</span>
                                </p>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <img src={data.teacherDocs.PG} alt="PG" className="w-full rounded-lg mb-4"/>
                                <p className="text-gray-700">
                                    <span className="font-semibold">P.G. Marksheet:</span> 
                                    <span className="text-green-600 ml-2">{data.teacherDocs.PGmarks}</span>
                                </p>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <img src={data.teacherDocs.Aadhaar} alt="Aadhaar" className="w-full rounded-lg mb-4"/>
                                <p className="text-gray-700 font-semibold">Aadhar Card</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <textarea 
                                value={value} 
                                onChange={handleMessage} 
                                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Write reason for rejecting application..."
                            />
                            <div className="flex justify-end space-x-4 mt-4">
                                <button 
                                    onClick={() => Approval(data.theTeacher._id, "teacher", "approved", data.theTeacher.Email)}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Approve
                                </button>
                                <button 
                                    onClick={() => Approval(data.theTeacher._id, "teacher", "rejected", data.theTeacher.Email)}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Reject
                                </button>
                                <button 
                                    onClick={() => Approval(data.theTeacher._id, "teacher", "reupload", data.theTeacher.Email)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Reupload
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default VarifyDoc;
