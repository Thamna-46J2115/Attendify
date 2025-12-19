import React, { useState } from "react";
import "../App.css";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../Features/UserSlice";
export default function EditProfile() {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [name, setName] = useState(user.name || "");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(user.profilePic);
  const handlePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleSave = () => {
    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("name", name);
    formData.append("password", password || user.password);
    if (profilePic) formData.append("profilePic", profilePic);
    dispatch(updateUserProfile(formData));
    alert("Profile Updated!");
  };
  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">Edit Profile</h1>
      <div className="edit-profile-card">
        <div className="edit-avatar-wrapper">
          <img
            src={preview || "https://via.placeholder.com/150"}
            alt="avatar"
            className="edit-avatar"
          />
        </div>
        <label className="form-label">
          Change Photo
          <input type="file" onChange={handlePicChange} />
        </label>
        <label className="form-label">
          Name
          <input
            className="form-input"
            type="text"
            placeholder="Enter new name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="form-label">
          New Password
          <input
            className="form-input"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="save-profile-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
