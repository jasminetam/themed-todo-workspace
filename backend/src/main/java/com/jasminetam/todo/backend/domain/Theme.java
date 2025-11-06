package com.jasminetam.todo.backend.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "themes")
public class Theme {
    @Id
    private UUID id = UUID.randomUUID();

    @Column(name = "workspace_id", nullable = false, unique = true)
    private UUID workspaceId;

    @Column(nullable = false)
    private String mode; // "light" | "dark"

    @Column(name = "primary_color", nullable = false)
    private String primaryColor;

    @Column(name = "accent_color", nullable = false)
    private String accentColor;

    @Column(nullable = false)
    private Integer radius = 10;

    // getters/setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(UUID workspaceId) { this.workspaceId = workspaceId; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public String getPrimaryColor() { return primaryColor; }
    public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }
    public String getAccentColor() { return accentColor; }
    public void setAccentColor(String accentColor) { this.accentColor = accentColor; }
    public Integer getRadius() { return radius; }
    public void setRadius(Integer radius) { this.radius = radius; }
}

