package com.github.ani.llm_review_analysis.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name = "product_reviews")
@Data
public class ProductReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "batch_id")
    private UUID batchId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "review_text", columnDefinition = "TEXT")
    private String reviewText;

    @Column(name = "reviewer_name")
    private String reviewerName;
}