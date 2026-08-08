package com.employee.service;

import com.employee.entity.Attendance;
import com.employee.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final NotificationService notificationService;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             NotificationService notificationService) {
        this.attendanceRepository = attendanceRepository;
        this.notificationService = notificationService;
    }

    public Attendance checkIn(String email) {
        LocalDate today = LocalDate.now();
        Optional<Attendance> existing = attendanceRepository.findByEmployeeEmailAndDate(email, today);
        if (existing.isPresent()) {
            return existing.get();
        }

        Attendance attendance = new Attendance();
        attendance.setEmployeeEmail(email);
        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setDate(today);

        // Mark LATE if check-in is after 09:00 AM
        if (LocalTime.now().isAfter(LocalTime.of(9, 0))) {
            attendance.setStatus("LATE");
        } else {
            attendance.setStatus("PRESENT");
        }

        Attendance saved = attendanceRepository.save(attendance);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");
        notificationService.createNotification(
                email, 
                "Attendance Recorded: Checked in today at " + saved.getCheckInTime().format(formatter) + " (Status: " + saved.getStatus() + ")"
        );
        return saved;
    }

    public Attendance checkOut(String email) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeEmailAndDate(email, today)
                .orElseThrow(() -> new RuntimeException("You must check in first before checking out today."));

        if (attendance.getCheckOutTime() != null) {
            return attendance;
        }

        attendance.setCheckOutTime(LocalDateTime.now());
        Attendance saved = attendanceRepository.save(attendance);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");
        notificationService.createNotification(
                email, 
                "Attendance Recorded: Checked out today at " + saved.getCheckOutTime().format(formatter)
        );
        return saved;
    }

    public List<Attendance> getMyHistory(String email) {
        return attendanceRepository.findByEmployeeEmailOrderByDateDesc(email);
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAllByOrderByDateDescCheckInTimeDesc();
    }

    public List<Attendance> searchAttendance(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllAttendance();
        }
        return attendanceRepository.findByEmployeeEmailContainingIgnoreCaseOrStatusContainingIgnoreCaseOrderByDateDesc(query, query);
    }

    public Optional<Attendance> getTodayStatus(String email) {
        return attendanceRepository.findByEmployeeEmailAndDate(email, LocalDate.now());
    }
}
