package com.arpon007.shortner.repo;

import com.arpon007.shortner.models.UrlMapping;
import com.arpon007.shortner.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlMappingRepo extends JpaRepository<UrlMapping, Long> {

    Optional<UrlMapping> findByShortUrl(String shortUrl);

    List<UrlMapping> findByUser(User user);

}
