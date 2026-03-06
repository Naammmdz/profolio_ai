package com.naammm.portfolioservice.repository;

import com.naammm.portfolioservice.model.Portfolio;
import com.naammm.portfolioservice.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByPortfolioOrderByDisplayOrderAsc(Portfolio portfolio);
}
