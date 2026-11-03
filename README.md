# Site d'accompagnement du Parcours IA

Site compagnon de la formation Parcours IA — Université Paris-Saclay, IFPOC.

Les modules en ligne (dépôt **Parcours IA**, diffusés sur le LMS en SCORM) couvrent les moments où l'agent **apprend**. Ce site couvre ceux où il **fait** : préparer l'atelier, appliquer sur sa tâche, résoudre un blocage, entretenir ses acquis. Il s'adresse à trois publics : les participants, les doctorants animateurs et les responsables de service.

Tout fonctionne dans le navigateur : rien de ce que l'on saisit n'est envoyé ; cases cochées et brouillons restent dans le stockage local de l'appareil.

## Prérequis

Uniquement Python 3 (déjà présent sur macOS) et un navigateur. Aucune dépendance à installer.

## Commandes

| Commande | Effet |
|---|---|
| `./build.sh` | Assemble les pages : `pages/*.html` → `*.html` à la racine (en-tête, menu et pied communs) |
| `./serve.sh` | Sert le site sur <http://localhost:8001/> |

## Publication sur GitHub

Le site est publié par GitHub Pages **directement depuis la branche `main`** (réglage : Settings → Pages → Deploy from a branch → `main` / racine).

Les pages générées sont donc versionnées. **Après toute modification d'une page source : lancer `./build.sh`, puis committer.** Le workflow `.github/workflows/verifier.yml` vérifie à chaque `push` que les pages sont à jour.

## Organisation

```text
pages/*.html              SOURCE des pages (en-tête titre/description/menu + contenu de <main>)
*.html                    pages complètes (GÉNÉRÉ par ./build.sh)
css/accompagnement.css    mise en page, charte graphique Université Paris-Saclay
js/accompagnement.js      outils interactifs (prompt, données, mini-défis, progression)
js/cas-usage.js           bibliothèque de cas d'usage (exemples fictifs à remplacer)
img/                      logo officiel en défonce, à déposer (voir docs/conception.md)
scripts/construire.py     assemblage des pages (Python, sans dépendance)
docs/conception.md        choix de conception
```

## À compléter

Les éléments manquants sont signalés en orange sur les pages : liens LinkedIn Learning, **lien du cours sur le LMS** (constante `LIEN_LMS` dans `scripts/construire.py`), formulaires, quiz, contacts, textes de référence, logo officiel.
