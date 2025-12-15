package com.github.ani.llm_review_analysis.repository;

import com.github.ani.llm_review_analysis.model.ReviewAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface AnalysisRepository extends JpaRepository<ReviewAnalysis, Integer> {

    // 1. Fetch all analysis for a specific Batch ID
    // We join 'ReviewAnalysis' -> 'ProductReview' to filter by Batch ID
    @Query("SELECT a FROM ReviewAnalysis a JOIN a.review r WHERE r.batchId = :batchId")
    List<ReviewAnalysis> findByBatchId(@Param("batchId") UUID batchId);

    // 2. Get Sentiment Counts for the Charts (e.g., Positive: 10, Negative: 5)
    // Returns a list of arrays: ["Positive", 10]
    @Query("SELECT a.sentiment, COUNT(a) FROM ReviewAnalysis a JOIN a.review r WHERE r.batchId = :batchId GROUP BY a.sentiment")
    List<Object[]> countSentimentByBatchId(@Param("batchId") UUID batchId);
}