package com.jasminetam.todo.backend.repo;

import com.jasminetam.todo.backend.domain.Theme;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ThemeRepository extends JpaRepository<Theme, UUID> {
    Optional<Theme> findByWorkspaceId(UUID workspaceId);
}

