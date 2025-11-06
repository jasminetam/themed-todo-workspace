package com.jasminetam.todo.backend.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;

public record CreateTodoRequest(
        @NotNull UUID workspaceId,
        @NotBlank @Size(max = 120) String title,
        Instant dueAt
) {}
