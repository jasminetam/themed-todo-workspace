package com.jasminetam.todo.backend.service;

import com.jasminetam.todo.backend.domain.Todo;
import com.jasminetam.todo.backend.repo.TodoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class TodoService {
    private final TodoRepository repo;
    public TodoService(TodoRepository repo) { this.repo = repo; }

    public List<Todo> list(UUID workspaceId) {
        return repo.findByWorkspaceIdOrderByCreatedAtDesc(workspaceId);
    }

    public Todo create(UUID workspaceId, String title) {
        Todo t = new Todo();
        t.setWorkspaceId(workspaceId);
        t.setTitle(title);
        return repo.save(t);
    }

    public Todo update(UUID id, String title, Boolean done) {
        Todo t = repo.findById(id).orElseThrow();
        if (title != null) t.setTitle(title);
        if (done != null) t.setDone(done);
        return repo.save(t);
    }

    public void delete(UUID id) { repo.deleteById(id); }
}