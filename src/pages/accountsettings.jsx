import React, { useState } from 'react';
import { Edit2, Save, X, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import BackToTop from '../components/back_the_top_btn.jsx';

const AccountSettings = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'save', 'deactivate', 'delete'
  const [verificationInput, setVerificationInput] = useState('');
  // [MOCK] Fetch initial values with GET /users/:id/settings — {firstName, lastName, otherName, email, phoneNumber, region, city}
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    otherName: 'Michael',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    region: 'Accra',
    city: 'Tema'
  });

  const showNotification = (text) => {
    setNotification(text);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      showNotification('Edit mode enabled');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setVerificationInput('');
  };

  const closeModal = () => {
    setShowModal(false);
    setVerificationInput('');
  };

  const handleModalConfirm = () => {
    if (modalType === 'save') {
      // [API] PATCH /users/:id/settings — {changed fields from formData} → {updatedUser}
      setIsEditing(false);
      showNotification('Changes saved successfully!');
      console.log('Saved data:', formData);
      closeModal();
    } else if (modalType === 'deactivate') {
      if (verificationInput.toLowerCase() === 'deactivate') {
        // [API] PATCH /users/:id/settings — {status: 'inactive'} → {success: true}
        showNotification('Account deactivated successfully');
        closeModal();
        // Add deactivation logic here
      } else {
        showNotification('Incorrect verification text');
      }
    } else if (modalType === 'delete') {
      if (verificationInput.toLowerCase() === 'delete') {
        // [API] DELETE /users/:id — requires re-auth; invalidate session after success
        showNotification('Account deletion request submitted');
        closeModal();
        // Add deletion logic here
      } else {
        showNotification('Incorrect verification text');
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    showNotification('Changes cancelled');
  };

  const getModalContent = () => {
    switch (modalType) {
      case 'save':
        return {
          icon: <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />,
          title: 'Confirm Changes',
          message: 'Are you sure you want to save these changes to your account?',
          confirmText: 'Save Changes',
          confirmColor: 'bg-primary hover:bg-primary-hover',
          showInput: false
        };
      case 'deactivate':
        return {
          icon: <AlertTriangle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />,
          title: 'Deactivate Account',
          message: 'This will temporarily disable your account. You can reactivate it by logging in again.',
          verificationText: 'DEACTIVATE',
          placeholder: 'Type "DEACTIVATE" to confirm',
          confirmText: 'Deactivate Account',
          confirmColor: 'bg-primary hover:bg-primary-hover',
          showInput: true
        };
      case 'delete':
        return {
          icon: <AlertTriangle className="w-16 h-16 text-error mx-auto mb-4" />,
          title: 'Delete Account',
          message: 'This action cannot be undone. All your data will be permanently deleted.',
          verificationText: 'DELETE',
          placeholder: 'Type "DELETE" to confirm',
          confirmText: 'Delete Account',
          confirmColor: 'bg-error hover:bg-error/90',
          showInput: true
        };
      default:
        return {};
    }
  };

  const modalContent = getModalContent();

  return (
    <div className="bg-white dark:bg-[#0f1117] min-h-screen flex justify-center items-start p-8">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up">
          {notification}
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
            {modalContent.icon}

            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 text-center mb-4">
              {modalContent.title}
            </h2>
            
            <p className="text-gray-600 dark:text-slate-400 text-center mb-6">
              {modalContent.message}
            </p>

            {modalContent.showInput && (
              <div className="mb-6">
                <p className="text-sm text-gray-700 dark:text-slate-300 mb-2">
                  Type <span className="font-bold text-gray-900 dark:text-slate-100">{modalContent.verificationText}</span> to confirm:
                </p>
                <input
                  type="text"
                  value={verificationInput}
                  onChange={(e) => setVerificationInput(e.target.value)}
                  placeholder={modalContent.placeholder}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-[#2d3748] rounded-lg text-base focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all bg-white dark:bg-[#252b3b] dark:text-slate-200 dark:placeholder-slate-500"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 bg-white dark:bg-[#1a1f2e] hover:bg-gray-50 dark:hover:bg-[#252b3b] text-gray-700 dark:text-slate-300 border-2 border-gray-300 dark:border-[#2d3748] font-medium px-6 py-3 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleModalConfirm}
                disabled={modalContent.showInput && verificationInput.toLowerCase() !== modalContent.verificationText.toLowerCase()}
                className={`flex-1 ${modalContent.confirmColor} text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {modalContent.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl w-full bg-white dark:bg-[#1a1f2e] rounded-xl p-8 shadow-lg">
        <button 
          onClick={() => {
            showNotification('Navigating back...');
            setTimeout(() => {
              if (window.history.length > 2) {
                navigate(-1);
              } else {
                navigate('/lucid/dashboard');
              }
            }, 600);
          }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#252b3b] rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        {/* User Information Section */}
        <div className="relative pb-4 mb-8 border-b border-gray-200 dark:border-[#1e293b]">
          <div className="flex justify-between items-center">
            <h2 className="flex-1 text-center text-2xl font-semibold text-gray-800 dark:text-slate-200">
              User Information
            </h2>
            {!isEditing && (
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-transparent hover:bg-blue-50 text-primary font-medium px-4 py-2 rounded-md transition-all duration-200"
              >
                <Edit2 size={20} />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>

        {/* Form Section */}
        <div className="mb-12">
          {/* First and Last Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 dark:text-slate-500 text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`px-4 py-3 border rounded-md text-base transition-all duration-200 ${
                  isEditing
                    ? 'bg-white dark:bg-[#252b3b] text-gray-700 dark:text-slate-200 border-gray-300 dark:border-[#2d3748] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40'
                    : 'bg-gray-50 dark:bg-[#252b3b] text-gray-600 dark:text-slate-400 border-gray-300 dark:border-[#2d3748] cursor-not-allowed'
                }`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 dark:text-slate-500 text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`px-4 py-3 border rounded-md text-base transition-all duration-200 ${
                  isEditing
                    ? 'bg-white dark:bg-[#252b3b] text-gray-700 dark:text-slate-200 border-gray-300 dark:border-[#2d3748] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40'
                    : 'bg-gray-50 dark:bg-[#252b3b] text-gray-600 dark:text-slate-400 border-gray-300 dark:border-[#2d3748] cursor-not-allowed'
                }`}
              />
            </div>
          </div>

          {/* Other Name */}
          <div className="flex flex-col gap-2 mb-6">
            <label className="text-gray-400 text-sm font-medium">Other Name</label>
            <input
              type="text"
              name="otherName"
              value={formData.otherName}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`px-4 py-3 border rounded-md text-base transition-all duration-200 ${
                isEditing
                  ? 'bg-white text-gray-700 border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  : 'bg-gray-50 text-gray-600 border-gray-300 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2 mb-6">
            <label className="text-gray-400 text-sm font-medium">E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`px-4 py-3 border rounded-md text-base transition-all duration-200 ${
                isEditing
                  ? 'bg-white text-gray-700 border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  : 'bg-gray-50 text-gray-600 border-gray-300 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`px-4 py-3 border rounded-md text-base transition-all duration-200 ${
                isEditing
                  ? 'bg-white text-gray-700 border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  : 'bg-gray-50 text-gray-600 border-gray-300 cursor-not-allowed'
              }`}
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="pb-4 mb-8 border-b border-gray-200">
          <h2 className="text-center text-2xl font-semibold text-gray-800">Location</h2>
        </div>

        <div className="mb-12">
          {/* Region and City Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 dark:text-slate-500 text-sm font-medium">Region</label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`px-4 py-3 border rounded-md text-base transition-all duration-200 ${
                  isEditing
                    ? 'bg-white dark:bg-[#252b3b] text-gray-700 dark:text-slate-200 border-gray-300 dark:border-[#2d3748] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40'
                    : 'bg-gray-50 dark:bg-[#252b3b] text-gray-600 dark:text-slate-400 border-gray-300 dark:border-[#2d3748] cursor-not-allowed'
                }`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 dark:text-slate-500 text-sm font-medium">City/Town</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`px-4 py-3 border rounded-md text-base transition-all duration-200 ${
                  isEditing
                    ? 'bg-white dark:bg-[#252b3b] text-gray-700 dark:text-slate-200 border-gray-300 dark:border-[#2d3748] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40'
                    : 'bg-gray-50 dark:bg-[#252b3b] text-gray-600 dark:text-slate-400 border-gray-300 dark:border-[#2d3748] cursor-not-allowed'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Account Status Section - Only show when not editing */}
        {!isEditing && (
          <div className="transition-all duration-300 ease-in-out">
            <div className="mb-4">
              <h2 className="text-center text-2xl font-semibold text-gray-800">
                Account Status
              </h2>
            </div>

            <div className="pt-8">
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => openModal('deactivate')}
                  className="bg-primary hover:bg-primary-hover text-white font-medium px-8 py-3 rounded-md transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg min-w-[160px]"
                >
                  Deactivate Account
                </button>
                <button
                  onClick={() => openModal('delete')}
                  className="bg-error hover:bg-error/90 text-white font-medium px-8 py-3 rounded-md transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg min-w-[160px]"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save/Cancel Buttons - Only show when editing */}
        {isEditing && (
          <div className="pt-8 transition-all duration-300 ease-in-out animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => openModal('save')}
                className="bg-primary hover:bg-primary-hover text-white font-medium px-8 py-3 rounded-md transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg min-w-[160px] flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-white hover:bg-primary text-primary hover:text-white border-2 border-primary font-medium px-8 py-3 rounded-md transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg min-w-[160px] flex items-center justify-center gap-2"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translate(-50%, 20px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
      <BackToTop />
    </div>
  );
};

export default AccountSettings;