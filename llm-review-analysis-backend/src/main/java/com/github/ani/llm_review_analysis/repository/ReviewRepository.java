package com.github.ani.llm_review_analysis.repository;

import com.github.ani.llm_review_analysis.model.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface ReviewRepository extends JpaRepository<ProductReview, Integer> {
    // We will need this to fetch all reviews for a specific uploaded file
    List<ProductReview> findByBatchId(UUID batchId);
}