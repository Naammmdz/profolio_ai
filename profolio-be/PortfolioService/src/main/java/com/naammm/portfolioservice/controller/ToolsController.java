package com.naammm.portfolioservice.controller;

import com.naammm.portfolioservice.dto.ProjectDto;
import com.naammm.portfolioservice.dto.SkillCategoryDto;
import com.naammm.portfolioservice.dto.ToolboxConfigDto;
import com.naammm.portfolioservice.service.ToolsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ToolsController {

    private final ToolsService toolsService;

    // ─── Toolbox Config ──────────────────────────────────────

    @GetMapping("/tools/config")
    public ResponseEntity<ToolboxConfigDto> getToolboxConfig(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(toolsService.getToolboxConfig(jwt.getSubject()));
    }

    @PutMapping("/tools/config")
    public ResponseEntity<ToolboxConfigDto> updateToolboxConfig(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody ToolboxConfigDto dto) {
        return ResponseEntity.ok(toolsService.updateToolboxConfig(jwt.getSubject(), dto));
    }

    // ─── Projects ────────────────────────────────────────────

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDto>> getProjects(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(toolsService.getProjects(jwt.getSubject()));
    }

    @PostMapping("/projects")
    public ResponseEntity<ProjectDto> createProject(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody ProjectDto dto) {
        return ResponseEntity.ok(toolsService.createProject(jwt.getSubject(), dto));
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<ProjectDto> updateProject(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @RequestBody ProjectDto dto) {
        return ResponseEntity.ok(toolsService.updateProject(jwt.getSubject(), id, dto));
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Void> deleteProject(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id) {
        toolsService.deleteProject(jwt.getSubject(), id);
        return ResponseEntity.noContent().build();
    }

    // ─── Skill Categories ────────────────────────────────────

    @GetMapping("/skills")
    public ResponseEntity<List<SkillCategoryDto>> getSkillCategories(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(toolsService.getSkillCategories(jwt.getSubject()));
    }

    @PostMapping("/skills")
    public ResponseEntity<SkillCategoryDto> createSkillCategory(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody SkillCategoryDto dto) {
        return ResponseEntity.ok(toolsService.createSkillCategory(jwt.getSubject(), dto));
    }

    @PutMapping("/skills/{id}")
    public ResponseEntity<SkillCategoryDto> updateSkillCategory(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @RequestBody SkillCategoryDto dto) {
        return ResponseEntity.ok(toolsService.updateSkillCategory(jwt.getSubject(), id, dto));
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<Void> deleteSkillCategory(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id) {
        toolsService.deleteSkillCategory(jwt.getSubject(), id);
        return ResponseEntity.noContent().build();
    }
}
