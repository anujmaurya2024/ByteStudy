package com.bytepath.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.Map;
import java.util.Optional;

@Service
public class RagClient {

    private static final Logger log = LoggerFactory.getLogger(RagClient.class);

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String endpoint;
    private final String apiKey;
    private final String authHeader;
    private final String authPrefix;

    public RagClient(
            RestClient.Builder restClientBuilder,
            ObjectMapper objectMapper,
            @Value("${rag.api.url:}") String endpoint,
            @Value("${rag.api.key:}") String apiKey,
            @Value("${rag.api.auth-header:Authorization}") String authHeader,
            @Value("${rag.api.auth-prefix:Bearer }") String authPrefix) {
        this.restClient = restClientBuilder.build();
        this.objectMapper = objectMapper;
        this.endpoint = endpoint;
        this.apiKey = apiKey;
        this.authHeader = authHeader;
        this.authPrefix = authPrefix;
    }

    public Optional<String> ask(String question, String academicContext) {
        if (endpoint.isBlank() || apiKey.isBlank()) {
            return Optional.empty();
        }

        try {
            String response = restClient.post()
                .uri(endpoint)
                .contentType(MediaType.APPLICATION_JSON)
                .header(authHeader, authPrefix + apiKey)
                .body(Map.of(
                    "query", question,
                    "context", academicContext
                ))
                .retrieve()
                .body(String.class);

            return extractAnswer(response);
        } catch (RestClientException | IllegalArgumentException exception) {
            log.warn("RAG request failed; using the local advisor fallback", exception);
            return Optional.empty();
        }
    }

    private Optional<String> extractAnswer(String response) {
        if (response == null || response.isBlank()) {
            return Optional.empty();
        }

        try {
            JsonNode root = objectMapper.readTree(response);
            String answer = firstText(root, "answer", "response", "text", "output", "content");
            if (!answer.isBlank()) {
                return Optional.of(answer);
            }

            JsonNode choices = root.path("choices");
            if (choices.isArray() && !choices.isEmpty()) {
                String content = choices.get(0).path("message").path("content").asText("");
                if (!content.isBlank()) {
                    return Optional.of(content);
                }
            }
        } catch (Exception ignored) {
            return Optional.of(response.trim());
        }

        return Optional.empty();
    }

    private String firstText(JsonNode root, String... fields) {
        for (String field : fields) {
            String value = root.path(field).asText("");
            if (!value.isBlank()) {
                return value;
            }
        }
        return "";
    }
}
