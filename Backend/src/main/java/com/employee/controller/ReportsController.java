package com.employee.controller;

import com.employee.entity.Attendance;
import com.employee.entity.Employee;
import com.employee.entity.LeaveRequest;
import com.employee.repository.AttendanceRepository;
import com.employee.repository.EmployeeRepository;
import com.employee.repository.LeaveRequestRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "*")
public class ReportsController {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public ReportsController(EmployeeRepository employeeRepository,
                             AttendanceRepository attendanceRepository,
                             LeaveRequestRepository leaveRequestRepository) {
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
    }

    @GetMapping("/attendance")
    public List<Map<String, Object>> getAttendanceReport() {
        List<Employee> employees = employeeRepository.findAll();
        List<Map<String, Object>> reportList = new ArrayList<>();

        for (Employee emp : employees) {
            List<Attendance> history = attendanceRepository.findByEmployeeEmailOrderByDateDesc(emp.getEmail());
            long presentCount = history.stream().filter(a -> a.getStatus().equalsIgnoreCase("PRESENT")).count();
            long lateCount = history.stream().filter(a -> a.getStatus().equalsIgnoreCase("LATE")).count();
            long totalDays = history.size();

            Map<String, Object> map = new HashMap<>();
            map.put("name", emp.getName());
            map.put("email", emp.getEmail());
            map.put("totalDays", totalDays);
            map.put("presentCount", presentCount);
            map.put("lateCount", lateCount);
            map.put("attendanceRate", totalDays > 0 ? (double) (presentCount + lateCount) / totalDays * 100 : 0.0);
            reportList.add(map);
        }
        return reportList;
    }

    @GetMapping("/leaves")
    public List<Map<String, Object>> getLeaveReport() {
        List<Employee> employees = employeeRepository.findAll();
        List<Map<String, Object>> reportList = new ArrayList<>();

        for (Employee emp : employees) {
            List<LeaveRequest> requests = leaveRequestRepository.findByEmployeeEmailOrderByIdDesc(emp.getEmail());
            long pending = requests.stream().filter(r -> r.getStatus().equalsIgnoreCase("PENDING")).count();
            long approved = requests.stream().filter(r -> r.getStatus().equalsIgnoreCase("APPROVED")).count();
            long rejected = requests.stream().filter(r -> r.getStatus().equalsIgnoreCase("REJECTED")).count();

            Map<String, Object> map = new HashMap<>();
            map.put("name", emp.getName());
            map.put("email", emp.getEmail());
            map.put("totalRequests", requests.size());
            map.put("pendingCount", pending);
            map.put("approvedCount", approved);
            map.put("rejectedCount", rejected);
            reportList.add(map);
        }
        return reportList;
    }

    @GetMapping("/departments")
    public List<Map<String, Object>> getDepartmentReport() {
        List<Object[]> grouped = employeeRepository.getDepartmentCountGrouped();
        List<Map<String, Object>> reportList = new ArrayList<>();

        for (Object[] row : grouped) {
            String dept = (String) row[0];
            Long count = (Long) row[1];

            List<Employee> employees = employeeRepository.findAll();
            double totalSalary = 0;
            double maxSalary = 0;
            long empCount = 0;

            for (Employee emp : employees) {
                if (emp.getDepartment().equalsIgnoreCase(dept)) {
                    totalSalary += emp.getSalary();
                    empCount++;
                    if (emp.getSalary() > maxSalary) {
                        maxSalary = emp.getSalary();
                    }
                }
            }

            Map<String, Object> map = new HashMap<>();
            map.put("department", dept);
            map.put("employeeCount", empCount);
            map.put("averageSalary", empCount > 0 ? totalSalary / empCount : 0.0);
            map.put("highestSalary", maxSalary);
            map.put("totalPayroll", totalSalary);
            reportList.add(map);
        }
        return reportList;
    }

    @GetMapping("/salary")
    public List<Map<String, Object>> getSalaryReport() {
        List<Employee> employees = employeeRepository.findAll();
        List<Map<String, Object>> reportList = new ArrayList<>();

        for (Employee emp : employees) {
            double salary = emp.getSalary();
            double tax = salary * 0.15; // 15% estimated tax
            double netPay = salary - tax;

            Map<String, Object> map = new HashMap<>();
            map.put("name", emp.getName());
            map.put("department", emp.getDepartment());
            map.put("grossSalary", salary);
            map.put("tax", tax);
            map.put("netSalary", netPay);
            reportList.add(map);
        }
        return reportList;
    }
}
