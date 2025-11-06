package com.jasminetam.todo.backend.api;

import com.jasminetam.todo.backend.api.dto.UpdateThemeRequest;
import com.jasminetam.todo.backend.domain.Theme;
import com.jasminetam.todo.backend.security.CurrentUser;
import com.jasminetam.todo.backend.service.ThemeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/theme")
@Tag(name = "Theme")
public class ThemeController {

    private final ThemeService service;

    public ThemeController(ThemeService service) { this.service = service; }

    @GetMapping
    public Theme get(@RequestParam UUID workspaceId, CurrentUser user) {
        return service.getByWorkspaceId(user.id(), workspaceId);
    }

    @PutMapping
    public Theme update(@RequestParam UUID workspaceId,
                        @Valid @RequestBody UpdateThemeRequest r,
                        CurrentUser user) {
        return service.update(user.id(), workspaceId, r);
    }
}
