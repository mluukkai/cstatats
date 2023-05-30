class Tuote:
  def __init__(self, nimi: str, hinta: int):
      self._nimi = nimi
      self._hinta = hinta
      self._saldo = 0

  def hinta(self):
    return self._hinta

  def nimi(self):
    return self._nimi

  def __repr__(self):
      return f"{self._nimi} hinta {self._hinta} euroa"
