package com.arpon007.shortner.controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.arpon007.shortner.dtos.ClickEventDtos;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.arpon007.shortner.Service.UrlMappingService;
import com.arpon007.shortner.Service.UserService;
import com.arpon007.shortner.dtos.UrlMappingDTO;
import com.arpon007.shortner.models.User;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/url")
@AllArgsConstructor
public class UrlMappingController {

    private UrlMappingService urlMappingService;
    private UserService userService;

    @PostMapping("/shorten")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlMappingDTO> shortenUrl(@RequestBody Map<String, String> requrst, Principal principal) {
        String orginalUrl = requrst.get("originalUrl");
        User user = userService.findByUserName(principal.getName());
        UrlMappingDTO urlMappingDTO = urlMappingService.createShortUrl(orginalUrl, user);
        return ResponseEntity.ok(urlMappingDTO);
    }

    @GetMapping("/myurls")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<UrlMappingDTO>> getMyUrls(Principal principal) {
        User user = userService.findByUserName(principal.getName());
        List<UrlMappingDTO> urls = urlMappingService.getUrlsByUser(user);
        return ResponseEntity.ok(urls);
    }

    @GetMapping("/analytics/{shortUrl}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ClickEventDtos>> getUrlAnalytics(
            @PathVariable String shortUrl,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            Principal principal) {
        
        // Default to last 30 days if no dates provided
        LocalDateTime start = (startDate != null) 
            ? LocalDateTime.parse(startDate + "T00:00:00") 
            : LocalDateTime.now().minusDays(30);
        LocalDateTime end = (endDate != null) 
            ? LocalDateTime.parse(endDate + "T23:59:59") 
            : LocalDateTime.now();
        
        // Verify the URL belongs to the authenticated user
        User user = userService.findByUserName(principal.getName());
        if (!urlMappingService.doesUrlBelongToUser(shortUrl, user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        List<ClickEventDtos> analytics = urlMappingService.getClickEvents(shortUrl, start, end);
        return ResponseEntity.ok(analytics);
    }

}
