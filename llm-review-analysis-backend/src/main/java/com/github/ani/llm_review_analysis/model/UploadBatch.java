package com.github.ani.llm_review_analysis.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "upload_batches")
@Data
public class UploadBatch {
    @Id
    @Column(name = "batch_id")
    private UUID batchId;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "upload_timestamp")
    private LocalDateTime uploadTimestamp;

    @Column(name = "status") // PENDING, COMPLETED, FAILED
    private String status;

    // Automatically set ID and Time before saving
    @PrePersist
    public void prePersist() {
        if (this.batchId == null) this.batchId = UUID.randomUUID();
        if (this.uploadTimestamp == null) this.uploadTimestamp = LocalDateTime.now();
    }
}