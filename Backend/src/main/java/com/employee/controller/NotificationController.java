package com.employee.controller;

import com.employee.entity.Notification;
import com.employee.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<Notification> getMyNotifications(java.security.Principal principal) {
        return notificationService.getNotificationsForUser(principal.getName());
    }

    @GetMapping("/unread-count")
    public long getUnreadCount(java.security.Principal principal) {
        return notificationService.getUnreadCount(principal.getName());
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Integer id) {
        notificationService.markAsRead(id);
    }

    @PutMapping("/read-all")
    public void markAllAsRead(java.security.Principal principal) {
        notificationService.markAllAsRead(principal.getName());
    }
}
