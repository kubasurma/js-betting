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
            @RequestParam Long adminId,
            @Valid @RequestBody Tip tip
    ) {
        return adminService.createTip(adminId, tip);
    }

    @GetMapping("/tips")
    public List<Tip> getAllTips(@RequestParam Long adminId) {
        return adminService.getAllTips(adminId);
    }

    @PatchMapping("/tips/{tipId}/status")
    public Tip updateTipStatus(
            @PathVariable Long tipId,
            @RequestParam Long adminId,
            @RequestParam TipStatus status
    ) {
        return adminService.updateTipStatus(adminId, tipId, status);
    }

    @PutMapping("/tips/{tipId}")
    public Tip updateTip(
            @PathVariable Long tipId,
            @RequestParam Long adminId,
            @Valid @RequestBody Tip updatedTip
    ) {
        return adminService.updateTip(adminId, tipId, updatedTip);
    }

    @DeleteMapping("/tips/{tipId}")
    public String deleteTip(
            @PathVariable Long tipId,
            @RequestParam Long adminId
    ) {
        adminService.deleteTip(adminId, tipId);

        return "Typ usunięty przez admina";
    }


}