package ohtu.kivipaperisakset;

import java.util.Scanner;

public class Paaohjelma {

    private static final Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
         
        while (true) {
            System.out.println("\nValitse pelataanko"
                    + "\n (a) ihmistä vastaan "
                    + "\n (b) tekoälyä vastaan"
                    + "\n (c) parannettua tekoälyä vastaan"
                    + "\nmuilla valinnoilla lopetataan");

            String valinta = scanner.nextLine();
            System.out.println("abc".contains(valinta));
            if (!"abc".contains(valinta)) {
                System.out.println("*");
                break;
            }

            KiviPaperiSakset peli = KiviPaperiSakset.peli(valinta);
            peli.pelaa();

        }

    }
}
