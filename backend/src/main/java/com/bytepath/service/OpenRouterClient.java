package com.bytepath.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/** Server-side OpenRouter adapter. The API key never leaves the backend. */
@Service
public class OpenRouterClient {
    private static final Logger log = LoggerFactory.getLogger(OpenRouterClient.class);
    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String model;
    private final String siteUrl;

    public OpenRouterClient(RestClient.Builder builder, ObjectMapper objectMapper,
                            @Value("${openrouter.api.key:}") String apiKey,
                            @Value("${openrouter.model:openai/gpt-4o-mini}") String model,
                            @Value("${openrouter.site-url:http://localhost:5173}") String siteUrl) {
        this.restClient = builder.baseUrl("https://openrouter.ai/api/v1").build();
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.model = model;
        this.siteUrl = siteUrl;
    }

    public Optional<String> ask(String systemPrompt, String userPrompt, int maxTokens) {
        if (apiKey.isBlank()) return Optional.empty();
        try {
            String response = restClient.post().uri("/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + apiKey)
                .header("HTTP-Referer", siteUrl)
                .header("X-Title", "BytePath Academic Planner")
                .body(Map.of("model", model, "temperature", 0.55, "max_tokens", maxTokens,
                    "messages", List.of(Map.of("role", "system", "content", systemPrompt),
                                         Map.of("role", "user", "content", userPrompt))))
                .retrieve().body(String.class);
            if (response == null || response.isBlank()) return Optional.empty();
            JsonNode content = objectMapper.readTree(response).path("choices").path(0).path("message").path("content");
            return content.asText("").isBlank() ? Optional.empty() : Optional.of(content.asText().trim());
        } catch (RuntimeException exception) {
            log.warn("OpenRouter request failed; using the application fallback", exception);
            return Optional.empty();
        }
    }
}
