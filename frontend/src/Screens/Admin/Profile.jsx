import React, { useState, useCallback } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import UpdatePasswordLoggedIn from "../../components/UpdatePasswordLoggedIn";
import CustomButton from "../../components/CustomButton";
import axiosWrapper from "../../utils/AxiosWrapper";
import toast from "react-hot-toast";

const Profile = React.memo(({ profileData, onUpdate }) => {
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = useCallback(() => {
    setEditedData({
      firstName: profileData.firstName || "",
      middleName: profileData.middleName || "",
      lastName: profileData.lastName || "",
      email: profileData.email || "",
      phone: profileData.phone || "",
      address: profileData.address || "",
      city: profileData.city || "",
      state: profileData.state || "",
      pincode: profileData.pincode || "",
      country: profileData.country || "",
      emergencyContact: {
        name: profileData.emergencyContact?.name || "",
        relationship: profileData.emergencyContact?.relationship || "",
        phone: profileData.emergencyContact?.phone || "",
      },
    });
    setIsEditing(true);
  }, [profileData]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditedData({});
  }, []);

  const handleSave = useCallback(async () => {
    if (!editedData || Object.keys(editedData).length === 0) {
      toast.error("No changes to save");
      return;
    }

    setIsSaving(true);
    try {
      const userToken = localStorage.getItem("userToken");
      const userType = localStorage.getItem("userType")?.toLowerCase() || "admin";
      
      // Prepare clean data without empty values and normalize email
      const cleanData = Object.entries(editedData).reduce((acc, [key, value]) => {
        if (key === 'emergencyContact' && value) {
          const emergencyData = Object.entries(value).reduce((ec, [ek, ev]) => {
            if (ev && ev !== "") ec[ek] = ev;
            return ec;
          }, {});
          if (Object.keys(emergencyData).length > 0) {
            acc[key] = emergencyData;
          }
        } else if (key === 'email' && value) {
          acc[key] = value.trim().toLowerCase();
        } else if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});
      
      if (Object.keys(cleanData).length === 0) {
        toast.error("No valid changes to save");
        setIsSaving(false);
        return;
      }
      
      const response = await axiosWrapper.patch(
        `/${userType}/my-details`,
        cleanData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setEditedData({});
        if (onUpdate) {
          onUpdate(response.data.data);
        }
      } else {
        toast.error(response.data?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [editedData, onUpdate]);

  const handleInputChange = useCallback((field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setEditedData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}),
          [child]: value,
        },
      }));
    } else {
      setEditedData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  }, []);

  if (!profileData) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-blue-100">
        <div className="flex items-center gap-8">
          <div className="relative">
            <img
              src={`${process.env.REACT_APP_MEDIA_LINK}/${profileData.profile}`}
              alt="Profile"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-4 ring-blue-500 ring-offset-4 shadow-xl transform hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-lg"></div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {`${profileData.firstName} ${profileData.lastName}`}
            </h1>
            <p className="text-lg text-gray-600 mb-1">
              Employee ID: {profileData.employeeId}
            </p>
            <p className="text-lg text-blue-600 font-medium">
              {profileData.designation}
              {profileData.isSuperAdmin && " (Super Admin)"}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {!isEditing ? (
            <>
              <CustomButton onClick={handleEdit} className="flex items-center gap-2">
                <FiEdit2 className="text-lg" />
                Edit Profile
              </CustomButton>
              <CustomButton onClick={() => setShowUpdatePasswordModal(true)}>
                Update Password
              </CustomButton>
            </>
          ) : (
            <>
              <CustomButton 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <FiSave className="text-lg" />
                {isSaving ? "Saving..." : "Save Changes"}
              </CustomButton>
              <CustomButton 
                variant="secondary" 
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <FiX className="text-lg" />
                Cancel
              </CustomButton>
            </>
          )}
        </div>
        {showUpdatePasswordModal && (
          <UpdatePasswordLoggedIn
            onClose={() => setShowUpdatePasswordModal(false)}
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:gap-8">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 pb-3 border-b-2 border-gray-200">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{profileData.email}</p>
              )}
            </div>
            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{profileData.phone}</p>
              )}
            </div>
            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Gender</label>
              <p className="text-gray-900 font-medium capitalize">{profileData.gender}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Blood Group</label>
              <p className="text-gray-900 font-medium">{profileData.bloodGroup}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Date of Birth</label>
              <p className="text-gray-900 font-medium">{formatDate(profileData.dob)}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Joining Date</label>
              <p className="text-gray-900 font-medium">{formatDate(profileData.joiningDate)}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors duration-200 border border-green-200">
              <label className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1 block">Salary</label>
              <p className="text-green-900 font-bold text-lg">₹{profileData.salary.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Status</label>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                profileData.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {profileData.status.toUpperCase()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-colors duration-200 border border-blue-200">
              <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1 block">Role</label>
              <p className="text-blue-900 font-bold">{profileData.isSuperAdmin ? "Super Admin" : "Admin"}</p>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 pb-3 border-b-2 border-gray-200">
            Address Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{profileData.address}</p>
              )}
            </div>
            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">City</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{profileData.city}</p>
              )}
            </div>
            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">State</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.state || ""}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{profileData.state}</p>
              )}
            </div>
            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Pincode</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.pincode || ""}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{profileData.pincode}</p>
              )}
            </div>
            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Country</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.country || ""}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{profileData.country}</p>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 pb-3 border-b-2 border-gray-200">
            Emergency Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.emergencyContact?.name || ""}
                  onChange={(e) => handleInputChange("emergencyContact.name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{profileData.emergencyContact?.name}</p>
              )}
            </div>
            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Relationship</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.emergencyContact?.relationship || ""}
                  onChange={(e) => handleInputChange("emergencyContact.relationship", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{profileData.emergencyContact?.relationship}</p>
              )}
            </div>
            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedData.emergencyContact?.phone || ""}
                  onChange={(e) => handleInputChange("emergencyContact.phone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{profileData.emergencyContact?.phone}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Profile.displayName = 'Profile';

export default Profile;
