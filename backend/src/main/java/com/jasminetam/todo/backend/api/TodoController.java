package com.jasminetam.todo.backend.api;

import com.jasminetam.todo.backend.api.dto.CreateTodoRequest;
import com.jasminetam.todo.backend.api.dto.UpdateTodoRequest;
import com.jasminetam.todo.backend.domain.Todo;
import com.jasminetam.todo.backend.security.CurrentUser;
import com.jasminetam.todo.backend.service.TodoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/todos")
@Tag(name = "Todos")
public class TodoController {

    private final TodoService service;

    public TodoController(TodoService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "List todos for a workspace (requires X-User-Id)")
    public List<Todo> list(@RequestParam UUID workspaceId, CurrentUser user) {
        return service.list(user.id(), workspaceId);
    }

    @PostMapping
    @Operation(summary = "Create a todo in a workspace (requires X-User-Id)")
    public ResponseEntity<Todo> create(@Valid @RequestBody CreateTodoRequest req, CurrentUser user) {
        var saved = service.create(user.id(), req);
        return ResponseEntity.created(URI.create("/api/todos/" + saved.getId())).body(saved);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update a todo (requires X-User-Id)")
    public Todo update(@PathVariable UUID id, @RequestBody UpdateTodoRequest req, CurrentUser user) {
        return service.update(user.id(), id, req);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a todo (requires X-User-Id)")
    public ResponseEntity<Void> delete(@PathVariable UUID id, CurrentUser user) {
        service.delete(user.id(), id);
        return ResponseEntity.noContent().build();
    }
}
