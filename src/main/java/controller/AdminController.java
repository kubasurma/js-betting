package com.jsbetting.controller;

import com.jsbetting.model.Tip;
import com.jsbetting.model.TipStatus;
import com.jsbetting.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/tips")
    public Tip createTip(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @Valid @RequestBody Tip tip
    ) {
        return adminService.createTip(authorizationHeader, tip);
    }

    @GetMapping("/tips")
    public List<Tip> getAllTips(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        return adminService.getAllTips(authorizationHeader);
    }

    @PutMapping("/tips/{tipId}")
    public Tip updateTip(
            @PathVariable Long tipId,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @Valid @RequestBody Tip updatedTip
    ) {
        return adminService.updateTip(authorizationHeader, tipId, updatedTip);
    }

    @DeleteMapping("/tips/{tipId}")
    public String deleteTip(
            @PathVariable Long tipId,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        adminService.deleteTip(tipId, authorizationHeader);

        return "Typ usunięty przez admina";
    }

    @PatchMapping("/tips/{tipId}/status")
    public Tip updateTipStatus(
            @PathVariable Long tipId,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestParam TipStatus status
    ) {
        return adminService.updateTipStatus(authorizationHeader, tipId, status);
    }

    @PatchMapping("/tips/{tipId}/visibility")
    public Tip updateTipVisibility(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long tipId,
            @RequestParam Boolean visible
    ) {
        return adminService.updateTipVisibility(tipId, visible, authorizationHeader);
    }
}