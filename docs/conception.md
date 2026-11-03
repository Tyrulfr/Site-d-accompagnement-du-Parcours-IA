# Dossier de conception — Site d'accompagnement du Parcours IA

## 1. Rôle du site

Les modules en ligne couvrent les moments où l'on **apprend** (découvrir, approfondir). Le site d'accompagnement couvre ceux où l'on **fait** : appliquer sur sa tâche, résoudre un blocage, s'adapter quand l'outil change (les « 5 moments de besoin » de Mosher et Gottfredson). Choix qui en découlent :

- **aide à la performance** : des fiches courtes, lisibles sur téléphone, à deux clics de l'accueil (prompt, données, vérification, anonymisation, boussole) ;
- **transfert** : un parcours avant / jour J / après visible, et une page pour les responsables de service, dont le soutien pèse lourd dans l'application de ce qui est appris ;
- **rappels espacés** : trois mini-défis à J+3, J+7 et J+15, qui préparent aussi au quiz du badge ;
- **communauté de pratique** : une bibliothèque de cas d'usage par métier, alimentée par l'IFPOC à partir des fiches validées (pas de dépôt direct par les participants : pas de données personnelles à gérer).

Tout fonctionne dans le navigateur : rien n'est envoyé ; les cases cochées et les brouillons restent dans le stockage local de l'appareil.

## 2. Lien avec les modules

Les modules sont dans un dépôt séparé (**Parcours IA**) et diffusés aux agents sur le LMS en SCORM 1.2 : c'est le seul endroit où leur suivi est officiel (et où les animateurs peuvent voir qui a fait le module de préparation). Le site renvoie donc vers le **cours sur le LMS**, jamais vers la version web des modules, réservée aux essais et démonstrations. L'adresse se règle une fois dans `LIEN_LMS` (`scripts/construire.py`) ; dans une page source, `{{lien_modules}}` produit le bouton correspondant.

## 3. Charte graphique

Le site suit la charte de l'Université Paris-Saclay (mars 2020) : prune Pantone 229 (#63003C), couleurs de texte et d'état prises dans la palette secondaire, police Open Sans avec ses substituts officiels (Segoe UI, Tahoma), nom de marque jamais en capitales. Les teintes claires sont des dérivés d'écran, choisies pour garder un contraste AA. Le logo n'est pas redessiné : l'en-tête l'affiche dès que le fichier officiel en défonce est déposé dans `img/logo-universite-paris-saclay-defonce.png`.

## 4. Rédaction

Les pages se rédigent dans `pages/` ; `./build.sh` les assemble avec l'en-tête, le menu et le pied communs. Les éléments à compléter sont signalés en orange (`<span class="a-completer">`).
