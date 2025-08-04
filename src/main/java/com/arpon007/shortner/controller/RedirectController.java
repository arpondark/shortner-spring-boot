package com.arpon007.shortner.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.arpon007.shortner.Service.UrlMappingService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class RedirectController {

    private UrlMappingService urlMappingService;

    @GetMapping("/{shortUrl}")
    public ResponseEntity<String> redirect(@PathVariable String shortUrl) {
        String originalUrl = urlMappingService.getOriginalUrl(shortUrl);
        if (originalUrl != null) {
            // Ensure the URL has a proper protocol
            String redirectUrl = originalUrl;
            if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
                redirectUrl = "https://" + originalUrl;
            }
            
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", redirectUrl)
                    .build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
