package com.naammm.portfolioservice.repository;

import com.naammm.portfolioservice.model.AIPersonality;
import com.naammm.portfolioservice.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AIPersonalityRepository extends JpaRepository<AIPersonality, UUID> {
    Optional<AIPersonality> findByPortfolio(Portfolio portfolio);
    Optional<AIPersonality> findByPortfolioId(UUID portfolioId);
}
