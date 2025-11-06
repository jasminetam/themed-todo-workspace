package com.jasminetam.todo.backend.service;

import com.jasminetam.todo.backend.api.dto.UpdateThemeRequest;
import com.jasminetam.todo.backend.domain.Theme;
import com.jasminetam.todo.backend.repo.ThemeRepository;
import com.jasminetam.todo.backend.repo.WorkspaceRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@Transactional
public class ThemeService {
    private final ThemeRepository themeRepo;
    private final WorkspaceRepository wsRepo;

    public ThemeService(ThemeRepository themeRepo, WorkspaceRepository wsRepo) {
        this.themeRepo = themeRepo;
        this.wsRepo = wsRepo;
    }

    public Theme getByWorkspaceId(UUID currentUserId, UUID workspaceId) {
        assertWorkspaceOwnership(currentUserId, workspaceId);
        return themeRepo.findByWorkspaceId(workspaceId).orElseThrow(NoSuchElementException::new);
    }

    public Theme update(UUID currentUserId, UUID workspaceId, UpdateThemeRequest r) {
        assertWorkspaceOwnership(currentUserId, workspaceId);
        var t = themeRepo.findByWorkspaceId(workspaceId).orElseThrow(NoSuchElementException::new);
        if (r.mode() != null) t.setMode(r.mode());
        if (r.primaryColor() != null) t.setPrimaryColor(r.primaryColor());
        if (r.accentColor() != null) t.setAccentColor(r.accentColor());
        if (r.radius() != null) t.setRadius(r.radius());
        return themeRepo.save(t);
    }

    private void assertWorkspaceOwnership(UUID userId, UUID wsId) {
        if (!wsRepo.existsByIdAndOwnerId(wsId, userId)) {
            throw new AccessDeniedException("Workspace not accessible");
        }
    }
}
