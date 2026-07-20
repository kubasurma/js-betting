package com.jsbetting.exception;

import com.jsbetting.dto.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException exception) {
        ErrorResponse errorResponse = new ErrorResponse(
                exception.getReason(),
                exception.getStatusCode().value(),
                LocalDateTime.now()
        );

        return ResponseEntity
                .status(exception.getStatusCode())
                .body(errorResponse);
    }
}