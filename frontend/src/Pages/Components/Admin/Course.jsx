import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosNotificationsOutline } from "react-icons/io";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import logo from '../../Images/logo.svg'

const Course = () => {
  const [courseReq, setCourseReq] = useState([]);

  const { data } = useParams();
  const navigator = useNavigate();


    // useEffect((data)=>{
    //     const Postrequest=async()=>{
    //         try{
    //          const response=await axios.post(`api/admin/${data}/approve/student/:studentID`)
    //         //  console.log(response);
    //      }catch(error){
    //         console.error('Error fetching course requests:', error);
    //      }
    //     }
    //     Postrequest();
    // },[])
 





  const formatDay = (day) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[day];
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  
  useEffect(() => {
    const fetchCourseRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/admin/${data}/approve/course`, {
          withCredentials: true, // Ensures cookies are sent with the request
        });
  
        console.log("Fetched Data:", response.data.data);
        setCourseReq(response.data.data);
      } catch (error) {
        console.error('Error fetching course requests:', error.response ? error.response.data : error.message);
      }
    };
  
    fetchCourseRequests();
  
    return () => {
      console.log("Cleanup: Unmounting useEffect");
    };
  }, [data]);
  


  // const handleAccept = async (id,info) => {
  //   console.log(id);
  //   try {
  //     const response = await fetch(`/api/admin/${data}/approve/course/${id}`, {
  //       method: 'POST',
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ 
  //             Isapproved: true,
  //              Email:info.Email,
  //              Firstname:info.enrolledteacher,
  //        }),
  //     });
      
  //     console.log(response);
   
  //     if (response.ok) {
  //       setCourseReq(courseReq.filter(req => req._id !== id));
        
  //     }
  //   } catch (error) {
  //     console.error('Error approving course request:', error);
  //   }
  // };
  
  const handleAccept = async (id, info) => {
    console.log(id);
    console.log(info.Email)
    try {
      const response = await axios.post(`http://localhost:8000/api/admin/${data}/approve/course/${id}`, {
        Isapproved: true,
        email: info.Email,
        Firstname: info.enrolledteacher,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // ✅ Ensure cookies are sent

      });
      
      console.log(response);
     
      if (response.status === 200) {
        setCourseReq(courseReq.filter(req => req._id !== id));
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error approving course request:', error);
    }
  };
  
  
  const handleReject = async (id, info) => {
    console.log(id, info);
    try {
      const response = await axios.post(`http://localhost:8000/api/admin/${data}/approve/course/${id}`, {
        Isapproved: false,
        email: info.Email,
        Firstname: info.enrolledteacher,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      console.log(response);
      
      if (response.status === 200) {
        setCourseReq(courseReq.filter(req => req._id !== id));
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error rejecting course request:', error);
    }
  };

  // const handleReject = async (id,info) => {
  //   console.log(id,info);
  //   try {
  //     const response = await fetch(`/api/admin/${data}/approve/course/${id}`, {
  //       method: 'POST',
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ Isapproved: false,
  //              Email:info.Email,
  //              Firstname:info.enrolledteacher,
  //        }),
  //     });
  //    console.log(response);
  //     if (response.ok) {
  //       setCourseReq(courseReq.filter(req => req._id !== id));
  //     }
  //   } catch (error) {
  //     console.error('Error rejecting course request:', error);
  //   }
  // };





  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigator(`/admin/${data}`)} 
                className="text-white hover:text-blue-200 transition-colors flex items-center"
              >
                <span className="text-2xl mr-2">◀</span>
                <span className="text-lg font-semibold">Back</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <IoIosNotificationsOutline className="h-6 w-6 text-white hover:text-blue-200 transition-colors" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full"></span>
              </div>
              <button 
                onClick={() => navigator('/')} 
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
        {courseReq.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseReq.map((req, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h2 className="text-xl font-bold text-blue-800 mb-2">{req.coursename.toUpperCase()}</h2>
                <p className="text-gray-600 mb-4">{req.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 font-medium">Teacher:</span>
                    <span className="ml-2 text-blue-600">
                      {req.enrolledteacher.Firstname} {req.enrolledteacher.Lastname}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-700 font-medium">Schedule:</p>
                    {req.schedule.map((scheduleItem, idx) => (
                      <div key={idx} className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-blue-800 font-medium">{formatDay(scheduleItem.day)}</p>
                        <p className="text-gray-600">
                          {formatTime(scheduleItem.starttime)} - {formatTime(scheduleItem.endtime)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center">
                    <span className="text-gray-700 font-medium">Status:</span>
                    <span className={`ml-2 font-semibold ${req.isapproved ? 'text-green-600' : 'text-yellow-600'}`}>
                      {req.isapproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>

                  <div className="flex space-x-4 mt-4">
                    <button 
                      onClick={() => handleAccept(req._id, {
                        Email: req.enrolledteacher.Email,
                        enrolledteacher: req.enrolledteacher.Firstname
                      })}
                      className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReject(req._id, {
                        Email: req.enrolledteacher.Email,
                        enrolledteacher: req.enrolledteacher.Firstname
                      })}
                      className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No course requests to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Course;

