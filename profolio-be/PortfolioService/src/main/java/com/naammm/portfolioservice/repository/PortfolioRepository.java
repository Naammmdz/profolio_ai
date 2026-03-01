package com.naammm.portfolioservice.repository;

import com.naammm.portfolioservice.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, UUID> {
    Optional<Portfolio> findByUserId(UUID userId);
    Optional<Portfolio> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
