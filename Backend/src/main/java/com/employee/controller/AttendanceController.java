package com.employee.controller;

import com.employee.entity.Attendance;
import com.employee.service.AttendanceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/checkin")
    public Attendance checkIn(java.security.Principal principal) {
        return attendanceService.checkIn(principal.getName());
    }

    @PostMapping("/checkout")
    public Attendance checkOut(java.security.Principal principal) {
        return attendanceService.checkOut(principal.getName());
    }

    @GetMapping("/my-history")
    public List<Attendance> getMyHistory(java.security.Principal principal) {
        return attendanceService.getMyHistory(principal.getName());
    }

    @GetMapping("/today")
    public Optional<Attendance> getTodayStatus(java.security.Principal principal) {
        return attendanceService.getTodayStatus(principal.getName());
    }

    @GetMapping("/all")
    public List<Attendance> getAllAttendance() {
        return attendanceService.getAllAttendance();
    }

    @GetMapping("/search")
    public List<Attendance> searchAttendance(@RequestParam(required = false) String query) {
        return attendanceService.searchAttendance(query);
    }
}
