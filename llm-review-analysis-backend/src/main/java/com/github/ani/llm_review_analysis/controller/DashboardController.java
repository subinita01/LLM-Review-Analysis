package com.github.ani.llm_review_analysis.controller;

import com.github.ani.llm_review_analysis.model.ReviewAnalysis;
import com.github.ani.llm_review_analysis.model.UploadBatch; // Import this
import com.github.ani.llm_review_analysis.repository.AnalysisRepository;
import com.github.ani.llm_review_analysis.repository.BatchRepository; // Import this
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private AnalysisRepository analysisRepository;

    @Autowired
    private BatchRepository batchRepository; // Add this

    @GetMapping("/{batchId}/reviews")
    public ResponseEntity<List<ReviewAnalysis>> getReviews(@PathVariable UUID batchId) {
        return ResponseEntity.ok(analysisRepository.findByBatchId(batchId));
    }

    @GetMapping("/{batchId}/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@PathVariable UUID batchId) {
        // 1. Get the Batch Status
        UploadBatch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        // 2. Get the Stats
        List<Object[]> sentimentCounts = analysisRepository.countSentimentByBatchId(batchId);
        Map<String, Long> stats = new HashMap<>();
        for (Object[] row : sentimentCounts) {
            String sentiment = (String) row[0];
            Long count = (Long) row[1];
            stats.put(sentiment, count);
        }

        // 3. Return both
        Map<String, Object> response = new HashMap<>();
        response.put("sentiment_distribution", stats);
        response.put("status", batch.getStatus()); // <--- CRITICAL ADDITION
        
        return ResponseEntity.ok(response);
    }
}