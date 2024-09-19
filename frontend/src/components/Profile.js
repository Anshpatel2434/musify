import React, { useState } from "react";
import SexualOrientation from "./SexualOrientation";
import "../App.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { sendToast } from "../redux/toastSlice";
import { setUserInfo } from "../redux/userSlice";

const Profile = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("Profile");
  const [user, setUser] = useState(useSelector((store) => store.user.user));
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image
  const dispatch = useDispatch();

  console.log(user.profilePic)
  console.log(decodeURIComponent(user.profilePic))

  const handleEditProfileClick = () => {
    setIsEditingProfile(true);
    setProfileMsg("Edit Profile");
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]); // Update state with the selected image file 
  };

  const handleDoneProfileClick = async () => {
    setIsEditingProfile(false);
    setProfileMsg("Profile");

    const formData = new FormData(); // Create FormData object to handle the image file
    formData.append("email", user.email);
    formData.append("user", JSON.stringify(user)); // Send user data as a JSON string
    if (selectedImage) {
      formData.append("image", selectedImage); // Append image to FormData
    }

    try {
      const response = await axios.post("http://localhost:8000/api/v1/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === 200) {
        dispatch(setUserInfo({...user , updatedProfilePic:selectedImage}))
        dispatch(sendToast("User profile edited successfully"));
      } else {
        dispatch(sendToast(response.data.message));
      }
    } catch (err) {
      dispatch(sendToast("Error : Couldn't edit user's profile"+err));
    }
  };

  const handleEditClick = () => {
    // Trigger the click event on the hidden file input
    document.getElementById("fileInput").click();
  };

  return (
    <div className="pb-[8rem] w-full no-scrollbar flex flex-col items-center py-8 bg-gradient-to-tr from-[#000000] to-[#434343] h-[100vh] overflow-y-scroll space-y-12">
      <div className="w-[90%] p-6 space-y-6 bg-gradient-to-tr from-[#000000cf] to-[#282626a9] rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-white">{profileMsg}</h2>
        <div className="flex justify-center">
          <img
            src={
                selectedImage ? URL.createObjectURL(selectedImage) :
                user.updatedProfilePic ? URL.createObjectURL(user.updatedProfilePic) :
                user.profilePic ? decodeURIComponent(user.profilePic) :  "https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Placeholder image URL
            }
            alt="User"
            className="md:w-44 md:h-44 w-20 h-20 rounded-full border-4 border-indigo-500"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            className={isEditingProfile ? 
              "font-bold text-white py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring focus:ring-indigo-400"
            :
              "font-bold text-white py-2 px-4 bg-gray-800 "}
            onClick={handleEditClick}
            disabled={!isEditingProfile} // Disable when not editing
          >
            Edit Profile Image
          </button>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="mt-2 hidden"
            onChange={handleImageChange} // Image change handler
            disabled={!isEditingProfile} // Disable when not editing
          />
        </div>
        <div className="flex flex-wrap justify-center gap-14 pt-16">
          <div className="lg:w-1/3 md:w-full">
            <label className="block text-sm font-medium text-white">Full Name</label>
            <input
              type="text"
              defaultValue={user.name}
              disabled={!isEditingProfile}
              className="w-full px-3 py-2 mt-1 text-black bg-gray-300 border border-gray-500 rounded-md focus:ring focus:ring-indigo-400 focus:border-indigo-400"
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>
          <div className="lg:w-1/3 md:w-full">
            <label className="block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              defaultValue={user.email}
              disabled={true}
              className="w-full px-3 py-2 mt-1 text-black bg-gray-300 border border-gray-500 rounded-md focus:ring focus:ring-indigo-400 focus:border-indigo-400"
            />
          </div>
          <div className="lg:w-1/3 md:w-full">
            <label className="block text-sm font-medium text-white">Contact Number</label>
            <input
              type="tel"
              defaultValue={user.phone}
              disabled={!isEditingProfile}
              className="w-full px-3 py-2 mt-1 text-black bg-gray-300 border border-gray-500 rounded-md focus:ring focus:ring-indigo-400 focus:border-indigo-400"
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />
          </div>
          <div className="lg:w-1/3 md:w-full">
            <label className="block text-sm font-medium text-white">Birthdate</label>
            <input
              type="date"
              defaultValue={user.birthdate}
              disabled={!isEditingProfile}
              className="w-full px-3 py-2 mt-1 text-black bg-gray-300 border border-gray-500 rounded-md focus:ring focus:ring-indigo-400 focus:border-indigo-400"
              onChange={(e) => setUser({ ...user, birthdate: e.target.value })}
            />
          </div>
        </div>
        <div className="flex justify-start pt-6">
          {!isEditingProfile && (
            <button
              onClick={handleEditProfileClick}
              className="mt-4 px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:ring focus:ring-indigo-400"
            >
              Edit Profile
            </button>
          )}
          {isEditingProfile && (
            <button
              onClick={handleDoneProfileClick}
              className="mt-4 px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:ring focus:ring-indigo-400"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
