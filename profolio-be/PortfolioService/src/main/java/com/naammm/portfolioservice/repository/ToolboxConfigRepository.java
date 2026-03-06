package com.naammm.portfolioservice.repository;

import com.naammm.portfolioservice.model.Portfolio;
import com.naammm.portfolioservice.model.ToolboxConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ToolboxConfigRepository extends JpaRepository<ToolboxConfig, UUID> {
    Optional<ToolboxConfig> findByPortfolio(Portfolio portfolio);
}
