package com.jasminetam.todo.backend.repo;

import com.jasminetam.todo.backend.domain.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface WorkspaceRepository extends JpaRepository<Workspace, UUID> {
    List<Workspace> findByOwnerIdOrderByNameAsc(UUID ownerId);

    boolean existsByIdAndOwnerId(UUID id, UUID ownerId);
}

