package com.nullbase.personalAssist.modules.roadmap;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class RoadmapSchemaConverter implements AttributeConverter<RoadmapSchema, String> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(RoadmapSchema attribute) {
        if (attribute == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Error converting RoadmapSchema to JSON string", e);
        }
    }

    @Override
    public RoadmapSchema convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(dbData, RoadmapSchema.class);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Error parsing JSON string to RoadmapSchema", e);
        }
    }
}
