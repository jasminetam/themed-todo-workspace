package com.jasminetam.todo.backend.service;

import com.jasminetam.todo.backend.api.dto.CreateTodoRequest;
import com.jasminetam.todo.backend.api.dto.UpdateTodoRequest;
import com.jasminetam.todo.backend.domain.Todo;
import com.jasminetam.todo.backend.repo.TodoRepository;
import com.jasminetam.todo.backend.repo.WorkspaceRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@Transactional
public class TodoService {
    private final TodoRepository todoRepo;
    private final WorkspaceRepository wsRepo;

    public TodoService(TodoRepository todoRepo, WorkspaceRepository wsRepo) {
        this.todoRepo = todoRepo;
        this.wsRepo = wsRepo;
    }

    public List<Todo> list(UUID currentUserId, UUID workspaceId) {
        assertWorkspaceOwnership(currentUserId, workspaceId);
        return todoRepo.findByWorkspaceIdOrderByCreatedAtDesc(workspaceId);
    }

    public Todo create(UUID currentUserId, CreateTodoRequest req) {
        assertWorkspaceOwnership(currentUserId, req.workspaceId());
        var t = new Todo();
        t.setWorkspaceId(req.workspaceId());
        t.setTitle(req.title());
        t.setDueAt(req.dueAt());
        return todoRepo.save(t);
    }

    public Todo update(UUID currentUserId, UUID todoId, UpdateTodoRequest req) {
        var t = todoRepo.findById(todoId).orElseThrow(NoSuchElementException::new);
        assertWorkspaceOwnership(currentUserId, t.getWorkspaceId());
        if (req.title() != null) t.setTitle(req.title());
        if (req.done() != null) t.setDone(req.done());
        if (req.dueAt() != null) t.setDueAt(req.dueAt());
        return todoRepo.save(t);
    }

    public void delete(UUID currentUserId, UUID todoId) {
        var t = todoRepo.findById(todoId).orElseThrow(NoSuchElementException::new);
        assertWorkspaceOwnership(currentUserId, t.getWorkspaceId());
        todoRepo.deleteById(todoId);
    }

    private void assertWorkspaceOwnership(UUID userId, UUID workspaceId) {
        if (!wsRepo.existsByIdAndOwnerId(workspaceId, userId)) {
            throw new AccessDeniedException("Workspace not accessible");
        }
    }
}
