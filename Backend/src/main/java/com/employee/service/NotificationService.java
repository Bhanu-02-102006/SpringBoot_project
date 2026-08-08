package com.employee.service;

import com.employee.entity.Notification;
import com.employee.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(String email, String message) {
        Notification notification = new Notification();
        notification.setEmployeeEmail(email);
        notification.setMessage(message);
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(String email) {
        return notificationRepository.findByEmployeeEmailOrderByTimestampDesc(email);
    }

    public long getUnreadCount(String email) {
        return notificationRepository.countByEmployeeEmailAndIsReadFalse(email);
    }

    public void markAsRead(Integer id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead(String email) {
        List<Notification> notifications = notificationRepository.findByEmployeeEmailOrderByTimestampDesc(email);
        for (Notification n : notifications) {
            n.setRead(true);
        }
        notificationRepository.saveAll(notifications);
    }
}
