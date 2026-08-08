import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getDashboardStats,
  getDashboardDepartments,
  getDashboardSalaries,
  getRecentEmployees,
  getMyProfile,
  getEmployees,
  getTodayAttendanceStatus,
  getMyLeaves
} from "../services/employeeService";
import { getPayload } from "../components/ProtectedRoute";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const payload = token ? getPayload(token) : null;
  const isManager = payload?.role === "ROLE_MANAGER";

  // Manager state
  const [stats, setStats] = useState({
    totalEmployees: 0,
    departmentCount: 0,
    averageSalary: 0.0,
    highestSalary: 0.0
  });
  const [deptData, setDeptData] = useState({});
  const [salaryData, setSalaryData] = useState([]);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Employee state
  const [profile, setProfile] = useState(null);
  const [attendanceToday, setAttendanceToday] = useState(null);
  const [myLeaves, setMyLeaves] = useState([]);

  useEffect(() => {
    if (isManager) {
      // Fetch manager data
      Promise.all([
        getDashboardStats(),
        getDashboardDepartments(),
        getDashboardSalaries(),
        getRecentEmployees()
      ])
        .then(([statsRes, deptsRes, salaryRes, recentRes]) => {
          setStats(statsRes.data);
          setDeptData(deptsRes.data);
          setSalaryData(salaryRes.data);
          setRecentEmployees(recentRes.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      // Fetch employee dashboard details
      Promise.all([
        getMyProfile(),
        getTodayAttendanceStatus(),
        getMyLeaves()
      ])
        .then(([profileRes, attendanceRes, leavesRes]) => {
          setProfile(profileRes.data);
          setAttendanceToday(attendanceRes.data || null);
          setMyLeaves(leavesRes.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [isManager]);

  const handleExportCSV = () => {
    getEmployees()
      .then((response) => {
        const data = response.data;
        if (data.length === 0) {
          alert("No employees to export");
          return;
        }
        const headers = ["ID", "Name", "Email", "Salary", "Department", "Phone", "Joining Date"];
        const rows = data.map((emp) => [
          emp.id,
          `"${emp.name.replace(/"/g, '""')}"`,
          `"${emp.email.replace(/"/g, '""')}"`,
          emp.salary,
          `"${emp.department.replace(/"/g, '""')}"`,
          `"${(emp.phone || "").replace(/"/g, '""')}"`,
          `"${(emp.joiningDate || "").replace(/"/g, '""')}"`
        ]);
        const csvContent =
          "data:text/csv;charset=utf-8," +
          [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "employees.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        console.log(err);
        alert("Failed to export employees");
      });
  };

  const handleExportPDF = () => {
    window.print();
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

  // Chart data for Pie Chart
  const pieChartData = {
    labels: Object.keys(deptData),
    datasets: [
      {
        label: "Employees per Department",
        data: Object.values(deptData),
        backgroundColor: [
          "#0d6efd",
          "#198754",
          "#ffc107",
          "#dc3545",
          "#6610f2",
          "#fd7e14"
        ],
        hoverBackgroundColor: [
          "#0b5ed7",
          "#157347",
          "#ffca2c",
          "#bb2d3b",
          "#590fd4",
          "#e87012"
        ]
      }
    ]
  };

  // Chart data for Bar Chart
  const barChartData = {
    labels: salaryData.map((e) => e.name),
    datasets: [
      {
        label: "Salary ($)",
        data: salaryData.map((e) => e.salary),
        backgroundColor: "rgba(13, 110, 253, 0.6)",
        borderColor: "#0d6efd",
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="dashboard-container">
      {isManager ? (
        // MANAGER VIEW
        <div className="manager-dashboard">
          <h2 className="mb-4 fw-bold text-dark">
            <i className="bi bi-speedometer2 text-primary me-2"></i> HR Operations Dashboard
          </h2>

          {/* Stats Cards */}
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <div className="card shadow-sm border-0 border-start border-primary border-4 py-3 bg-white">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-uppercase text-muted small fw-bold">Total Employees</h6>
                    <h2 className="fw-bold mb-0 text-primary">{stats.totalEmployees}</h2>
                  </div>
                  <div className="fs-1 text-primary opacity-50">
                    <i className="bi bi-people-fill"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-0 border-start border-success border-4 py-3 bg-white">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-uppercase text-muted small fw-bold">Departments</h6>
                    <h2 className="fw-bold mb-0 text-success">{stats.departmentCount}</h2>
                  </div>
                  <div className="fs-1 text-success opacity-50">
                    <i className="bi bi-building"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-0 border-start border-warning border-4 py-3 bg-white">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-uppercase text-muted small fw-bold">Average Salary</h6>
                    <h2 className="fw-bold mb-0 text-warning">
                      ${stats.averageSalary.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </h2>
                  </div>
                  <div className="fs-1 text-warning opacity-50">
                    <i className="bi bi-cash-stack"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-0 border-start border-danger border-4 py-3 bg-white">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-uppercase text-muted small fw-bold">Highest Salary</h6>
                    <h2 className="fw-bold mb-0 text-danger">
                      ${stats.highestSalary.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </h2>
                  </div>
                  <div className="fs-1 text-danger opacity-50">
                    <i className="bi bi-trophy"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="row mb-5 g-4">
            <div className="col-md-5">
              <div className="card shadow-sm p-4 border-0 bg-white h-100">
                <h5 className="card-title fw-bold text-center mb-4">Department Distribution</h5>
                <div className="d-flex align-items-center justify-content-center" style={{ maxHeight: "300px" }}>
                  {Object.keys(deptData).length > 0 ? (
                    <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                  ) : (
                    <p className="text-muted">No data available</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-7">
              <div className="card shadow-sm p-4 border-0 bg-white h-100">
                <h5 className="card-title fw-bold text-center mb-4">Salary Distribution</h5>
                <div style={{ minHeight: "250px" }}>
                  {salaryData.length > 0 ? (
                    <Bar
                      data={barChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: (value) => "$" + value.toLocaleString()
                            }
                          }
                        }
                      }}
                    />
                  ) : (
                    <p className="text-muted text-center">No data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Lower Grid: Recent Employees & Quick Actions */}
          <div className="row g-4 mb-5">
            {/* Recent Employees */}
            <div className="col-md-8">
              <div className="card shadow-sm p-4 border-0 bg-white h-100">
                <h5 className="fw-bold mb-3">Recent Additions</h5>
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEmployees.map((emp) => (
                        <tr key={emp.id}>
                          <td>{emp.id}</td>
                          <td className="fw-bold">{emp.name}</td>
                          <td>
                            <span className="badge bg-secondary">{emp.department}</span>
                          </td>
                          <td>${emp.salary.toLocaleString()}</td>
                        </tr>
                      ))}
                      {recentEmployees.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center text-muted">
                            No employees found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="col-md-4">
              <div className="card shadow-sm p-4 h-100 border-0 bg-white">
                <h5 className="fw-bold mb-4">Quick Operations</h5>
                <div className="d-grid gap-3">
                  <button className="btn btn-outline-success py-2.5 fw-bold" onClick={handleExportCSV}>
                    📥 Export Excel (CSV)
                  </button>
                  <button className="btn btn-outline-dark py-2.5 fw-bold" onClick={handleExportPDF}>
                    📄 Export PDF / Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // EMPLOYEE VIEW (No charts, welcome card, profile details, leaf status, attendance logs, and holidays)
        <div className="employee-dashboard">
          <h2 className="mb-4 fw-bold text-dark">
            <i className="bi bi-house-door text-primary me-2"></i> Employee Home Dashboard
          </h2>

          <div className="row g-4">
            {/* Left Column: Welcome, profile details & leaves */}
            <div className="col-md-8">
              {/* Welcome Card */}
              <div className="card shadow-sm p-4 border-0 bg-white mb-4 border-start border-primary border-4">
                <h4 className="fw-bold text-dark mb-1">Welcome back, {profile?.name || "Employee"}!</h4>
                <p className="text-secondary small mb-0">You are logged in to the TechNova Solutions Employee Portal.</p>
              </div>

              {/* Profile Details Card */}
              <div className="card shadow-sm p-4 border-0 bg-white mb-4">
                <h5 className="fw-bold text-secondary mb-3">
                  <i className="bi bi-person-badge text-primary me-2"></i>My Profile Details
                </h5>
                <div className="row align-items-center">
                  <div className="col-sm-4 text-center">
                    <div
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3 shadow-inner"
                      style={{ width: "110px", height: "110px", border: "3px solid #dee2e6", overflow: "hidden" }}
                    >
                      {profile?.profilePicture ? (
                        <img src={profile.profilePicture} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                    <h5 className="fw-bold mb-0">{profile?.name || "Jane Doe"}</h5>
                    <span className="badge bg-info text-dark mb-2">{profile?.department || "Engineering"}</span>
                  </div>
                  <div className="col-sm-8">
                    <table className="table table-borderless table-sm align-middle small mb-0">
                      <tbody>
                        <tr>
                          <td className="fw-bold text-muted">Employee ID</td>
                          <td>{profile?.id || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-muted">Email</td>
                          <td>{profile?.email || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-muted">Phone</td>
                          <td>{profile?.phone || "Not specified"}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-muted">Address</td>
                          <td>{profile?.address || "Not specified"}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-muted">Joining Date</td>
                          <td>{profile?.joiningDate || "N/A"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* My Leave Requests Card */}
              <div className="card shadow-sm p-4 border-0 bg-white">
                <h5 className="fw-bold text-secondary mb-3">
                  <i className="bi bi-envelope-paper text-primary me-2"></i>My Leave Status Requests
                </h5>
                <div className="table-responsive">
                  <table className="table table-striped align-middle small mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Dates</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myLeaves.slice(0, 3).map((item) => (
                        <tr key={item.id}>
                          <td>{item.startDate} to {item.endDate}</td>
                          <td>{item.leaveType}</td>
                          <td>
                            <span
                              className={`badge ${
                                item.status === "APPROVED"
                                  ? "bg-success"
                                  : item.status === "REJECTED"
                                  ? "bg-danger"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td>{item.managerComment || "-"}</td>
                        </tr>
                      ))}
                      {myLeaves.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center text-muted">
                            No leave applications found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Attendance Status & Holidays */}
            <div className="col-md-4">
              {/* Today's Attendance Check-in State */}
              <div className="card shadow-sm p-4 border-0 bg-white text-center mb-4">
                <h5 className="fw-bold text-secondary mb-3">My Attendance Status</h5>
                <div className="fs-1 text-primary mb-3">
                  <i className="bi bi-calendar2-check-fill text-success"></i>
                </div>
                {attendanceToday ? (
                  <div className="p-3 bg-light rounded text-start mb-3">
                    <div className="mb-1 text-sm">
                      <strong>Check In:</strong> {new Date(attendanceToday.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {attendanceToday.checkOutTime ? (
                      <div className="text-sm">
                        <strong>Check Out:</strong> {new Date(attendanceToday.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    ) : (
                      <span className="badge bg-success p-1 text-sm mt-1">Checked In Today</span>
                    )}
                  </div>
                ) : (
                  <p className="text-muted mb-4 small">You have not clocked check-in today.</p>
                )}
                <Link to="/attendance" className="btn btn-primary w-100 py-2.5 fw-bold shadow-sm">
                  Go to Attendance Panel
                </Link>
              </div>

              {/* Upcoming Holidays Panel */}
              <div className="card shadow-sm p-4 border-0 bg-white">
                <h5 className="fw-bold text-secondary mb-3">
                  <i className="bi bi-calendar-event text-danger me-2"></i>Upcoming Holidays
                </h5>
                <ul className="list-group list-group-flush text-start small">
                  <li className="list-group-item px-0 py-2.5 d-flex justify-content-between align-items-center">
                    <div>
                      <strong className="text-dark">New Year's Day</strong>
                      <span className="d-block text-muted text-xs">Friday</span>
                    </div>
                    <span className="badge bg-secondary rounded-pill">Jan 1, 2026</span>
                  </li>
                  <li className="list-group-item px-0 py-2.5 d-flex justify-content-between align-items-center">
                    <div>
                      <strong className="text-dark">Good Friday</strong>
                      <span className="d-block text-muted text-xs">Friday</span>
                    </div>
                    <span className="badge bg-secondary rounded-pill">Apr 3, 2026</span>
                  </li>
                  <li className="list-group-item px-0 py-2.5 d-flex justify-content-between align-items-center">
                    <div>
                      <strong className="text-dark">Memorial Day</strong>
                      <span className="d-block text-muted text-xs">Monday</span>
                    </div>
                    <span className="badge bg-secondary rounded-pill">aug 10, 2026</span>
                  </li>
                  <li className="list-group-item px-0 py-2.5 d-flex justify-content-between align-items-center">
                    <div>
                      <strong className="text-dark">Independence Day</strong>
                      <span className="d-block text-muted text-xs">Saturday</span>
                    </div>
                    <span className="badge bg-secondary rounded-pill">aug 15, 2026</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
