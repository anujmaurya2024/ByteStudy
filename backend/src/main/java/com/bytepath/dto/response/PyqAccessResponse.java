package com.bytepath.dto.response;

public record PyqAccessResponse(
    Long resourceId,
    String viewUrl,
    long expiresInSeconds
) {}
