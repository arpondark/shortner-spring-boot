package com.arpon007.shortner.Service;

import com.arpon007.shortner.dtos.ClickEventDtos;
import com.arpon007.shortner.dtos.UrlMappingDTO;
import com.arpon007.shortner.models.ClickEvent;
import com.arpon007.shortner.models.UrlMapping;
import com.arpon007.shortner.models.User;
import com.arpon007.shortner.repo.ClickEventRepo;
import com.arpon007.shortner.repo.UrlMappingRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@AllArgsConstructor
public class UrlMappingService {
    private UrlMappingRepo urlMappingRepo;
    private ClickEventRepo clickEventRepo;

    public UrlMappingDTO createShortUrl(String originalUrl, User user) {
        String shortUrl = generateShortUrl();
        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setUser(user);
        urlMapping.setCreatedDate(LocalDateTime.now());
        UrlMapping savedUrlMapping = urlMappingRepo.save(urlMapping);
        return convertToDto(savedUrlMapping);
    }

    private UrlMappingDTO convertToDto(UrlMapping urlMapping) {
        UrlMappingDTO urlMappingDTO = new UrlMappingDTO();
        urlMappingDTO.setId(urlMapping.getId());
        urlMappingDTO.setOrginalurl(urlMapping.getOriginalUrl());
        urlMappingDTO.setShorturl(urlMapping.getShortUrl());
        urlMappingDTO.setClickCount(urlMapping.getClickCount());
        urlMappingDTO.setCreatedAt(urlMapping.getCreatedDate());
        urlMappingDTO.setUsername(urlMapping.getUser().getUsername());
        return urlMappingDTO;
    }

    public String generateShortUrl() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder shortUrl = new StringBuilder(8);
        for (int i = 0; i < 8; i++) {
            shortUrl.append(characters.charAt(random.nextInt(characters.length())));
        }
        return shortUrl.toString();
    }

    public List<UrlMappingDTO> getUrlsByUser(User user) {
        return urlMappingRepo.findByUser(user).stream()
                .map(this::convertToDto)
                .toList();
    }

    public String getOriginalUrl(String shortUrl) {
        Optional<UrlMapping> urlMapping = urlMappingRepo.findByShortUrl(shortUrl);
        if (urlMapping.isPresent()) {
            UrlMapping mapping = urlMapping.get();
            mapping.setClickCount(mapping.getClickCount() + 1);
            urlMappingRepo.save(mapping);

            // Create a click event record
            ClickEvent clickEvent = new ClickEvent();
            clickEvent.setClickDate(LocalDateTime.now());
            clickEvent.setUrlMapping(mapping);
            clickEventRepo.save(clickEvent);

            return mapping.getOriginalUrl();
        }
        return null;
    }

    public List<ClickEventDtos> getClickEvents(String shortUrl, LocalDateTime start, LocalDateTime end) {
        Optional<UrlMapping> urlMappingOpt = urlMappingRepo.findByShortUrl(shortUrl);
        if (urlMappingOpt.isEmpty()) {
            return new ArrayList<>();
        }

        UrlMapping urlMapping = urlMappingOpt.get();
        List<Object[]> results = clickEventRepo.findClickEventStatsByUrlMappingAndDateRange(urlMapping, start, end);

        return results.stream()
                .map(result -> {
                    ClickEventDtos dto = new ClickEventDtos();
                    dto.setClickDate((LocalDateTime) result[0]);
                    dto.setCount((Long) result[1]);
                    return dto;
                })
                .toList();
    }

    public boolean doesUrlBelongToUser(String shortUrl, User user) {
        Optional<UrlMapping> urlMapping = urlMappingRepo.findByShortUrl(shortUrl);
        return urlMapping.isPresent() && urlMapping.get().getUser().getId().equals(user.getId());
    }
}
