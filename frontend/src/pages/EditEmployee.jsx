import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployeeById, updateEmployee } from "../services/employeeService";

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    salary: "",
    department: "",
    phone: "",
    joiningDate: "",
    address: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    getEmployeeById(id)
      .then((response) => {
        const data = response.data;
        setEmployee({
          name: data.name || "",
          email: data.email || "",
          salary: data.salary || "",
          department: data.department || "",
          phone: data.phone || "",
          joiningDate: data.joiningDate || "",
          address: data.address || ""
        });
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to fetch employee details.");
      });
  }, [id]);

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateEmployee(id, employee)
      .then(() => {
        navigate("/employees");
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to update employee details.");
      });
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <div className="card shadow-sm p-4 border-0 bg-white">
        <h2 className="text-center mb-4 fw-bold text-dark">Edit Employee Details</h2>

        {error && <div className="alert alert-danger mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={employee.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={employee.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Salary</label>
            <input
              type="number"
              className="form-control"
              name="salary"
              value={employee.salary}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Department</label>
            <input
              type="text"
              className="form-control"
              name="department"
              value={employee.department}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={employee.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <textarea
              className="form-control"
              name="address"
              value={employee.address}
              onChange={handleChange}
              placeholder="Enter physical address..."
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Joining Date</label>
            <input
              type="date"
              className="form-control"
              name="joiningDate"
              value={employee.joiningDate}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-primary w-100 py-2 fw-bold mt-2">
            Update Employee
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditEmployee;