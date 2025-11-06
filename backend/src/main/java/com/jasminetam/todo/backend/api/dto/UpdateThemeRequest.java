package com.jasminetam.todo.backend.api.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record UpdateThemeRequest(
        @Pattern(regexp = "light|dark") String mode,
        @Size(min = 4, max = 32) String primaryColor, // e.g. "#3b82f6"
        @Size(min = 4, max = 32) String accentColor,  // e.g. "#22c55e"
        @Positive Integer radius
) {}
