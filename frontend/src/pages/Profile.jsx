import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile, changePassword } from "../services/employeeService";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    setLoading(true);
    setError("");
    setSuccess("");
    getMyProfile()
      .then((res) => {
        setProfile(res.data);
        setPhone(res.data.phone || "");
        setAddress(res.data.address || "");
        setProfilePicture(res.data.profilePicture || "");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to fetch profile details.");
        setLoading(false);
      });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const updatedProfile = {
      ...profile,
      phone,
      address,
      profilePicture
    };

    updateMyProfile(updatedProfile)
      .then((res) => {
        setSuccess("Profile details updated successfully!");
        setProfile(res.data);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to update profile details.");
      });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPwdError("New passwords do not match!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPwdError("New password must be at least 6 characters long.");
      return;
    }

    changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      .then(() => {
        setPwdSuccess("Password changed successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      })
      .catch((err) => {
        setPwdError(err.response?.data?.message || "Failed to change password. Make sure current password is correct.");
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h2 className="mb-4 fw-bold text-dark">
        <i className="bi bi-person-circle text-primary me-2"></i> Profile Module
      </h2>

      <div className="row g-4">
        {/* Profile Card & Settings */}
        <div className="col-md-7">
          <div className="card shadow-sm p-4 border-0 bg-white mb-4">
            <h5 className="fw-bold text-secondary mb-4">Personal Details</h5>

            {error && <div className="alert alert-danger mb-3">{error}</div>}
            {success && <div className="alert alert-success mb-3">{success}</div>}

            <form onSubmit={handleProfileUpdate}>
              <div className="row g-4 align-items-center mb-4">
                {/* Profile Pic */}
                <div className="col-md-3 text-center">
                  <div
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3 shadow-inner"
                    style={{ width: "120px", height: "120px", border: "3px solid #dee2e6", overflow: "hidden" }}
                  >
                    {profilePicture ? (
                      <img src={profilePicture} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="54"
                        height="54"
                        fill="currentColor"
                        className="bi bi-person text-secondary"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6M14.5 13c0-1.66-2-3-6-3s-6 1.34-6 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5" />
                      </svg>
                    )}
                  </div>
                  <label className="btn btn-outline-secondary btn-sm position-relative">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {/* Static Details */}
                <div className="col-md-9">
                  <table className="table table-borderless table-sm align-middle small mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold text-muted" style={{ width: "35%" }}>ID</td>
                        <td>{profile?.id}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold text-muted">Name</td>
                        <td>{profile?.name}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold text-muted">Email</td>
                        <td>{profile?.email}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold text-muted">Department</td>
                        <td>{profile?.department}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold text-muted">Salary</td>
                        <td>${profile?.salary?.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold text-muted">Joining Date</td>
                        <td>{profile?.joiningDate || "-"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter phone number..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter physical address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>

              <button className="btn btn-primary px-4 fw-bold shadow-sm" type="submit">
                Save Profile Changes
              </button>
            </form>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="col-md-5">
          <div className="card shadow-sm p-4 border-0 bg-white">
            <h5 className="fw-bold text-secondary mb-4">Change Password</h5>

            {pwdError && <div className="alert alert-danger mb-3">{pwdError}</div>}
            {pwdSuccess && <div className="alert alert-success mb-3">{pwdSuccess}</div>}

            <form onSubmit={handlePasswordChange}>
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="New password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <button className="btn btn-warning w-100 py-2 fw-bold text-dark mt-2" type="submit">
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
