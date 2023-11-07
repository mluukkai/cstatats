from kauppa import Kauppa
from kirjanpito import kirjanpito
from varasto import varasto
from pankki import pankki
from viitegeneraattori import viitegeneraattori


def main():
    kauppa = Kauppa(varasto, pankki, viitegeneraattori)

    # kauppa hoitaa yhden asiakkaan kerrallaan seuraavaan tapaan:
    kauppa.aloita_asiointi()
    kauppa.lisaa_koriin(1)
    kauppa.lisaa_koriin(1)
    kauppa.poista_korista(1)
    kauppa.tilimaksu("Pekka Mikkola", "1234-12345")

    # kirjanpito
    for tapahtuma in kirjanpito.tapahtumat:
        print(tapahtuma)


if __name__ == "__main__":
    main()
