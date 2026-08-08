package com.employee.repository;

import com.employee.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    List<Notification> findByEmployeeEmailOrderByTimestampDesc(String employeeEmail);

    long countByEmployeeEmailAndIsReadFalse(String employeeEmail);
}
