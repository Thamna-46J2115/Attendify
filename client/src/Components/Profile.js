import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../Features/UserSlice";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import Location from "./Location";
export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = user?.token;

  const refreshUserFromDB = async () => {
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:3001/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({
        type: "users/loginUser/fulfilled",
        payload: {
          ...res.data,
          token,
        },
      });
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    refreshUserFromDB();
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name);
    }
  }, [user]);

  const picURL = profilePic
    ? URL.createObjectURL(profilePic)
    : user?.profilePic
    ? `http://localhost:3001/${user.profilePic}`
    : null;

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      alert("User ID missing. Please login again.");
      return;
    }

    if (password && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("name", userName);
    if (password) formData.append("password", password);
    if (profilePic) formData.append("profilePic", profilePic);

    try {
      setLoading(true);

      await dispatch(
        updateUserProfile({
          formData,
          token,
          _id: user._id,
        })
      ).unwrap();

      await refreshUserFromDB();

      setPassword("");
      setConfirmPassword("");
      setProfilePic(null);
    } catch (err) {
      alert(err || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p style={{ textAlign: "center" }}>Loading profile...</p>;
  }

  return (
    <Container fluid className="dashboard-wrapper">
      <div className="user-header">
        <h2>Welcome, {user.name}!</h2>
        <p>Your email: {user.email}</p>
      </div>

      <Row>
        <Col md={3}>
          <div className="profile-card">
            {picURL ? (
              <img src={picURL} alt="profile" className="profile-avatar" />
            ) : (
              <div className="profile-avatar empty-avatar">No Image</div>
            )}

            <h4 className="profile-name">{user.name}</h4>

            <p>
              <strong>Email:</strong> {user.email}
            </p>

            <p>
              <strong>Role:</strong> {user.role}
            </p>

            <p>
              <strong>Joined:</strong> {user.createdAt?.split("T")[0] || "N/A"}
            </p>
          </div>

          <Location />
        </Col>

        <Col md={6}>
          <div className="edit-profile-section">
            <h2 className="section-title">Update Your Information</h2>

            <Form onSubmit={handleUpdate} className="profile-form">
              <FormGroup className="form-group-custom">
                <Label className="form-label-custom">Profile Picture</Label>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  className="input-custom"
                />

                {profilePic && (
                  <img
                    src={URL.createObjectURL(profilePic)}
                    alt="preview"
                    className="preview-img"
                  />
                )}
              </FormGroup>

              <FormGroup className="form-group-custom">
                <Label className="form-label-custom">Full Name</Label>
                <Input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="input-custom"
                />
              </FormGroup>

              <FormGroup className="form-group-custom">
                <Label className="form-label-custom">New Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-custom"
                />
              </FormGroup>

              <FormGroup className="form-group-custom">
                <Label className="form-label-custom">Confirm Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-custom"
                />
              </FormGroup>

              <Button
                color="primary"
                type="submit"
                className="update-btn"
                disabled={loading}
              >
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
