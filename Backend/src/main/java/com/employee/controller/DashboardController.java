package com.employee.controller;

import com.employee.entity.Employee;
import com.employee.service.DashboardService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return dashboardService.getStats();
    }

    @GetMapping("/departments")
    public Map<String, Long> getDepartments() {
        return dashboardService.getDepartmentStats();
    }

    @GetMapping("/salary")
    public List<Map<String, Object>> getSalary() {
        return dashboardService.getSalaries();
    }

    @GetMapping("/recent")
    public List<Employee> getRecent() {
        return dashboardService.getRecentEmployees();
    }
}
