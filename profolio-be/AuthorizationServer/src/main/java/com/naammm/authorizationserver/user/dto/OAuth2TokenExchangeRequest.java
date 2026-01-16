package com.naammm.authorizationserver.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OAuth2TokenExchangeRequest {
    @NotBlank(message = "Authorization code is required")
    private String code;

    @NotBlank(message = "Redirect URI is required")
    private String redirectUri;

    private String state; // Optional, for CSRF protection
}
