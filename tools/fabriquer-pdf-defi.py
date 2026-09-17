# -*- coding: utf-8 -*-
"""
Refait les quatre PDF du Défi 30 Jours à partir de leurs pages HTML.

    python tools/fabriquer-pdf-defi.py

  defi/kit-de-depart.html        -> Schicgirl-Defi-30-jours-Kit-de-depart.pdf
                                  -> Schicgirl-Defi-30-jours-Kit-de-depart-a-imprimer.pdf
  defi/calendrier-30-jours.html  -> Schicgirl-Defi-30-jours-Calendrier.pdf
                                  -> Schicgirl-Defi-30-jours-Calendrier-a-imprimer.pdf

La version « à imprimer » est la même page ouverte avec ?impression=1 :
fond blanc, peu d'encre.

Les pages ont une hauteur fixe : un contenu trop long ne crée pas de page
en plus, il est coupé. Regarde donc les PDF après chaque modification.
"""
import os, pathlib, subprocess, sys

ICI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFI = os.path.join(ICI, "defi")
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PDFS = [
    ("kit-de-depart.html", "", "Schicgirl-Defi-30-jours-Kit-de-depart.pdf", 4),
    ("kit-de-depart.html", "?impression=1", "Schicgirl-Defi-30-jours-Kit-de-depart-a-imprimer.pdf", 4),
    ("calendrier-30-jours.html", "", "Schicgirl-Defi-30-jours-Calendrier.pdf", 2),
    ("calendrier-30-jours.html", "?impression=1", "Schicgirl-Defi-30-jours-Calendrier-a-imprimer.pdf", 2),
]

for source, option, sortie, attendu in PDFS:
    pdf = os.path.join(DEFI, sortie)
    if os.path.exists(pdf):
        os.remove(pdf)
    url = pathlib.Path(DEFI, source).as_uri() + option
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                    "--allow-file-access-from-files", "--virtual-time-budget=15000",
                    "--print-to-pdf=" + pdf, url], capture_output=True, timeout=180)
    if not os.path.exists(pdf):
        sys.exit("%s%s : le PDF n'a pas été produit" % (source, option))
    try:
        import fitz
        n = fitz.open(pdf).page_count
        etat = "OK" if n == attendu else "ATTENTION : %d pages au lieu de %d" % (n, attendu)
    except ImportError:
        n, etat = "?", "PyMuPDF absent, nombre de pages non vérifié"
    print("%-56s %s pages · %.0f Ko · %s" % (sortie, n, os.path.getsize(pdf) / 1024, etat))
