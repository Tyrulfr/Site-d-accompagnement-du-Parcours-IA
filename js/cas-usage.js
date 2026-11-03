/*
 * Bibliothèque de cas d'usage.
 * EXEMPLES FICTIFS DE DÉMONSTRATION : à remplacer par les fiches cas d'usage
 * validées et anonymisées des sessions pilotes (sélection par l'IFPOC).
 *
 * Champs : metier, titre, tache, outil, prompt, verification, precautions, gain,
 * decision ("adopte" | "precautions" | "non").
 */
window.CAS_USAGE = [
  {
    metier: 'Secrétariat et accueil',
    titre: 'Compte rendu de réunion de service',
    tache: 'Mettre au propre des notes prises pendant une réunion d\'équipe.',
    outil: 'Outil autorisé',
    prompt: 'Contexte : je suis assistante de direction dans un service administratif. Voici mes notes brutes d\'une réunion d\'équipe (les personnes sont désignées par leur fonction).\n\nTa tâche : rédige un compte rendu structuré en trois parties : décisions prises, actions à mener (qui, quoi, quand), points reportés.\n\nAppuie-toi uniquement sur mes notes. Si une information manque, signale-la entre crochets au lieu de l\'inventer.\n\nFormat attendu : une page maximum, phrases courtes, style neutre.',
    verification: 'Relecture ligne à ligne avec les notes ; chaque décision et chaque échéance sont confirmées par l\'animateur de la réunion.',
    precautions: 'Les noms sont remplacés par les fonctions avant la saisie, puis remis à la main.',
    gain: 'Environ 30 min par compte rendu.',
    decision: 'adopte'
  },
  {
    metier: 'Gestion de laboratoire',
    titre: 'Courriel de relance fournisseur',
    tache: 'Relancer un fournisseur pour une commande en retard.',
    outil: 'Outil autorisé',
    prompt: 'Contexte : je suis gestionnaire dans un laboratoire de recherche. J\'écris à un fournisseur dont la commande n° [numéro] a trois semaines de retard.\n\nTa tâche : rédige un courriel de relance courtois et ferme.\n\nFormat attendu : 8 lignes maximum, vouvoiement, rappel du numéro de commande, demande d\'une date de livraison ferme avant le [date].',
    verification: 'Relecture du ton et des éléments obligatoires (numéro, date limite).',
    precautions: 'Aucune ; le numéro de commande est ajouté à la main.',
    gain: 'Environ 10 min par relance, surtout utile pour les relances en anglais.',
    decision: 'adopte'
  },
  {
    metier: 'Scolarité',
    titre: 'Réponse type aux questions fréquentes des étudiants',
    tache: 'Préparer des réponses types sur les modalités d\'inscription, à partir du règlement publié.',
    outil: 'Outil autorisé',
    prompt: 'Contexte : je travaille au service de scolarité. Voici l\'extrait du règlement des études publié sur le site de l\'université.\n\nTa tâche : propose des réponses types aux 5 questions suivantes, en t\'appuyant uniquement sur cet extrait. Si la réponse n\'y figure pas, écris « non prévu par le règlement ».\n\nFormat attendu : une réponse de 3 à 5 lignes par question, langage simple, vouvoiement.',
    verification: 'Chaque réponse est comparée au règlement ; validation par la responsable de scolarité avant usage.',
    precautions: 'Uniquement à partir de textes publiés ; aucune situation individuelle d\'étudiant.',
    gain: 'Une demi-journée de rédaction initiale, puis des réponses plus homogènes.',
    decision: 'precautions'
  },
  {
    metier: 'Ressources humaines',
    titre: 'Fiche de poste à partir d\'une trame',
    tache: 'Rédiger une première version de fiche de poste pour un recrutement.',
    outil: 'Outil autorisé',
    prompt: 'Contexte : je suis chargée de recrutement dans une université. Voici la trame de nos fiches de poste et les missions décrites par le service.\n\nTa tâche : rédige une fiche de poste en respectant la trame.\n\nFormat attendu : rédaction épicène (« la ou le titulaire »), pas d\'adjectifs genrés, compétences classées en savoirs, savoir-faire, savoir-être.',
    verification: 'Relecture avec la grille des biais (genre, âge) ; validation par le responsable du service recruteur.',
    precautions: 'La consigne épicène est indispensable : sans elle, l\'outil a produit des formulations stéréotypées.',
    gain: 'Environ 45 min par fiche.',
    decision: 'precautions'
  },
  {
    metier: 'Ressources humaines',
    titre: 'Synthèse des entretiens professionnels',
    tache: 'Faire la synthèse des comptes rendus d\'entretiens professionnels d\'une équipe.',
    outil: 'Aucun',
    prompt: '(Pas de prompt : cas non retenu.)',
    verification: 'Sans objet.',
    precautions: 'Les entretiens contiennent des appréciations sur des personnes : données à ne pas saisir, même anonymisées.',
    gain: 'Aucun : la préparation pour retirer les données identifiantes prendrait plus de temps que la synthèse.',
    decision: 'non'
  },
  {
    metier: 'Finances',
    titre: 'Explication d\'un écart budgétaire',
    tache: 'Rédiger la note expliquant un écart entre budget prévu et réalisé.',
    outil: 'Outil autorisé',
    prompt: 'Contexte : je suis gestionnaire financière. Voici les montants prévus et réalisés par poste (déjà calculés dans mon tableur) et mes explications en vrac.\n\nTa tâche : rédige une note de synthèse de l\'écart pour ma direction, en reprenant exactement mes chiffres.\n\nFormat attendu : une demi-page, un paragraphe par poste significatif, pas de nouveau calcul.',
    verification: 'Tous les chiffres sont contrôlés contre le tableur ; aucun calcul n\'est demandé à l\'IA.',
    precautions: 'Les calculs restent dans le tableur ; l\'IA ne sert qu\'à la rédaction.',
    gain: 'Environ 20 min par note.',
    decision: 'precautions'
  },
  {
    metier: 'Communication',
    titre: 'Déclinaison d\'une actualité pour plusieurs supports',
    tache: 'Adapter un article publié sur le site en version courte pour la lettre interne et l\'intranet.',
    outil: 'Outil autorisé',
    prompt: 'Contexte : je suis chargé de communication. Voici un article déjà publié sur notre site.\n\nTa tâche : propose une version de 400 signes pour la lettre interne et un titre accrocheur de 10 mots maximum pour l\'intranet.\n\nFormat attendu : ton informatif, aucun ajout d\'information absente de l\'article.',
    verification: 'Comparaison avec l\'article d\'origine : aucun fait ajouté ou déformé.',
    precautions: 'Uniquement à partir de contenus publiés.',
    gain: 'Environ 15 min par actualité.',
    decision: 'adopte'
  },
  {
    metier: 'Patrimoine et logistique',
    titre: 'Planning des permanences',
    tache: 'Construire le planning des permanences d\'été de l\'équipe.',
    outil: 'Outil autorisé',
    prompt: 'Contexte : j\'organise les permanences d\'été d\'une équipe de 6 agents (désignés A à F). Voici les contraintes : [contraintes sans motif d\'absence].\n\nTa tâche : propose un planning qui assure 2 présents par jour du 7 juillet au 29 août.\n\nFormat attendu : un tableau semaine par semaine.',
    verification: 'Contrôle dans le tableur que chaque jour compte bien 2 présents ; l\'outil a fait des erreurs de comptage.',
    precautions: 'Lettres à la place des prénoms ; aucun motif d\'absence (congé maladie, etc.) dans la saisie.',
    gain: 'Faible : la vérification a pris presque autant de temps que la construction à la main.',
    decision: 'non'
  }
];
