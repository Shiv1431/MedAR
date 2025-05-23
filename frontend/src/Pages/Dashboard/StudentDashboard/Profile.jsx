import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProfile } from '../../../services/api';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaGraduationCap, FaCalendarAlt } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const { ID } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        console.log('Fetching profile for student ID:', ID);
        const response = await getProfile('student', ID);
        console.log('Profile data:', response);
        
        if (response.success) {
          setProfileData(response.data);
        } else {
          setError(response.message || 'Failed to fetch profile data');
          toast.error(response.message || 'Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch profile data');
        toast.error('Failed to fetch profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [ID]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="text-center text-red-600">
              <p>{error}</p>
              <Link 
                to={`/Student/Dashboard/${ID}/Welcome`}
                className="mt-4 inline-block text-blue-600 hover:text-blue-800"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mb-4">
        <Link 
          to={`/Student/Dashboard/${ID}/Welcome`}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex items-center space-x-6">
            <div className="h-24 w-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <FaUser className="text-4xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {profileData?.Firstname} {profileData?.Lastname}
              </h1>
              <p className="text-blue-100 text-lg">Student</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-blue-600 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{profileData?.Email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaPhone className="text-blue-600 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{profileData?.Phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaIdCard className="text-blue-600 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="text-gray-900">{profileData?.StudentID || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Academic Information</h2>
              
              <div className="flex items-center space-x-3">
                <FaGraduationCap className="text-blue-600 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Course</p>
                  <p className="text-gray-900">{profileData?.Course || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaCalendarAlt className="text-blue-600 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="text-gray-900">{profileData?.Year || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {profileData?.Studentdetails && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Highest Education</p>
                  <p className="text-gray-900">{profileData.Studentdetails.Highesteducation || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Secondary School</p>
                  <p className="text-gray-900">{profileData.Studentdetails.SecondarySchool || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Higher School</p>
                  <p className="text-gray-900">{profileData.Studentdetails.HigherSchool || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Aadhaar Number</p>
                  <p className="text-gray-900">{profileData.Studentdetails.Aadhaar || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
