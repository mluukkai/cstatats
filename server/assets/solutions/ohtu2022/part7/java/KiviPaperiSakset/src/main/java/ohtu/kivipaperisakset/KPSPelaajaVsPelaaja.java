package ohtu.kivipaperisakset;

import java.util.Scanner;

public class KPSPelaajaVsPelaaja extends KiviPaperiSakset {

    private static final Scanner scanner = new Scanner(System.in);

    @Override
    protected String toisenSiirto() {
        System.out.println("Toisen pelaajan siirto: ");
        return scanner.nextLine();
    }
}