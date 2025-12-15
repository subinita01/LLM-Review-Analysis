package com.github.ani.llm_review_analysis.service;

import com.github.ani.llm_review_analysis.model.ProductReview;
import com.github.ani.llm_review_analysis.model.ReviewAnalysis;
import com.github.ani.llm_review_analysis.model.UploadBatch;
import com.github.ani.llm_review_analysis.repository.AnalysisRepository;
import com.github.ani.llm_review_analysis.repository.BatchRepository;
import com.github.ani.llm_review_analysis.repository.ReviewRepository;
import com.opencsv.CSVReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class ReviewService {

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private AnalysisRepository analysisRepository;

    @Autowired
    private OpenAiService openAiService;

    public UUID processUpload(MultipartFile file) throws Exception {
        // 1. Create a new Batch Record (Status: PROCESSING)
        UploadBatch batch = new UploadBatch();
        batch.setFileName(file.getOriginalFilename());
        batch.setStatus("PROCESSING");
        batchRepository.save(batch);

        // 2. Parse CSV
        List<ProductReview> reviews = new ArrayList<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            List<String[]> rows = reader.readAll();
            boolean isFirstRow = true;

            for (String[] row : rows) {
                if (isFirstRow) {
                    isFirstRow = false;
                    continue;
                }
                // Map CSV to Entity
                ProductReview review = new ProductReview();
                review.setBatchId(batch.getBatchId());
                review.setProductName(row[1]); 
                review.setReviewText(row[2]);  
                review.setReviewerName(row.length > 3 ? row[3] : "Anonymous"); 
                reviews.add(review);
            }
        }

        // 3. Save raw reviews to DB
        reviewRepository.saveAll(reviews);

        // 4. Trigger AI Analysis in the Background (Async)
        // This allows the API to return the BatchID immediately while AI runs in background
        CompletableFuture.runAsync(() -> analyzeBatch(batch.getBatchId()));

        return batch.getBatchId();
    }

    // This method runs in the background

    public void analyzeBatch(UUID batchId) {
        System.out.println("Started AI Analysis for Batch: " + batchId);
        
        List<ProductReview> reviews = reviewRepository.findByBatchId(batchId);
        
        // OPTIMIZATION: Use parallelStream() to process multiple reviews at once
        // This makes it 5x-10x faster
        reviews.parallelStream().forEach(review -> {
            try {
                // Call OpenAI
                Map<String, Object> result = openAiService.analyzeReview(review.getReviewText());

                // Create Analysis Entity
                ReviewAnalysis analysis = new ReviewAnalysis();
                analysis.setReview(review);
                analysis.setSentiment((String) result.getOrDefault("sentiment", "Neutral"));
                
                Object scoreObj = result.get("confidence_score");
                if (scoreObj instanceof Number) {
                    analysis.setConfidenceScore(java.math.BigDecimal.valueOf(((Number) scoreObj).doubleValue()));
                }

                analysis.setSummary((String) result.getOrDefault("summary", ""));
                analysis.setPros((List<String>) result.get("pros"));
                analysis.setCons((List<String>) result.get("cons"));

                // Save to DB
                analysisRepository.save(analysis);
                
            } catch (Exception e) {
                System.err.println("Error analyzing review " + review.getId() + ": " + e.getMessage());
            }
        });

        // 5. Update Batch Status to COMPLETED
        UploadBatch batch = batchRepository.findById(batchId).orElse(null);
        if (batch != null) {
            batch.setStatus("COMPLETED");
            batchRepository.save(batch);
            System.out.println("Batch " + batchId + " Analysis Completed!");
        }
    }

}