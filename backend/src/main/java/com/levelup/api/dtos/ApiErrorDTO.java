package com.levelup.api.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record ApiErrorDTO(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        Map<String, String> fieldErrors
) {
    public static ApiErrorDTO of(int status, String error, String message, String path) {
        return new ApiErrorDTO(Instant.now(), status, error, message, path, null);
    }

    public static ApiErrorDTO ofValidation(int status, String error, String message, String path, Map<String, String> fieldErrors) {
        return new ApiErrorDTO(Instant.now(), status, error, message, path, fieldErrors);
    }
}
