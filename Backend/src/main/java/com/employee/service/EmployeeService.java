package com.employee.service;

import com.employee.entity.Employee;
import com.employee.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import com.employee.exception.EmployeeNotFoundException;
import com.employee.dto.EmployeeDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import com.employee.exception.EmailAlreadyExistsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // Save Employee
    public Employee saveEmployee(EmployeeDTO dto) {

        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        Employee employee = new Employee();

        employee.setName(dto.getName());
        employee.setEmail(dto.getEmail());
        employee.setSalary(dto.getSalary());
        employee.setDepartment(dto.getDepartment());
        employee.setPhone(dto.getPhone());
        employee.setJoiningDate(dto.getJoiningDate());
        employee.setAddress(dto.getAddress());
        employee.setProfilePicture(dto.getProfilePicture());

        return employeeRepository.save(employee);
    }

    // Get All Employees
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Search Employee
    public List<Employee> searchEmployees(String name) {
        return employeeRepository.findByNameContainingIgnoreCase(name);
    }

    public Page<Employee> getEmployeesPage(int page, int size) {
        return employeeRepository.findAll(PageRequest.of(page, size));
    }

    public List<Employee> sortEmployees() {
        return employeeRepository.findAll(Sort.by("name").ascending());
    }

    // Get Employee By Id
    public Employee getEmployeeById(Integer id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new EmployeeNotFoundException("Employee with id " + id + " not found"));
        validateAccess(employee);
        return employee;
    }

    // Delete Employee
    public void deleteEmployee(Integer id) {
        employeeRepository.deleteById(id);
    }

    // Update Employee
    public Employee updateEmployee(Integer id, EmployeeDTO dto) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new EmployeeNotFoundException("Employee with id " + id + " not found"));
        
        validateAccess(existingEmployee);

        existingEmployee.setName(dto.getName());
        existingEmployee.setEmail(dto.getEmail());
        existingEmployee.setSalary(dto.getSalary());
        existingEmployee.setDepartment(dto.getDepartment());
        existingEmployee.setPhone(dto.getPhone());
        existingEmployee.setJoiningDate(dto.getJoiningDate());
        existingEmployee.setAddress(dto.getAddress());
        existingEmployee.setProfilePicture(dto.getProfilePicture());

        return employeeRepository.save(existingEmployee);
    }

    // Get Employee By Email
    public Employee getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email)
                .orElseThrow(() ->
                        new EmployeeNotFoundException("Employee with email " + email + " not found"));
    }

    // Validate if current user is authorized (Manager or own profile)
    private void validateAccess(Employee employee) {
        String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isManager = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_MANAGER"));

        if (!isManager && !employee.getEmail().equalsIgnoreCase(currentUser)) {
            throw new AccessDeniedException("Access denied: You can only view/update your own profile");
        }
    }

    // Update Employee profile contact info (Employee self-service)
    public Employee updateProfile(String email, EmployeeDTO dto) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee with email " + email + " not found"));
        employee.setPhone(dto.getPhone());
        employee.setAddress(dto.getAddress());
        employee.setProfilePicture(dto.getProfilePicture());
        return employeeRepository.save(employee);
    }

}