import { Link } from "react-router-dom";
import { deleteEmployee } from "../services/employeeService";

function EmployeeTable({ employees, fetchEmployees }) {

    const handleDelete = async (id) => {
        if (window.confirm("Delete this employee?")) {
            await deleteEmployee(id);
            fetchEmployees();
        }
    };

    return (
        <table className="table table-bordered table-hover">
            <thead className="table-dark">
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
                {employees.map((employee) => (
                    <tr key={employee.id}>
                        <td>{employee.id}</td>
                        <td>{employee.name}</td>
                        <td>{employee.email}</td>
                        <td>{employee.salary}</td>
                        <td>{employee.department}</td>

                        <td>
                            <Link
                                to={`/edit/${employee.id}`}
                                className="btn btn-warning btn-sm me-2"
                            >
                                Edit
                            </Link>

                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(employee.id)}
                            >
                                Delete
                            </button>
                        </td>

                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default EmployeeTable;