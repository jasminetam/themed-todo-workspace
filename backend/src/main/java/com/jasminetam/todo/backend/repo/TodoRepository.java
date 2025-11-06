package com.jasminetam.todo.backend.repo;

import com.jasminetam.todo.backend.domain.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TodoRepository extends JpaRepository<Todo, UUID> {
    List<Todo> findByWorkspaceIdOrderByCreatedAtDesc(UUID workspaceId);
}