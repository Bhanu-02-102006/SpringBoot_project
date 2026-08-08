package com.employee.service;

import com.employee.entity.LeaveRequest;
import com.employee.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final NotificationService notificationService;

    public LeaveService(LeaveRequestRepository leaveRequestRepository,
                        NotificationService notificationService) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.notificationService = notificationService;
    }

    public LeaveRequest applyLeave(String email, LeaveRequest request) {
        request.setEmployeeEmail(email);
        request.setStatus("PENDING");
        LeaveRequest saved = leaveRequestRepository.save(request);
        notificationService.createNotification(
                email, 
                "Your Leave Request (" + saved.getLeaveType() + ") from " + saved.getStartDate() + " to " + saved.getEndDate() + " has been submitted. Status: PENDING"
        );
        return saved;
    }

    public List<LeaveRequest> getMyRequests(String email) {
        return leaveRequestRepository.findByEmployeeEmailOrderByIdDesc(email);
    }

    public List<LeaveRequest> getPendingRequests() {
        return leaveRequestRepository.findByStatusOrderByIdDesc("PENDING");
    }

    public List<LeaveRequest> getAllRequests() {
        return leaveRequestRepository.findAllByOrderByIdDesc();
    }

    public LeaveRequest updateStatus(Integer id, String status, String comment) {
        LeaveRequest request = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave Request not found"));

        request.setStatus(status); // APPROVED, REJECTED
        request.setManagerComment(comment);
        LeaveRequest saved = leaveRequestRepository.save(request);

        String message = "Your Leave Request from " + saved.getStartDate() + " to " + saved.getEndDate() + 
                " was " + saved.getStatus().toUpperCase() + ".";
        if (comment != null && !comment.trim().isEmpty()) {
            message += " Manager Comment: " + comment;
        }

        notificationService.createNotification(saved.getEmployeeEmail(), message);
        return saved;
    }
}
