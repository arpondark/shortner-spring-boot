package com.arpon007.shortner.repo;

import com.arpon007.shortner.models.ClickEvent;
import com.arpon007.shortner.models.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ClickEventRepo extends JpaRepository<ClickEvent, Long> {

    List<ClickEvent> findByUrlMappingAndClickDateBetween(
            UrlMapping urlMapping,
            LocalDateTime start,
            LocalDateTime end
    );

    @Query("SELECT DATE(c.clickDate) as clickDate, COUNT(c) as count " +
           "FROM ClickEvent c " +
           "WHERE c.urlMapping = :urlMapping " +
           "AND c.clickDate BETWEEN :start AND :end " +
           "GROUP BY DATE(c.clickDate) " +
           "ORDER BY DATE(c.clickDate)")
    List<Object[]> findClickEventStatsByUrlMappingAndDateRange(
            @Param("urlMapping") UrlMapping urlMapping,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
