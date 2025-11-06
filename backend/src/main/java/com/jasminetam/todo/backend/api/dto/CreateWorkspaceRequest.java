package com.jasminetam.todo.backend.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CreateWorkspaceRequest(@NotBlank @Size(max = 80) String name) {
    public WithOwner withOwner(UUID ownerId) { return new WithOwner(ownerId, name); }
    public record WithOwner(UUID ownerId, String name) {}
}
