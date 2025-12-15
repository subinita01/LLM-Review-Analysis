package com.github.ani.llm_review_analysis.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "review_analysis")
@Data
public class ReviewAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Links this analysis to a specific review
    @OneToOne
    @JoinColumn(name = "review_id", referencedColumnName = "id")
    private ProductReview review;

    private String sentiment; // Positive, Negative, Neutral

    @Column(name = "confidence_score")
    private BigDecimal confidenceScore;

    @Column(columnDefinition = "TEXT")
    private String summary;

    // Maps the 'pros' JSONB column in DB to a Java List
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> pros;

    // Maps the 'cons' JSONB column in DB to a Java List
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> cons;
}