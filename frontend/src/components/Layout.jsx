import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { getPayload } from "./ProtectedRoute";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Helper to fetch unread notification count
const getUnreadNotificationCount = () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/notifications/unread-count`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem("token");
  const payload = token ? getPayload(token) : null;
  const username = payload ? payload.sub : "";
  const role = payload ? payload.role : "";
  const isManager = role === "ROLE_MANAGER";

  useEffect(() => {
    if (token) {
      updateUnreadCount();
      // Poll notifications count every 30s
      const interval = setInterval(updateUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const updateUnreadCount = () => {
    getUnreadNotificationCount()
      .then((res) => setUnreadCount(res.data))
      .catch((err) => console.log("Failed to fetch unread count", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Sidebar Links Configuration based on role
  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "bi-speedometer2", roles: ["ROLE_MANAGER", "ROLE_EMPLOYEE"] },
    { path: "/employees", label: "Employees", icon: "bi-people", roles: ["ROLE_MANAGER"] },
    { path: "/attendance", label: "Attendance", icon: "bi-calendar2-check", roles: ["ROLE_MANAGER", "ROLE_EMPLOYEE"] },
    { path: "/leaves", label: "Leaves", icon: "bi-envelope-paper", roles: ["ROLE_MANAGER", "ROLE_EMPLOYEE"] },
    { path: "/reports", label: "Reports", icon: "bi-graph-up", roles: ["ROLE_MANAGER"] },
    { path: "/profile", label: "Profile", icon: "bi-person-circle", roles: ["ROLE_MANAGER", "ROLE_EMPLOYEE"] },
    { path: "/notifications", label: "Notifications", icon: "bi-bell", roles: ["ROLE_MANAGER", "ROLE_EMPLOYEE"], badge: true },
    { path: "/settings", label: "Settings", icon: "bi-gear", roles: ["ROLE_MANAGER", "ROLE_EMPLOYEE"] },
  ];

  return (
    <div className="d-flex flex-column min-h-screen" style={{ minHeight: "100vh" }}>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm px-3">
        <div className="container-fluid">
          <button
            className="btn btn-outline-light btn-sm me-3 border-0"
            onClick={() => setCollapsed(!collapsed)}
          >
            <i className="bi bi-list fs-4"></i>
          </button>
          
          <Link className="navbar-brand fw-bold text-info d-flex align-items-center" to="/">
            <i className="bi bi-cpu-fill me-2 fs-4 text-warning"></i>
            TechNova Solutions <span className="text-white ms-2 fw-light fs-6">HR Portal</span>
          </Link>

          <div className="d-flex align-items-center ms-auto">
            {/* Notification Bell Shortcut */}
            <Link to="/notifications" className="btn btn-dark btn-sm me-3 position-relative border-0" onClick={updateUnreadCount}>
              <i className="bi bi-bell fs-5 text-light"></i>
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadCount}
                  <span className="visually-hidden">unread notifications</span>
                </span>
              )}
            </Link>

            <span className="navbar-text text-light me-3 d-none d-md-inline">
              Welcome, <strong className="text-warning">{username}</strong> ({role.replace("ROLE_", "")})
            </span>
            <button className="btn btn-outline-danger btn-sm px-3" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div
          className="bg-dark text-white border-end border-secondary transition-all"
          style={{
            width: collapsed ? "65px" : "240px",
            minWidth: collapsed ? "65px" : "240px",
            transition: "width 0.2s ease-in-out",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <ul className="nav nav-pills flex-column mb-auto py-3">
            {menuItems
              .filter((item) => item.roles.includes(role))
              .map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path} className="nav-item px-2 mb-1">
                    <Link
                      to={item.path}
                      className={`nav-link text-white d-flex align-items-center ${
                        isActive ? "bg-info text-dark fw-bold" : "hover-bg-secondary"
                      }`}
                      style={{ borderRadius: "5px", padding: "10px 15px" }}
                    >
                      <i className={`bi ${item.icon} fs-5 me-3`} style={{ minWidth: "20px" }}></i>
                      {!collapsed && (
                        <span className="d-flex align-items-center justify-content-between w-100">
                          {item.label}
                          {item.badge && unreadCount > 0 && (
                            <span className="badge rounded-pill bg-danger ms-2">{unreadCount}</span>
                          )}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
          </ul>

          <div className="p-3 border-top border-secondary text-center">
            <button className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right fs-5 me-2"></i>
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>

        {/* Main Content Pane */}
        <div className="flex-grow-1 bg-light p-4 overflow-auto" style={{ height: "calc(100vh - 56px)" }}>
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="bg-dark text-white text-center py-3 border-top border-secondary small mt-auto">
        <div className="container">
          <p className="mb-0 text-muted">&copy; 2026 TechNova Solutions. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Embedded Sidebar Styles */}
      <style>{`
        .hover-bg-secondary:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Layout;
export { getUnreadNotificationCount };
