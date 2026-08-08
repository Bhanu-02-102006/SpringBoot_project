package com.employee.repository;

import com.employee.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {

    List<Attendance> findByEmployeeEmailOrderByDateDesc(String employeeEmail);

    Optional<Attendance> findByEmployeeEmailAndDate(String employeeEmail, LocalDate date);

    List<Attendance> findByDateOrderByCheckInTimeDesc(LocalDate date);

    List<Attendance> findByEmployeeEmailContainingIgnoreCaseOrStatusContainingIgnoreCaseOrderByDateDesc(String email, String status);

    List<Attendance> findAllByOrderByDateDescCheckInTimeDesc();
}
