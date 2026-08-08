import { useEffect, useState } from "react";
import {
  checkInAttendance,
  checkOutAttendance,
  getTodayAttendanceStatus,
  getMyAttendanceHistory,
  getAllAttendanceHistory,
  searchAttendanceHistory
} from "../services/employeeService";
import { getPayload } from "../components/ProtectedRoute";

function Attendance() {
  const token = localStorage.getItem("token");
  const payload = token ? getPayload(token) : null;
  const isManager = payload?.role === "ROLE_MANAGER";

  const [todayStatus, setTodayStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setError("");
    if (isManager) {
      // Load all attendance for managers
      getAllAttendanceHistory()
        .then((res) => {
          setHistory(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError("Failed to load attendance records.");
          setLoading(false);
        });
    } else {
      // Load employee today status and history
      Promise.all([getTodayAttendanceStatus(), getMyAttendanceHistory()])
        .then(([todayRes, historyRes]) => {
          setTodayStatus(todayRes.data || null);
          setHistory(historyRes.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError("Failed to load attendance details.");
          setLoading(false);
        });
    }
  };

  const handleCheckIn = () => {
    setError("");
    setSuccess("");
    checkInAttendance()
      .then((res) => {
        setSuccess("Successfully checked in for today!");
        setTodayStatus(res.data);
        loadData();
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to check in.");
      });
  };

  const handleCheckOut = () => {
    setError("");
    setSuccess("");
    checkOutAttendance()
      .then((res) => {
        setSuccess("Successfully checked out for today!");
        setTodayStatus(res.data);
        loadData();
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to check out.");
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError("");
    searchAttendanceHistory(searchQuery)
      .then((res) => {
        setHistory(res.data);
      })
      .catch((err) => {
        console.log(err);
        setError("Search failed.");
      });
  };

  const formatTime = (dateTimeStr) => {
    if (!dateTimeStr) return "-";
    try {
      const d = new Date(dateTimeStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) {
      return dateTimeStr;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
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
    <div className="attendance-page">
      <h2 className="mb-4 fw-bold text-dark">
        <i className="bi bi-calendar2-check text-primary me-2"></i> Attendance Module
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!isManager ? (
        // EMPLOYEE LAYOUT
        <div className="row g-4">
          {/* Punch Card Panel */}
          <div className="col-md-4">
            <div className="card shadow-sm p-4 text-center border-0 bg-white">
              <h5 className="fw-bold text-secondary mb-3">Check-In / Check-Out</h5>
              <div className="fs-1 text-primary mb-3">
                <i className="bi bi-clock-history"></i>
              </div>
              
              <div className="mb-4">
                {todayStatus ? (
                  todayStatus.checkOutTime ? (
                    <span className="badge bg-secondary p-2 fs-6">Shift Completed Today</span>
                  ) : (
                    <span className="badge bg-success p-2 fs-6">Currently Checked In</span>
                  )
                ) : (
                  <span className="badge bg-warning text-dark p-2 fs-6">Not Checked In Today</span>
                )}
              </div>

              {todayStatus && (
                <div className="text-start bg-light p-3 rounded mb-4 text-sm">
                  <div className="mb-2">
                    <strong>Check In:</strong> {formatTime(todayStatus.checkInTime)}
                  </div>
                  <div>
                    <strong>Check Out:</strong> {formatTime(todayStatus.checkOutTime)}
                  </div>
                  {todayStatus.status && (
                    <div className="mt-2">
                      <strong>Status: </strong> 
                      <span className={`badge ${todayStatus.status === "LATE" ? "bg-warning text-dark" : "bg-success"}`}>
                        {todayStatus.status}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="d-grid gap-3">
                <button
                  className="btn btn-primary btn-lg fw-bold shadow-sm"
                  disabled={todayStatus !== null}
                  onClick={handleCheckIn}
                >
                  📥 Check In
                </button>
                <button
                  className="btn btn-outline-danger btn-lg fw-bold"
                  disabled={!todayStatus || todayStatus.checkOutTime !== null}
                  onClick={handleCheckOut}
                >
                  📤 Check Out
                </button>
              </div>
            </div>
          </div>

          {/* History Panel */}
          <div className="col-md-8">
            <div className="card shadow-sm p-4 border-0 bg-white h-100">
              <h5 className="fw-bold text-secondary mb-3">My Attendance Logs</h5>
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record) => (
                      <tr key={record.id}>
                        <td>{formatDate(record.date)}</td>
                        <td className="text-success fw-bold">{formatTime(record.checkInTime)}</td>
                        <td className="text-danger fw-bold">{formatTime(record.checkOutTime)}</td>
                        <td>
                          <span className={`badge ${record.status === "LATE" ? "bg-warning text-dark" : "bg-success"}`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {history.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          No attendance records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // MANAGER LAYOUT
        <div className="card shadow-sm p-4 border-0 bg-white">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-secondary mb-0">Company Attendance Logs</h5>
            <form onSubmit={handleSearch} className="d-flex col-md-4 mt-2 mt-md-0">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search by email or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </form>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Employee Email</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id}>
                    <td>{formatDate(record.date)}</td>
                    <td className="fw-bold">{record.employeeEmail}</td>
                    <td className="text-success fw-bold">{formatTime(record.checkInTime)}</td>
                    <td className="text-danger fw-bold">{formatTime(record.checkOutTime)}</td>
                    <td>
                      <span className={`badge ${record.status === "LATE" ? "bg-warning text-dark" : "bg-success"}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted col-span-5">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
