package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.domain.exceptions.InvalidDownloadSessionException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class DownloadSessionExceptionHandler {

    @ExceptionHandler(InvalidDownloadSessionException.class)
    public ResponseEntity<ProblemDetail> handleInvalidDownloadSession(InvalidDownloadSessionException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, ex.getMessage());
        problem.setTitle("Download Session Required");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(problem);
    }
}
