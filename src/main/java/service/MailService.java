package com.jsbetting.service;

import com.jsbetting.model.Purchase;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    public void sendPurchaseConfirmation(Purchase purchase) {
        String email = purchase.getAppUser().getEmail();
        String firstName = purchase.getAppUser().getFirstName();

        String homeTeam = purchase.getTip().getHomeTeam();
        String awayTeam = purchase.getTip().getAwayTeam();
        String pick = purchase.getTip().getPick();
        String odds = purchase.getTip().getOdds().toString();
        String analysis = purchase.getTip().getAnalysis();
        String pricePaid = purchase.getPricePaid().toString();

        System.out.println("====================================");
        System.out.println("MAIL DO: " + email);
        System.out.println("TEMAT: Potwierdzenie zakupu typu - JS Betting");
        System.out.println("------------------------------------");
        System.out.println("Cześć " + firstName + ",");
        System.out.println();
        System.out.println("Dziękujemy za zakup typu w JS Betting.");
        System.out.println();
        System.out.println("Mecz: " + homeTeam + " vs " + awayTeam);
        System.out.println("Typ: " + pick);
        System.out.println("Kurs: " + odds);
        System.out.println("Analiza: " + analysis);
        System.out.println();
        System.out.println("Cena: " + pricePaid + " zł");
        System.out.println();
        System.out.println("Powodzenia!");
        System.out.println("====================================");
    }
}