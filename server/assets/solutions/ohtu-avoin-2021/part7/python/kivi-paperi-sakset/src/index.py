from kps import kps_versio

def main():
    while True:
        print("Valitse pelataanko"
              "\n (a) Ihmistä vastaan"
              "\n (b) Tekoälyä vastaan"
              "\n (c) Parannettua tekoälyä vastaan"
              "\nMuilla valinnoilla lopetetaan"
              )

        vastaus = input()

        if "abc".index(vastaus) == -1:
            break
        
        print("Peli loppuu kun pelaaja antaa virheellisen siirron eli jonkun muun kuin k, p tai s")
        kps_versio(vastaus).pelaa()

if __name__ == "__main__":
    main()
