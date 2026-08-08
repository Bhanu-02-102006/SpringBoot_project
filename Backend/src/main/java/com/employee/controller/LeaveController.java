package com.employee.controller;

import com.employee.entity.LeaveRequest;
import com.employee.service.LeaveService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping
    public LeaveRequest applyLeave(java.security.Principal principal,
                                   @RequestBody LeaveRequest request) {
        return leaveService.applyLeave(principal.getName(), request);
    }

    @GetMapping("/my-requests")
    public List<LeaveRequest> getMyRequests(java.security.Principal principal) {
        return leaveService.getMyRequests(principal.getName());
    }

    @GetMapping("/pending")
    public List<LeaveRequest> getPendingRequests() {
        return leaveService.getPendingRequests();
    }

    @GetMapping("/all")
    public List<LeaveRequest> getAllRequests() {
        return leaveService.getAllRequests();
    }

    @PutMapping("/{id}/status")
    public LeaveRequest updateStatus(@PathVariable Integer id,
                                     @RequestBody Map<String, String> body) {
        String status = body.get("status"); // APPROVED, REJECTED
        String comment = body.get("comment");
        return leaveService.updateStatus(id, status, comment);
    }
}
