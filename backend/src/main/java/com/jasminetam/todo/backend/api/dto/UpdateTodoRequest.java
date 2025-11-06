package com.jasminetam.todo.backend.api.dto;

import java.time.Instant;

public record UpdateTodoRequest(
        String title,
        Boolean done,
        Instant dueAt
) {}
