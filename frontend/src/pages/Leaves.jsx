import { useEffect, useState } from "react";
import {
  applyLeave,
  getMyLeaves,
  getPendingLeaves,
  getAllLeaves,
  updateLeaveStatus
} from "../services/employeeService";
import { getPayload } from "../components/ProtectedRoute";

function Leaves() {
  const token = localStorage.getItem("token");
  const payload = token ? getPayload(token) : null;
  const role = payload ? payload.role : "";
  const isManager = role === "ROLE_MANAGER";

  // Employee states
  const [newRequest, setNewRequest] = useState({
    startDate: "",
    endDate: "",
    leaveType: "CASUAL",
    reason: ""
  });
  const [myHistory, setMyHistory] = useState([]);

  // Manager states
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allHistory, setAllHistory] = useState([]);
  const [comments, setComments] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setError("");
    setSuccess("");
    if (isManager) {
      // Fetch data for manager
      Promise.all([getPendingLeaves(), getAllLeaves()])
        .then(([pendingRes, allRes]) => {
          setPendingRequests(pendingRes.data);
          setAllHistory(allRes.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError("Failed to load leave requests.");
          setLoading(false);
        });
    } else {
      // Fetch own leave requests
      getMyLeaves()
        .then((res) => {
          setMyHistory(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError("Failed to load my leave history.");
          setLoading(false);
        });
    }
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    applyLeave(newRequest)
      .then(() => {
        setSuccess("Leave request submitted successfully!");
        setNewRequest({
          startDate: "",
          endDate: "",
          leaveType: "CASUAL",
          reason: ""
        });
        loadData();
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to submit leave request.");
      });
  };

  const handleAction = (id, status) => {
    setError("");
    setSuccess("");
    const comment = comments[id] || "";
    updateLeaveStatus(id, status, comment)
      .then(() => {
        setSuccess(`Leave request was successfully ${status.toLowerCase()}!`);
        // Remove comment from state
        const newComments = { ...comments };
        delete newComments[id];
        setComments(newComments);
        loadData();
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to process leave request.");
      });
  };

  const handleCommentChange = (id, val) => {
    setComments({
      ...comments,
      [id]: val
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-success";
      case "REJECTED":
        return "bg-danger";
      default:
        return "bg-warning text-dark";
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
    <div className="leaves-page">
      <h2 className="mb-4 fw-bold text-dark">
        <i className="bi bi-envelope-paper text-primary me-2"></i> Leave Management
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!isManager ? (
        // EMPLOYEE LAYOUT
        <div className="row g-4">
          {/* Apply Form */}
          <div className="col-md-5">
            <div className="card shadow-sm p-4 border-0 bg-white">
              <h5 className="fw-bold text-secondary mb-3">Request Time Off</h5>
              <form onSubmit={handleApplyLeave}>
                <div className="mb-3">
                  <label className="form-label">Leave Type</label>
                  <select
                    className="form-select"
                    value={newRequest.leaveType}
                    onChange={(e) => setNewRequest({ ...newRequest, leaveType: e.target.value })}
                  >
                    <option value="CASUAL">Casual Leave</option>
                    <option value="SICK">Sick Leave</option>
                    <option value="VACATION">Vacation / Earned Leave</option>
                  </select>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newRequest.startDate}
                      onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newRequest.endDate}
                      onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Reason</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter reason details..."
                    value={newRequest.reason}
                    onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                    required
                  ></textarea>
                </div>

                <button className="btn btn-primary w-100 py-2 fw-bold" type="submit">
                  Submit Application
                </button>
              </form>
            </div>
          </div>

          {/* History */}
          <div className="col-md-7">
            <div className="card shadow-sm p-4 border-0 bg-white h-100">
              <h5 className="fw-bold text-secondary mb-3">My Applications</h5>
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Dates</th>
                      <th>Type</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myHistory.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <small>
                            {item.startDate} to {item.endDate}
                          </small>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{item.leaveType}</span>
                        </td>
                        <td>{item.reason}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(item.status)}`}>{item.status}</span>
                        </td>
                        <td>
                          <small className="text-muted">{item.managerComment || "-"}</small>
                        </td>
                      </tr>
                    ))}
                    {myHistory.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          No leave applications found.
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
        <div className="row g-4">
          {/* Pending Applications */}
          <div className="col-12">
            <div className="card shadow-sm p-4 border-0 bg-white mb-4">
              <h5 className="fw-bold text-warning mb-3">
                <i className="bi bi-hourglass-split"></i> Pending Applications
              </h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Employee</th>
                      <th>Dates</th>
                      <th>Type</th>
                      <th>Reason</th>
                      <th>Manager Comment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((item) => (
                      <tr key={item.id}>
                        <td className="fw-bold">{item.employeeEmail}</td>
                        <td>
                          <small>
                            {item.startDate} to {item.endDate}
                          </small>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{item.leaveType}</span>
                        </td>
                        <td>{item.reason}</td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Add reason for approval/rejection..."
                            value={comments[item.id] || ""}
                            onChange={(e) => handleCommentChange(item.id, e.target.value)}
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-success btn-sm me-2 fw-bold"
                            onClick={() => handleAction(item.id, "APPROVED")}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm fw-bold"
                            onClick={() => handleAction(item.id, "REJECTED")}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pendingRequests.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-3">
                          No pending applications.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* History Logs */}
            <div className="card shadow-sm p-4 border-0 bg-white">
              <h5 className="fw-bold text-secondary mb-3">All Leave Applications Logs</h5>
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Employee</th>
                      <th>Dates</th>
                      <th>Type</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allHistory.map((item) => (
                      <tr key={item.id}>
                        <td className="fw-bold">{item.employeeEmail}</td>
                        <td>
                          <small>
                            {item.startDate} to {item.endDate}
                          </small>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{item.leaveType}</span>
                        </td>
                        <td>{item.reason}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(item.status)}`}>{item.status}</span>
                        </td>
                        <td>
                          <small className="text-muted">{item.managerComment || "-"}</small>
                        </td>
                      </tr>
                    ))}
                    {allHistory.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          No historical logs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaves;
