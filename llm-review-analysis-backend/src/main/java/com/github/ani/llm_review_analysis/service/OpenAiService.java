package com.github.ani.llm_review_analysis.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OpenAiService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> analyzeReview(String reviewText) {
        String url = "https://api.openai.com/v1/chat/completions";

        // Strict JSON Schema for the LLM
        String prompt = "Analyze this review: \"" + reviewText + "\". " +
                "Return valid JSON ONLY with these fields: " +
                "1. sentiment (Positive, Negative, Neutral) " +
                "2. confidence_score (0.0 to 1.0) " +
                "3. summary (max 10 words) " +
                "4. pros (list of strings) " +
                "5. cons (list of strings).";

        // Request Body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", "You are a helpful assistant that outputs strictly valid JSON."),
                Map.of("role", "user", "content", prompt)
        ));
        requestBody.put("temperature", 0.3);

        // Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        try {
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            
            // Parse Response
            JsonNode root = objectMapper.readTree(response.getBody());
            String content = root.path("choices").get(0).path("message").path("content").asText();
            
            // Convert LLM JSON string to Java Map
            return objectMapper.readValue(content, Map.class);
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("sentiment", "Neutral", "summary", "Analysis Failed");
        }
    }
}