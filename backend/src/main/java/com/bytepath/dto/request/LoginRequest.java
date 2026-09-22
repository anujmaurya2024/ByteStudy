package com.bytepath.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** Request body for POST /api/auth/login */
@Data
public class LoginRequest {

    /** BytePath login ID (BTP-YYYY-XXXXXX) OR Google email address. */
    @NotBlank(message = "Identity (login ID or email) is required")
    private String identity;

    @NotBlank(message = "Password is required")
    private String password;
}
