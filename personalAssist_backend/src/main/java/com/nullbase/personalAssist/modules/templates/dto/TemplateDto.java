package com.nullbase.personalAssist.modules.templates.dto;

import com.nullbase.personalAssist.modules.templates.Template;
import com.nullbase.personalAssist.modules.roadmap.RoadmapSchema;
import java.time.LocalDateTime;
import java.util.UUID;

public class TemplateDto {
    private UUID id;
    private String name;
    private String category;
    private String description;
    private RoadmapSchema templateJson;
    private boolean isPublic;
    private Long createdById;
    private LocalDateTime createdAt;

    public TemplateDto() {}

    public TemplateDto(Template template) {
        this.id = template.getId();
        this.name = template.getName();
        this.category = template.getCategory().name();
        this.description = template.getDescription();
        this.templateJson = template.getTemplateJson();
        this.isPublic = template.isPublic();
        if (template.getCreatedBy() != null) {
            this.createdById = template.getCreatedBy().getId();
        }
        this.createdAt = template.getCreatedAt();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public RoadmapSchema getTemplateJson() {
        return templateJson;
    }

    public void setTemplateJson(RoadmapSchema templateJson) {
        this.templateJson = templateJson;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
