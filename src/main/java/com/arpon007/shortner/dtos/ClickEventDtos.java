package com.arpon007.shortner.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ClickEventDtos {
    private LocalDateTime clickDate;
    private Long count;
}
