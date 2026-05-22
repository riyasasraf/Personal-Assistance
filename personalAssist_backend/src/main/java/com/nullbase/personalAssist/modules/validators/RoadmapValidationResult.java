package com.nullbase.personalAssist.modules.validators;

import java.util.ArrayList;
import java.util.List;

public class RoadmapValidationResult {
    private boolean valid = true;
    private List<RoadmapValidationError> errors = new ArrayList<>();

    public RoadmapValidationResult() {}

    public RoadmapValidationResult(boolean valid, List<RoadmapValidationError> errors) {
        this.valid = valid;
        this.errors = errors;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public List<RoadmapValidationError> getErrors() {
        return errors;
    }

    public void setErrors(List<RoadmapValidationError> errors) {
        this.errors = errors;
    }

    public void addError(String path, String message, String severity) {
        this.errors.add(new RoadmapValidationError(path, message, severity));
        if ("ERROR".equalsIgnoreCase(severity)) {
            this.valid = false;
        }
    }
}
