package com.arpon007.shortner.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UrlMappingDTO {
    private Long id;
    private String Orginalurl;
    private String shorturl;
    private int clickCount;
    private LocalDateTime createdAt;
    private String username;


}
