import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getEmployeesPage,
  deleteEmployee,
  searchEmployee,
} from "../services/employeeService";

function Home() {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadEmployees();
  }, [page]);

  const loadEmployees = () => {
    getEmployeesPage(page, 5)
      .then((response) => {
        setEmployees(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this employee?")) {
      deleteEmployee(id)
        .then(() => {
          loadEmployees();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      loadEmployees();
    } else {
      searchEmployee(value)
        .then((response) => {
          setEmployees(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="employee-directory">
      <h2 className="mb-4 fw-bold text-dark">
        <i className="bi bi-people text-primary me-2"></i> TechNova Solutions - Employee Directory
      </h2>

      <div className="card shadow-sm p-4 border-0 bg-white">
        <div className="d-flex flex-wrap justify-content-end align-items-center mb-3">
          <div className="col-md-4 mt-2 mt-md-0">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Salary</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td className="fw-bold">{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>${employee.salary.toLocaleString()}</td>
                    <td>
                      <span className="badge bg-secondary">{employee.department}</span>
                    </td>
                    <td>
                      <Link
                        to={`/edit/${employee.id}`}
                        className="btn btn-warning btn-sm me-2 fw-bold"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm fw-bold"
                        onClick={() => handleDelete(employee.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-3">
                    No employee profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-3">
            <button
              className="btn btn-secondary me-3"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>

            <span>
              Page {page + 1} of {totalPages}
            </span>

            <button
              className="btn btn-secondary ms-3"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
