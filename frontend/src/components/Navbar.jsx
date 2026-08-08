import { useNavigate, Link, useLocation } from "react-router-dom";
import { getPayload } from "./ProtectedRoute";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const payload = token ? getPayload(token) : null;
  const username = payload ? payload.sub : "";
  const role = payload ? payload.role : "";
  const isManager = role === "ROLE_MANAGER";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold text-info me-4" to="/">
          EMS Portal
        </Link>
        {token && (
          <>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                    to="/"
                  >
                    Dashboard
                  </Link>
                </li>
                {isManager && (
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${location.pathname === "/employees" ? "active" : ""}`}
                      to="/employees"
                    >
                      Employees
                    </Link>
                  </li>
                )}
              </ul>
              <div className="d-flex align-items-center ms-auto">
                <span className="navbar-text me-3 text-light">
                  Welcome, <strong className="text-warning">{username}</strong> ({role.replace("ROLE_", "")})
                </span>
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
