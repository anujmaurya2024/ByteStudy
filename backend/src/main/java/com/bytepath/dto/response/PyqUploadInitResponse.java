package com.bytepath.dto.response;

public record PyqUploadInitResponse(
    Long resourceId,
    String objectKey,
    String uploadUrl,
    long expiresInSeconds
) {}
