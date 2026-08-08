import { useNavigate, Navigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="d-flex flex-column bg-light" style={{ minHeight: "100vh" }}>
      {/* Navbar Header */}
      <nav className="navbar navbar-light bg-white border-bottom py-3 shadow-sm">
        <div className="container justify-content-center justify-content-md-start">
          <span className="navbar-brand fw-bold text-primary d-flex align-items-center">
            <i className="bi bi-cpu-fill me-2 fs-3 text-primary"></i>
            <span className="fs-4 tracking-tight">TechNova Solutions</span>
          </span>
        </div>
      </nav>

      {/* Main Content Body */}
      <div className="d-flex flex-grow-1 align-items-center py-5">
        <div className="container" style={{ maxWidth: "1000px" }}>
          
          {/* Page Hero Header */}
          <div className="text-center mb-5">
            <h1 className="fw-extrabold text-dark display-5 mb-2">
              Human Resource Management System
            </h1>
            <p className="text-muted fs-5 mx-auto" style={{ maxWidth: "600px" }}>
              Manage your workforce efficiently in one secure HR management portal.
            </p>
          </div>

          {/* Dual Portals Selection Cards */}
          <div className="row g-4 justify-content-center">
            
            {/* CARD 1 - MANAGER PORTAL */}
            <div className="col-12 col-md-6 col-lg-5">
              <div className="card h-100 border-0 shadow-sm rounded-3 hover-card transition-all bg-white">
                <div className="card-top-accent bg-primary" style={{ height: "4px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}></div>
                <div className="card-body p-4 d-flex flex-column">
                  
                  {/* Icon and Title */}
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary bg-opacity-10 text-primary rounded p-3 me-3 d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
                      <i className="bi bi-briefcase-fill fs-2"></i>
                    </div>
                    <div>
                      <h3 className="fw-bold text-dark mb-0">Manager Portal</h3>
                      <span className="text-muted small">Administration & Analytics</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-secondary small mb-4 flex-grow-0">
                    Manage employees, attendance, leave requests, reports and organization-wide analytics.
                  </p>

                  {/* Features List */}
                  <div className="mb-5 flex-grow-1">
                    <h6 className="fw-bold text-dark small mb-3">KEY FEATURES</h6>
                    <ul className="list-unstyled mb-0">
                      <li className="d-flex align-items-center mb-2 small text-secondary">
                        <i className="bi bi-check-circle-fill text-primary me-2"></i>
                        Employee Management
                      </li>
                      <li className="d-flex align-items-center mb-2 small text-secondary">
                        <i className="bi bi-check-circle-fill text-primary me-2"></i>
                        Attendance Management
                      </li>
                      <li className="d-flex align-items-center mb-2 small text-secondary">
                        <i className="bi bi-check-circle-fill text-primary me-2"></i>
                        Leave Approval
                      </li>
                      <li className="d-flex align-items-center mb-2 small text-secondary">
                        <i className="bi bi-check-circle-fill text-primary me-2"></i>
                        Reports & Analytics
                      </li>
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    <button 
                      className="btn btn-primary w-100 py-2.5 fw-bold shadow-sm"
                      onClick={() => navigate("/login?mode=manager")}
                    >
                      Manager Login
                    </button>
                  </div>

                </div>
              </div>
            </div>

            {/* CARD 2 - EMPLOYEE PORTAL */}
            <div className="col-12 col-md-6 col-lg-5">
              <div className="card h-100 border-0 shadow-sm rounded-3 hover-card transition-all bg-white">
                <div className="card-top-accent bg-primary bg-opacity-75" style={{ height: "4px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}></div>
                <div className="card-body p-4 d-flex flex-column">
                  
                  {/* Icon and Title */}
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary bg-opacity-10 text-primary rounded p-3 me-3 d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
                      <i className="bi bi-person-workspace fs-2"></i>
                    </div>
                    <div>
                      <h3 className="fw-bold text-dark mb-0">Employee Portal</h3>
                      <span className="text-muted small">Employee Workspace</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-secondary small mb-4 flex-grow-0">
                    Manage your personal profile, attendance, leave requests and notifications.
                  </p>

                  {/* Features List */}
                  <div className="mb-5 flex-grow-1">
                    <h6 className="fw-bold text-dark small mb-3">KEY FEATURES</h6>
                    <ul className="list-unstyled mb-0">
                      <li className="d-flex align-items-center mb-2 small text-secondary">
                        <i className="bi bi-check-circle-fill text-primary me-2"></i>
                        My Profile
                      </li>
                      <li className="d-flex align-items-center mb-2 small text-secondary">
                        <i className="bi bi-check-circle-fill text-primary me-2"></i>
                        Attendance
                      </li>
                      <li className="d-flex align-items-center mb-2 small text-secondary">
                        <i className="bi bi-check-circle-fill text-primary me-2"></i>
                        Leave Requests
                      </li>
                      <li className="d-flex align-items-center mb-2 small text-secondary">
                        <i className="bi bi-check-circle-fill text-primary me-2"></i>
                        Notifications
                      </li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto d-flex gap-2">
                    <button 
                      className="btn btn-primary flex-grow-1 py-2.5 fw-bold shadow-sm"
                      onClick={() => navigate("/login?mode=employee")}
                    >
                      Employee Login
                    </button>
                    <button 
                      className="btn btn-outline-primary flex-grow-1 py-2.5 fw-bold"
                      onClick={() => navigate("/login?mode=employee&register=true")}
                    >
                      Employee Register
                    </button>
                  </div>

                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Footer Block */}
      <footer className="bg-white border-top py-4 mt-auto">
        <div className="container text-center text-muted small">
          <div className="mb-1 fw-bold">© 2026 TechNova Solutions</div>
          <div className="mb-1">Human Resource Management System</div>
          <div>All Rights Reserved.</div>
        </div>
      </footer>

      {/* Embedded Clean Transition Styles */}
      <style>{`
        .hover-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.08) !important;
        }
        .transition-all {
          transition: all 0.25s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Landing;
