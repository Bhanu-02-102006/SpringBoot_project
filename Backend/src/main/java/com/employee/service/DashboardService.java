package com.employee.service;

import com.employee.entity.Employee;
import com.employee.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final EmployeeRepository employeeRepository;

    public DashboardService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalEmployees = employeeRepository.count();
        long departmentCount = employeeRepository.countDistinctDepartments();
        Double avgSalary = employeeRepository.getAverageSalary();
        Double maxSalary = employeeRepository.getHighestSalary();

        stats.put("totalEmployees", totalEmployees);
        stats.put("departmentCount", departmentCount);
        stats.put("averageSalary", avgSalary != null ? avgSalary : 0.0);
        stats.put("highestSalary", maxSalary != null ? maxSalary : 0.0);

        return stats;
    }

    public Map<String, Long> getDepartmentStats() {
        List<Object[]> rawStats = employeeRepository.getDepartmentCountGrouped();
        Map<String, Long> deptStats = new HashMap<>();
        for (Object[] row : rawStats) {
            String dept = (String) row[0];
            Long count = (Long) row[1];
            deptStats.put(dept, count);
        }
        return deptStats;
    }

    public List<Map<String, Object>> getSalaries() {
        List<Employee> employees = employeeRepository.findAll();
        List<Map<String, Object>> salaryList = new ArrayList<>();
        for (Employee e : employees) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", e.getName());
            map.put("salary", e.getSalary());
            salaryList.add(map);
        }
        return salaryList;
    }

    public List<Employee> getRecentEmployees() {
        return employeeRepository.findTop5ByOrderByIdDesc();
    }
}
