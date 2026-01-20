package com.naammm.authorizationserver.config;

import jakarta.servlet.Filter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Configuration to fix ERR_INCOMPLETE_CHUNKED_ENCODING error
 * Ensures proper response completion and prevents response truncation
 */
@Configuration
public class ResponseConfig {

    @Bean
    @Order(1)
    public Filter responseCompletionFilter() {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(
                    HttpServletRequest request,
                    HttpServletResponse response,
                    jakarta.servlet.FilterChain filterChain) throws ServletException, IOException {
                
                // Only apply to HTML template endpoints
                String path = request.getRequestURI();
                if (path.equals("/login") || path.equals("/register")) {
                    // Set buffer size large enough to hold entire response
                    // This prevents chunked encoding for small to medium responses
                    response.setBufferSize(256 * 1024); // 256KB buffer
                    
                    // Ensure proper content type and encoding
                    response.setContentType("text/html;charset=UTF-8");
                    
                    filterChain.doFilter(request, response);
                    
                    // Ensure response is fully flushed
                    if (!response.isCommitted()) {
                        response.flushBuffer();
                    }
                } else {
                    filterChain.doFilter(request, response);
                }
            }
        };
    }
}
