#!/usr/bin/env python3
"""Assemble le site d'accompagnement : pages/*.html -> *.html (racine du dépôt).

Chaque page source commence par trois lignes d'en-tête :

    titre: Avant l'atelier
    description: Préparer sa matinée d'atelier IA.
    menu: avant

suivies d'une ligne vide puis du contenu de <main>. Le script ajoute l'en-tête,
la navigation (avec la page courante signalée) et le pied, communs à toutes les pages.
Aucune dépendance : Python 3 seul.
"""
import html
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
SOURCES = RACINE / "pages"
SORTIE = RACINE
# Logo officiel en défonce (blanc, .png RVB), fourni par la direction de la communication.
# La charte interdit de le redessiner : tant que le fichier manque, l'en-tête n'affiche que le nom.
LOGO = "img/logo-universite-paris-saclay-defonce.png"
# Cours du Parcours IA sur le LMS (Moodle / eCampus) : c'est là que les modules sont suivis.
# Tant qu'il est vide, les liens vers les modules sont signalés « à compléter ».
LIEN_LMS = ""

MENU = [
    ("accueil", "index.html", "Accueil"),
    ("avant", "avant.html", "Avant l'atelier"),
    ("jour-j", "jour-j.html", "Le jour J"),
    ("apres", "apres.html", "Après l'atelier"),
    ("outils", "boite-a-outils.html", "Boîte à outils"),
    ("cas", "cas-usage.html", "Cas d'usage"),
    ("reperes", "reperes.html", "Repères"),
]
ESPACES = [
    ("animateurs", "animateurs.html", "Espace animateurs"),
    ("responsables", "responsables.html", "Responsables de service"),
]

GABARIT = """<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titre} · Parcours IA</title>
<meta name="description" content="{description}">
<link rel="stylesheet" href="css/accompagnement.css">
{scripts}</head>
<body>
<!-- GÉNÉRÉ par scripts/construire.py depuis pages/{source} : ne pas modifier ici. -->
<a class="lien-evitement" href="#contenu">Aller au contenu</a>
<header class="entete">
  <div class="entete-inner">
    <div class="entete-identite">
{logo}      <div>
        <span class="entete-institution">Université Paris-Saclay · IFPOC</span>
        <a class="entete-titre" href="index.html">Parcours IA · accompagnement</a>
      </div>
    </div>
    <nav class="entete-profils" aria-label="Espaces dédiés">
{espaces}
    </nav>
  </div>
</header>
<nav class="nav" aria-label="Navigation principale">
  <ul>
{menu}
  </ul>
</nav>
<main id="contenu" tabindex="-1">
{contenu}
</main>
<footer class="pied">
  <ul>
{pied}
  </ul>
  <p>Site d'accompagnement du Parcours IA, version pilote. Les outils de cette page fonctionnent dans votre navigateur : rien de ce que vous saisissez n'est envoyé.</p>
  <p>{lien_modules}</p>
</footer>
<script src="js/accompagnement.js"></script>
</body>
</html>
"""


def lien(cle, cible, libelle, courant, retrait):
    attr = ' aria-current="page"' if cle == courant else ""
    return f'{retrait}<a href="{cible}"{attr}>{html.escape(libelle)}</a>'


def lien_modules(libelle, classe=""):
    if not LIEN_LMS:
        return f'<span class="a-completer">{html.escape(libelle)} : lien du cours sur le LMS à compléter.</span>'
    attr = f' class="{classe}"' if classe else ""
    return f'<a{attr} href="{html.escape(LIEN_LMS)}">{html.escape(libelle)}</a>'


def assembler(source: Path) -> str:
    texte = source.read_text(encoding="utf-8")
    entete, _, contenu = texte.partition("\n\n")
    meta = {}
    for ligne in entete.splitlines():
        cle, _, valeur = ligne.partition(":")
        meta[cle.strip()] = valeur.strip()
    for cle in ("titre", "description", "menu"):
        if not meta.get(cle):
            raise ValueError(f"{source.name} : ligne « {cle}: » manquante dans l'en-tête")
    courant = meta["menu"]
    scripts = "".join(
        f'<script src="js/{nom.strip()}" defer></script>\n'
        for nom in meta.get("scripts", "").split(",") if nom.strip()
    )
    # {{lien_modules}} dans une page source : bouton vers le cours LMS.
    contenu = contenu.replace("{{lien_modules}}", lien_modules("Ouvrir les modules en ligne", "bouton bouton-plein"))
    return GABARIT.format(
        titre=html.escape(meta["titre"]),
        description=html.escape(meta["description"]),
        source=source.name,
        scripts=scripts,
        espaces="\n".join(lien(c, f, l, courant, "      ") for c, f, l in ESPACES),
        menu="\n".join(f"    <li>{lien(c, f, l, courant, '')}</li>" for c, f, l in MENU),
        pied="\n".join(f"    <li>{lien(c, f, l, courant, '')}</li>" for c, f, l in MENU + ESPACES),
        contenu=contenu.strip(),
        lien_modules=lien_modules("Modules en ligne de la formation"),
        logo=(f'      <img class="entete-logo" src="{LOGO}" alt="Université Paris-Saclay">\n'
              if (SORTIE / LOGO).exists() else ""),
    )


def main() -> int:
    pages = sorted(SOURCES.glob("*.html"))
    if not pages:
        print("Aucune page dans pages/", file=sys.stderr)
        return 1
    cibles = {f for _, f, _ in MENU + ESPACES}
    for source in pages:
        if source.name not in cibles:
            print(f"Attention : {source.name} n'est dans aucun menu", file=sys.stderr)
        (SORTIE / source.name).write_text(assembler(source), encoding="utf-8")
    print(f"Site d'accompagnement : {len(pages)} pages générées à la racine")
    return 0


if __name__ == "__main__":
    sys.exit(main())
