package com.employee.controller;

import com.employee.dto.EmployeeDTO;
import com.employee.entity.Employee;
import com.employee.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // Create Employee
    @PostMapping
    public Employee addEmployee(@Valid @RequestBody EmployeeDTO employeeDTO) {
        return employeeService.saveEmployee(employeeDTO);
    }

    // Get All Employees
    @GetMapping
    public List<Employee> getEmployees() {
        return employeeService.getAllEmployees();
    }

    // Search Employee
    @GetMapping("/search")
    public List<Employee> searchEmployees(@RequestParam String name) {
        return employeeService.searchEmployees(name);
    }

    // Get Employee By Id
    @GetMapping("/{id}")
    public Employee getEmployee(@PathVariable Integer id) {
        return employeeService.getEmployeeById(id);
    }

    // Get Logged-in Employee Profile
    @GetMapping("/me")
    public Employee getMyProfile(java.security.Principal principal) {
        return employeeService.getEmployeeByEmail(principal.getName());
    }

    // Update own profile contact info
    @PutMapping("/me/profile")
    public Employee updateMyProfile(java.security.Principal principal,
                                    @RequestBody EmployeeDTO employeeDTO) {
        return employeeService.updateProfile(principal.getName(), employeeDTO);
    }

    @GetMapping("/page")
    public Page<Employee> getEmployeesPage(
            @RequestParam int page,
            @RequestParam int size) {

        return employeeService.getEmployeesPage(page, size);
    }

    @GetMapping("/sort")
    public List<Employee> sortEmployees() {
        return employeeService.sortEmployees();
    }

    // Update Employee
    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable Integer id,
                                   @Valid @RequestBody EmployeeDTO employeeDTO) {
        return employeeService.updateEmployee(id, employeeDTO);
    }

    // Delete Employee
    @DeleteMapping("/{id}")
    public String deleteEmployee(@PathVariable Integer id) {
        employeeService.deleteEmployee(id);
        return "Employee Deleted Successfully";
    }
}