package com.jasminetam.todo.backend.api;

import com.jasminetam.todo.backend.api.dto.CreateTodoRequest;
import com.jasminetam.todo.backend.api.dto.UpdateTodoRequest;
import com.jasminetam.todo.backend.domain.Todo;
import com.jasminetam.todo.backend.service.TodoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/todos")
public class TodoController {
    private final TodoService service;
    public TodoController(TodoService service) { this.service = service; }

    @GetMapping
    public List<Todo> list(@RequestParam UUID workspaceId) {
        return service.list(workspaceId);
    }

    @PostMapping
    public ResponseEntity<Todo> create(@Valid @RequestBody CreateTodoRequest req) {
        Todo t = service.create(req.workspaceId(), req.title());
        return ResponseEntity.created(URI.create("/api/todos/" + t.getId())).body(t);
    }

    @PatchMapping("/{id}")
    public Todo update(@PathVariable UUID id, @RequestBody UpdateTodoRequest req) {
        return service.update(id, req.title(), req.done());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
