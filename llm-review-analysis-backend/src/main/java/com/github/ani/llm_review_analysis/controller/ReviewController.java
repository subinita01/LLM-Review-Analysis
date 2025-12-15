package com.github.ani.llm_review_analysis.controller;

import com.github.ani.llm_review_analysis.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")

public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadReviews(@RequestParam("file") MultipartFile file) {
        try {
            UUID batchId = reviewService.processUpload(file);
            return ResponseEntity.ok(Map.of(
                "message", "Upload successful",
                "batchId", batchId
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}