package com.jasminetam.todo.backend.api;

import com.jasminetam.todo.backend.api.dto.CreateWorkspaceRequest;
import com.jasminetam.todo.backend.domain.Workspace;
import com.jasminetam.todo.backend.security.CurrentUser;
import com.jasminetam.todo.backend.service.WorkspaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/workspaces")
@Tag(name = "Workspaces")
public class WorkspaceController {

    private final WorkspaceService service;

    public WorkspaceController(WorkspaceService service) {
        this.service = service;
    }

    @GetMapping
    public List<Workspace> myWorkspaces(CurrentUser user) {
        return service.listByOwner(user.id());
    }

    @PostMapping
    public ResponseEntity<Workspace> create(@Valid @RequestBody CreateWorkspaceRequest req, CurrentUser user) {
        var saved = service.create(req.withOwner(user.id())); // see DTO tweak below
        return ResponseEntity.created(URI.create("/api/workspaces/" + saved.getId())).body(saved);
    }
}
