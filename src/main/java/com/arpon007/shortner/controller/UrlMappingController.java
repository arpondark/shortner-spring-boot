package com.arpon007.shortner.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
