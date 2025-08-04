package com.arpon007.shortner.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow all origins for development purposes
        // For production, you should restrict to specific origins
        configuration.setAllowedOrigins(List.of(
            "http://localhost:3000", 
            "http://127.0.0.1:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3001"
        ));
        
        // For extreme cases, allow all origins (only use for troubleshooting)
        // configuration.addAllowedOrigin("*");
        
        // Allow all common HTTP methods
        configuration.setAllowedMethods(List.of(
            "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"
        ));
        
        // Allow common headers
        configuration.setAllowedHeaders(List.of(
            "Authorization", 
            "Content-Type", 
            "X-Requested-With", 
            "Accept", 
            "Origin", 
            "Access-Control-Request-Method", 
            "Access-Control-Request-Headers"
        ));
        
        // For extreme cases, allow all headers
        // configuration.setAllowedHeaders(List.of("*"));
        
        // Allow credentials (cookies, auth headers)
        configuration.setAllowCredentials(true);
        
        // Expose these headers to client
        configuration.setExposedHeaders(List.of(
            "Authorization", 
            "Content-Disposition"
        ));
        
        // Cache preflight response for 1 hour
        configuration.setMaxAge(3600L);
        
        // Apply this configuration to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
