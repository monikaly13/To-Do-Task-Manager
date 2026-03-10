package com.example.taskapp.controller;

import com.example.taskapp.model.Task;
import com.example.taskapp.repository.TaskRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    private Long getCurrentUserId(HttpSession session) {
        return (Long) session.getAttribute("userId");
    }

    @GetMapping
    public ResponseEntity<?> getAllTasks(HttpSession session) {
        Long userId = getCurrentUserId(session);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please log in");
        }
        List<Task> tasks = taskRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id, HttpSession session) {
        Long userId = getCurrentUserId(session);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return taskRepository.findById(id)
                .filter(task -> task.getUserId().equals(userId))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task, HttpSession session) {
        Long userId = getCurrentUserId(session);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please log in");
        }
        task.setUserId(userId);
        task.setStatus(task.getStatus() != null ? task.getStatus() : "todo");
        if ("done".equals(task.getStatus()) && task.getCompletedAt() == null) {
            task.setCompletedAt(LocalDateTime.now());
        }
        return ResponseEntity.ok(taskRepository.save(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task taskDetails, HttpSession session) {
        Long userId = getCurrentUserId(session);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return taskRepository.findById(id)
                .filter(task -> task.getUserId().equals(userId))
                .map(task -> {
                    if (taskDetails.getTitle() != null) task.setTitle(taskDetails.getTitle());
                    if (taskDetails.getDescription() != null) task.setDescription(taskDetails.getDescription());
                    if (taskDetails.getStatus() != null) {
                        String prevStatus = task.getStatus();
                        String nextStatus = taskDetails.getStatus();
                        task.setStatus(nextStatus);

                        if ("done".equals(nextStatus) && !"done".equals(prevStatus)) {
                            task.setCompletedAt(LocalDateTime.now());
                        } else if (!"done".equals(nextStatus) && "done".equals(prevStatus)) {
                            task.setCompletedAt(null);
                        }
                    }
                    if (taskDetails.getCategory() != null) task.setCategory(taskDetails.getCategory());
                    if (taskDetails.getDueDate() != null) task.setDueDate(taskDetails.getDueDate());
                    return ResponseEntity.ok(taskRepository.save(task));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/stats/completed-this-month")
    public ResponseEntity<?> getCompletedThisMonth(HttpSession session) {
        Long userId = getCurrentUserId(session);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        LocalDate today = LocalDate.now();
        LocalDateTime start = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime end = today.plusMonths(1).withDayOfMonth(1).atStartOfDay();

        long count = taskRepository.countByUserIdAndCompletedAtBetween(userId, start, end);
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, HttpSession session) {
        Long userId = getCurrentUserId(session);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return taskRepository.findById(id)
                .filter(task -> task.getUserId().equals(userId))
                .map(task -> {
                    taskRepository.delete(task);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
