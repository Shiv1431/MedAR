import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const { ID } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    Firstname: '',
    Lastname: '',
    Email: '',
    ProfileImage: '',
    Studentdetails: {
      Phone: '',
      Address: ''
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        console.log('Fetching profile for ID:', ID);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/student/StudentDocument/${ID}`,
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );
        
        console.log('Profile response:', response.data);
        
        if (response.data && response.data.data) {
          const { student, studentdetails } = response.data.data;
          console.log('Student data:', student);
          console.log('Student details:', studentdetails);
          
          // Ensure Studentdetails is properly initialized
          const studentDetailsData = studentdetails || {
            Phone: '',
            Address: '',
            Highesteducation: 'Not provided',
            SecondarySchool: 'Not provided',
            HigherSchool: 'Not provided',
            SecondaryMarks: 0,
            HigherMarks: 0,
            Aadhaar: 'Not provided',
            Secondary: 'Not provided',
            Higher: 'Not provided'
          };
          
          // Set the user data with the correct structure
          const newUserData = {
            Firstname: student.Firstname || '',
            Lastname: student.Lastname || '',
            Email: student.Email || '',
            ProfileImage: student.ProfileImage || '',
            Studentdetails: studentDetailsData
          };
          
          console.log('Setting user data:', newUserData);
          setUserData(newUserData);
          
          if (student.ProfileImage) {
            setPreviewUrl(student.ProfileImage);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    if (ID) {
      console.log('Profile component mounted with ID:', ID);
      fetchProfile();
    } else {
      console.log('No ID provided to Profile component');
      setIsLoading(false);
    }
  }, [ID, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!userData.Firstname.trim()) errors.Firstname = 'First name is required';
    if (!userData.Lastname.trim()) errors.Lastname = 'Last name is required';
    if (!userData.Email.trim()) errors.Email = 'Email is required';
    if (userData.Email && !/\S+@\S+\.\S+/.test(userData.Email)) {
      errors.Email = 'Email is invalid';
    }
    if (userData.Studentdetails?.Phone && !/^\+?[\d\s-]{10,}$/.test(userData.Studentdetails.Phone)) {
      errors.Phone = 'Phone number is invalid';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      if (selectedFile) {
        formData.append('profileImage', selectedFile);
      }
      
      formData.append('Firstname', userData.Firstname);
      formData.append('Lastname', userData.Lastname);
      formData.append('Email', userData.Email);
      formData.append('Phone', userData.Studentdetails?.Phone || '');
      formData.append('Address', userData.Studentdetails?.Address || '');

      console.log('Submitting form data:', {
        Firstname: userData.Firstname,
        Lastname: userData.Lastname,
        Email: userData.Email,
        Phone: userData.Studentdetails?.Phone || '',
        Address: userData.Studentdetails?.Address || ''
      });

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/student/profile/update`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );

      console.log('Update response:', response.data);

      if (response.data && response.data.data) {
        const updatedData = response.data.data.student;
        console.log('Updated data:', updatedData);
        
        setUserData(prev => ({
          ...prev,
          ...updatedData,
          Studentdetails: updatedData.Studentdetails || {
            Phone: '',
            Address: '',
            Highesteducation: 'Not provided',
            SecondarySchool: 'Not provided',
            HigherSchool: 'Not provided',
            SecondaryMarks: 0,
            HigherMarks: 0,
            Aadhaar: 'Not provided',
            Secondary: 'Not provided',
            Higher: 'Not provided'
          }
        }));
        
        toast.success('Profile updated successfully');
        setIsEditing(false);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested Studentdetails fields
    if (name === 'Phone' || name === 'Address') {
      setUserData(prev => ({
        ...prev,
        Studentdetails: {
          ...prev.Studentdetails,
          [name]: value
        }
      }));
    } else {
      // Handle top-level fields
      setUserData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mb-4">
        <Link 
          to={`/Student/Dashboard/${ID}/Welcome`}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <FaUser className="text-4xl text-white" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-lg">
                  <FaCamera className="text-blue-600" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {userData?.Firstname || 'First Name'} {userData?.Lastname || 'Last Name'}
              </h1>
              <p className="text-blue-100">Student</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="Firstname"
                  value={userData.Firstname}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formErrors.Firstname ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {formErrors.Firstname && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.Firstname}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="Lastname"
                  value={userData.Lastname}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formErrors.Lastname ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {formErrors.Lastname && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.Lastname}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="Email"
                  value={userData.Email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formErrors.Email ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {formErrors.Email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.Email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="Phone"
                  value={userData.Studentdetails.Phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formErrors.Phone ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {formErrors.Phone && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.Phone}</p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="Address"
                  value={userData.Studentdetails.Address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedFile(null);
                      setPreviewUrl(userData?.ProfileImage || '');
                    }}
                    className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <FaTimes />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <FaSave />
                    <span>Save Changes</span>
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
