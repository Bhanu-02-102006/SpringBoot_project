import { useState } from "react";

function Settings() {
  const [companyName, setCompanyName] = useState("TechNova Solutions");
  const [taxRate, setTaxRate] = useState(15);
  const [overtimeRate, setOvertimeRate] = useState(1.5);
  const [success, setSuccess] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess("Settings updated successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="settings-page" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 className="mb-4 fw-bold text-dark">
        <i className="bi bi-gear text-primary me-2"></i> Settings & Configurations
      </h2>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card shadow-sm p-4 border-0 bg-white">
        <h5 className="fw-bold text-secondary mb-4">HRMS Configurations</h5>
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label fw-bold">Company Name</label>
            <input
              type="text"
              className="form-control"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Default Tax Rate (%)</label>
              <input
                type="number"
                className="form-control"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                min="0"
                max="100"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Overtime Pay Rate multiplier</label>
              <input
                type="number"
                className="form-control"
                step="0.1"
                value={overtimeRate}
                onChange={(e) => setOvertimeRate(e.target.value)}
                min="1"
                required
              />
            </div>
          </div>

          <div className="mb-4 p-3 bg-light rounded">
            <h6 className="fw-bold text-dark mb-2">Portal Status</h6>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span>Allow employees self-registration</span>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <span>Automatic attendance tracking (IP validation)</span>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" />
              </div>
            </div>
          </div>

          <button className="btn btn-primary px-4 fw-bold shadow-sm" type="submit">
            Save System Configurations
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
