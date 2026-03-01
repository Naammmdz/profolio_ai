package com.naammm.portfolioservice.repository;

import com.naammm.portfolioservice.model.Portfolio;
import com.naammm.portfolioservice.model.SuggestedQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SuggestedQuestionRepository extends JpaRepository<SuggestedQuestion, UUID> {
    List<SuggestedQuestion> findByPortfolio(Portfolio portfolio);
    List<SuggestedQuestion> findByPortfolioId(UUID portfolioId);
}
