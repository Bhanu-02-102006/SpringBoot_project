import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login, registerUser } from "../services/employeeService";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "employee"; // manager or employee
  
  const [isRegister, setIsRegister] = useState(searchParams.get("register") === "true");
  
  useEffect(() => {
    setIsRegister(searchParams.get("register") === "true");
  }, [searchParams]);
  const [user, setUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    department: "",
    phone: "",
    address: "",
    joiningDate: ""
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "manager") {
      // Manager authentication (Login only)
      if (!user.username || !user.password) {
        setError("Please enter your email and password.");
        return;
      }
      login({ username: user.username, password: user.password, portal: "MANAGER" })
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          navigate("/");
        })
        .catch((err) => {
          const errMsg = err.response?.data;
          if (typeof errMsg === "string" && errMsg.includes("not a Manager account")) {
            setError("Invalid Manager account. Please use Manager Login with a Manager account.");
          } else {
            setError("Invalid Manager Credentials");
          }
        });
    } else {
      // Employee Portal logic (Login or Register)
      if (isRegister) {
        // Validation checks
        if (!user.name || !user.email || !user.password || !user.confirmPassword || !user.department) {
          setError("Please fill in all required fields.");
          return;
        }
        if (user.password !== user.confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        if (user.password.length < 6) {
          setError("Password must be at least 6 characters.");
          return;
        }

        const registrationPayload = {
          name: user.name,
          email: user.email,
          password: user.password,
          department: user.department,
          phone: user.phone,
          address: user.address,
          joiningDate: user.joiningDate
        };

        registerUser(registrationPayload)
          .then(() => {
            setSuccess("Registration successful! You can now log in.");
            setIsRegister(false);
            // Reset fields
            setUser({
              username: "",
              password: "",
              confirmPassword: "",
              name: "",
              email: "",
              department: "",
              phone: "",
              address: "",
              joiningDate: ""
            });
          })
          .catch((err) => {
            setError(err.response?.data?.message || "Registration failed. Email may already be in use.");
          });
      } else {
        // Employee Login
        if (!user.username || !user.password) {
          setError("Please fill in all fields.");
          return;
        }
        login({ username: user.username, password: user.password, portal: "EMPLOYEE" })
          .then((response) => {
            localStorage.setItem("token", response.data.token);
            navigate("/");
          })
          .catch((err) => {
            const errMsg = err.response?.data;
            if (typeof errMsg === "string" && errMsg.includes("is a Manager account")) {
              setError("Invalid Employee account. Please use Employee Login with an Employee account.");
            } else {
              setError("Invalid Employee Credentials");
            }
          });
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center bg-light min-vh-100 py-5">
      <div className="container" style={{ maxWidth: isRegister ? "600px" : "450px" }}>
        <div className="text-center mb-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center bg-dark text-info rounded-circle mb-3 p-3 shadow"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <i className="bi bi-cpu-fill fs-1 text-warning"></i>
          </div>
          <h3 className="fw-bold text-dark mb-0">TechNova Solutions</h3>
          <p className="text-secondary small fw-light">
            {mode === "manager" ? "Manager Administration Portal" : "Employee Workspace"}
          </p>
        </div>

        <div className="card shadow-sm p-4 border-0 bg-white">
          <h4 className="text-center mb-4 fw-bold">
            {mode === "manager" ? "Manager Login" : isRegister ? "Employee Registration" : "Employee Login"}
          </h4>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {success && <div className="alert alert-success py-2 small">{success}</div>}

          {/* Employee Tabs Selection */}
          {mode === "employee" && (
            <div className="nav nav-pills nav-justified mb-4 bg-light p-1 rounded">
              <button
                className={`nav-link py-2 fw-bold ${!isRegister ? "bg-success text-white" : "text-secondary"}`}
                onClick={() => {
                  setIsRegister(false);
                  setError("");
                  setSuccess("");
                }}
              >
                Login
              </button>
              <button
                className={`nav-link py-2 fw-bold ${isRegister ? "bg-success text-white" : "text-secondary"}`}
                onClick={() => {
                  setIsRegister(true);
                  setError("");
                  setSuccess("");
                }}
              >
                Register
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isRegister ? (
              // LOGIN FORM FOR BOTH ROLES
              <>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter email address"
                    className="form-control"
                    value={user.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    className="form-control"
                    value={user.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            ) : (
              // EMPLOYEE REGISTRATION FORM
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="form-control"
                    value={user.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@technova.com"
                    className="form-control"
                    value={user.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="At least 6 chars"
                    className="form-control"
                    value={user.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    className="form-control"
                    value={user.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Department *</label>
                  <input
                    type="text"
                    name="department"
                    placeholder="Engineering, Sales..."
                    className="form-control"
                    value={user.department}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+1-555-0199"
                    className="form-control"
                    value={user.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Joining Date</label>
                  <input
                    type="date"
                    name="joiningDate"
                    className="form-control"
                    value={user.joiningDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Physical Address</label>
                  <textarea
                    name="address"
                    rows="2"
                    placeholder="Enter street, city, postal code..."
                    className="form-control"
                    value={user.address}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            )}

            <button 
              className={`btn w-100 py-2.5 fw-bold mt-4 shadow-sm text-white ${
                mode === "manager" ? "btn-primary" : "btn-success"
              }`}
            >
              {mode === "manager" ? "Login as Manager" : isRegister ? "Create Employee Account" : "Login to Portal"}
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-link btn-sm text-decoration-none text-muted"
                onClick={() => navigate("/")}
              >
                &larr; Back to Portal Selection
              </button>
            </div>
          </form>
        </div>
        <div className="text-center mt-4 text-muted small">
          &copy; 2026 TechNova Solutions. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}

export default Login;