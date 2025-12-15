package com.github.ani.llm_review_analysis.repository;

import com.github.ani.llm_review_analysis.model.UploadBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface BatchRepository extends JpaRepository<UploadBatch, UUID> {
}