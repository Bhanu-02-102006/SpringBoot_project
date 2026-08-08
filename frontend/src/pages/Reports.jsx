import { useEffect, useState } from "react";
import {
  getAttendanceReport,
  getLeaveReport,
  getDepartmentReport,
  getSalaryReport
} from "../services/employeeService";

function Reports() {
  const [activeTab, setActiveTab] = useState("attendance");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReport();
  }, [activeTab]);

  const loadReport = () => {
    setLoading(true);
    setError("");
    let fetchPromise;

    switch (activeTab) {
      case "attendance":
        fetchPromise = getAttendanceReport();
        break;
      case "leaves":
        fetchPromise = getLeaveReport();
        break;
      case "departments":
        fetchPromise = getDepartmentReport();
        break;
      case "salary":
        fetchPromise = getSalaryReport();
        break;
      default:
        setLoading(false);
        return;
    }

    fetchPromise
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to fetch report data.");
        setLoading(false);
      });
  };

  const handleExportCSV = () => {
    if (data.length === 0) {
      alert("No data available to export.");
      return;
    }

    let headers = [];
    let rows = [];

    if (activeTab === "attendance") {
      headers = ["Employee Name", "Email", "Total Active Days", "Presents", "Lates", "Attendance Rate"];
      rows = data.map((item) => [
        `"${item.name}"`,
        `"${item.email}"`,
        item.totalDays,
        item.presentCount,
        item.lateCount,
        `${item.attendanceRate.toFixed(1)}%`
      ]);
    } else if (activeTab === "leaves") {
      headers = ["Employee Name", "Email", "Total Applications", "Pending", "Approved", "Rejected"];
      rows = data.map((item) => [
        `"${item.name}"`,
        `"${item.email}"`,
        item.totalRequests,
        item.pendingCount,
        item.approvedCount,
        item.rejectedCount
      ]);
    } else if (activeTab === "departments") {
      headers = ["Department", "Employees Count", "Avg Salary", "Highest Salary", "Total Monthly Payroll"];
      rows = data.map((item) => [
        `"${item.department}"`,
        item.employeeCount,
        `$${item.averageSalary.toFixed(2)}`,
        `$${item.highestSalary.toFixed(2)}`,
        `$${item.totalPayroll.toFixed(2)}`
      ]);
    } else if (activeTab === "salary") {
      headers = ["Employee Name", "Department", "Gross Base Salary", "Est Tax (15%)", "Net Salary Pay"];
      rows = data.map((item) => [
        `"${item.name}"`,
        `"${item.department}"`,
        `$${item.grossSalary.toFixed(2)}`,
        `$${item.tax.toFixed(2)}`,
        `$${item.netSalary.toFixed(2)}`
      ]);
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports-page">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">
          <i className="bi bi-graph-up text-primary me-2"></i> Reports & Analytics
        </h2>
        <div className="d-flex gap-2 mt-2 mt-md-0">
          <button className="btn btn-outline-success fw-bold" onClick={handleExportCSV}>
            <i className="bi bi-file-earmark-excel me-1"></i> Export Excel (CSV)
          </button>
          <button className="btn btn-outline-dark fw-bold" onClick={handlePrint}>
            <i className="bi bi-printer me-1"></i> Print / Save PDF
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Tabs Menu */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${activeTab === "attendance" ? "active text-primary" : "text-secondary"}`}
            onClick={() => setActiveTab("attendance")}
          >
            Monthly Attendance
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${activeTab === "leaves" ? "active text-primary" : "text-secondary"}`}
            onClick={() => setActiveTab("leaves")}
          >
            Leave Summary
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${activeTab === "departments" ? "active text-primary" : "text-secondary"}`}
            onClick={() => setActiveTab("departments")}
          >
            Department Summary
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${activeTab === "salary" ? "active text-primary" : "text-secondary"}`}
            onClick={() => setActiveTab("salary")}
          >
            Salary / Payroll Report
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm p-4 border-0 bg-white">
          <div className="table-responsive" id="print-area">
            {activeTab === "attendance" && (
              <table className="table table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Employee Name</th>
                    <th>Email</th>
                    <th>Total Days Logs</th>
                    <th>Presents</th>
                    <th>Lates</th>
                    <th>Attendance Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => (
                    <tr key={idx}>
                      <td className="fw-bold">{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.totalDays}</td>
                      <td className="text-success">{item.presentCount}</td>
                      <td className="text-warning">{item.lateCount}</td>
                      <td>
                        <strong className="text-primary">{item.attendanceRate.toFixed(1)}%</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "leaves" && (
              <table className="table table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Employee Name</th>
                    <th>Email</th>
                    <th>Total Requests</th>
                    <th>Pending Requests</th>
                    <th>Approved Requests</th>
                    <th>Rejected Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => (
                    <tr key={idx}>
                      <td className="fw-bold">{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.totalRequests}</td>
                      <td className="text-warning">{item.pendingCount}</td>
                      <td className="text-success">{item.approvedCount}</td>
                      <td className="text-danger">{item.rejectedCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "departments" && (
              <table className="table table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Department</th>
                    <th>Employees</th>
                    <th>Avg Salary</th>
                    <th>Highest Salary</th>
                    <th>Total Payroll</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => (
                    <tr key={idx}>
                      <td className="fw-bold">{item.department}</td>
                      <td>{item.employeeCount}</td>
                      <td>${item.averageSalary.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      <td>${item.highestSalary.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      <td className="fw-bold text-success">${item.totalPayroll.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "salary" && (
              <table className="table table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Gross Base Salary</th>
                    <th>Est. Tax (15%)</th>
                    <th>Estimated Net Pay</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => (
                    <tr key={idx}>
                      <td className="fw-bold">{item.name}</td>
                      <td>{item.department}</td>
                      <td>${item.grossSalary.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      <td className="text-danger">-${item.tax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      <td className="fw-bold text-success">${item.netSalary.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
