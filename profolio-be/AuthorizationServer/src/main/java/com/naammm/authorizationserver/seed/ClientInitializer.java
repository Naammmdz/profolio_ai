package com.naammm.authorizationserver.seed;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;

import java.time.Duration;
import java.util.Arrays;
import java.util.UUID;

@Component
public class ClientInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(ClientInitializer.class);

    private final RegisteredClientRepository registeredClientRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.oauth.client.id}")
    private String clientId;

    @Value("${app.oauth.client.secret}")
    private String clientSecret;

    @Value("${app.oauth.client.redirect-uris}")
    private String redirectUris;

    public ClientInitializer(RegisteredClientRepository registeredClientRepository, PasswordEncoder passwordEncoder) {
        this.registeredClientRepository = registeredClientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("Initializing OAuth2 clients...");

        // OAuth2 client for Authorization Code flow with PKCE
        if (registeredClientRepository.findByClientId(clientId) == null) {
            RegisteredClient.Builder clientBuilder = RegisteredClient.withId(UUID.randomUUID().toString())
                    .clientId(clientId)
                    .clientName("React Frontend Client")
                    .clientSecret(passwordEncoder.encode(clientSecret))
                    .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                    .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_POST)
                    .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                    .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
                    .scope("openid")
                    .scope("profile")
                    .scope("email")
                    .scope("read")
                    .scope("write")
                    .clientSettings(ClientSettings.builder()
                            .requireProofKey(true)
                            .requireAuthorizationConsent(false)
                            .build())
                    .tokenSettings(TokenSettings.builder()
                            .accessTokenTimeToLive(Duration.ofHours(1))
                            .refreshTokenTimeToLive(Duration.ofDays(7))
                            .reuseRefreshTokens(false)
                            .build());

            // Add redirect URIs from config
            Arrays.stream(redirectUris.split(","))
                    .map(String::trim)
                    .forEach(clientBuilder::redirectUri);

            RegisteredClient authorizationCodeClient = clientBuilder.build();
            registeredClientRepository.save(authorizationCodeClient);
            log.info("OAuth2 client '{}' registered successfully", clientId);
        } else {
            log.info("OAuth2 client '{}' already exists", clientId);
        }

        // OAuth2 client for Client Credentials flow
        String serviceClientId = "service-client";
        if (registeredClientRepository.findByClientId(serviceClientId) == null) {
            RegisteredClient serviceClient = RegisteredClient.withId(UUID.randomUUID().toString())
                    .clientId(serviceClientId)
                    .clientName("Service-to-Service Client")
                    .clientSecret(passwordEncoder.encode(clientSecret))
                    .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                    .authorizationGrantType(AuthorizationGrantType.CLIENT_CREDENTIALS)
                    .scope("read")
                    .scope("write")
                    .tokenSettings(TokenSettings.builder()
                            .accessTokenTimeToLive(Duration.ofMinutes(30))
                            .build())
                    .build();
            registeredClientRepository.save(serviceClient);
            log.info("OAuth2 service client '{}' registered successfully", serviceClientId);
        } else {
            log.info("OAuth2 service client '{}' already exists", serviceClientId);
        }

        log.info("OAuth2 client initialization completed");
    }
}
