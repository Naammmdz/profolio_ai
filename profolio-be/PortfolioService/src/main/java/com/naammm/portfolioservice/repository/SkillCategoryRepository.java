package com.naammm.portfolioservice.repository;

import com.naammm.portfolioservice.model.Portfolio;
import com.naammm.portfolioservice.model.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SkillCategoryRepository extends JpaRepository<SkillCategory, UUID> {
    List<SkillCategory> findByPortfolioOrderByDisplayOrderAsc(Portfolio portfolio);
}
