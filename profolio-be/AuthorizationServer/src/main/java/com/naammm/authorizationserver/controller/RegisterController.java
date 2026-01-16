package com.naammm.authorizationserver.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller to serve the register page
 */
@Controller
public class RegisterController {

    @Value("${app.frontend.base-url:http://localhost:3000}")
    private String frontendBaseUrl;

    @Value("${app.frontend.login-url:http://localhost:9000/login}")
    private String frontendLoginUrl;

    /**
     * Serve the register page template
     */
    @GetMapping("/register")
    public String register(Model model) {
        model.addAttribute("frontendBaseUrl", frontendBaseUrl);
        model.addAttribute("frontendLoginUrl", frontendLoginUrl);
        return "register"; // Returns register.html template from templates folder
    }
}
