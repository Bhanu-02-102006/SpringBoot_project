package com.employee.repository;

import com.employee.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Integer> {

    List<LeaveRequest> findByEmployeeEmailOrderByIdDesc(String employeeEmail);

    List<LeaveRequest> findByStatusOrderByIdDesc(String status);

    List<LeaveRequest> findAllByOrderByIdDesc();
}
