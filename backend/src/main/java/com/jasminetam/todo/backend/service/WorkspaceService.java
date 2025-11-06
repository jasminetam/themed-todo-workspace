package com.jasminetam.todo.backend.service;

import com.jasminetam.todo.backend.api.dto.CreateWorkspaceRequest;
import com.jasminetam.todo.backend.domain.Workspace;
import com.jasminetam.todo.backend.repo.WorkspaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class WorkspaceService {
    private final WorkspaceRepository repo;

    public WorkspaceService(WorkspaceRepository repo) {
        this.repo = repo;
    }

    public List<Workspace> listAll() {
        return repo.findAll();
    }

    public List<Workspace> listByOwner(UUID ownerId) {
        return repo.findByOwnerIdOrderByNameAsc(ownerId);
    }

    public Workspace create(CreateWorkspaceRequest.WithOwner req) {
        var w = new Workspace();
        w.setOwnerId(req.ownerId());
        w.setName(req.name());
        return repo.save(w);
    }

}

