package com.example.taskapp.repository;

import com.example.taskapp.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserIdAndCompletedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);
}
