/*
 * Site d'accompagnement du Parcours IA : petits outils interactifs.
 * Aucune donnée ne quitte le navigateur. Ce qui est mémorisé (cases cochées,
 * notes personnelles) reste dans le stockage local de l'appareil.
 */
(function () {
  'use strict';

  var PREFIXE = 'ups-pia-accompagnement:v1:';

  // ---------- Stockage local (peut être indisponible : navigation privée…) ----------

  function lire(cle) {
    try { return window.localStorage.getItem(PREFIXE + cle); } catch (e) { return null; }
  }
  function ecrire(cle, valeur) {
    try { window.localStorage.setItem(PREFIXE + cle, valeur); } catch (e) { /* tant pis : l'outil marche sans mémoire */ }
  }

  function el(tag, attrs, enfants) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'texte') n.textContent = attrs[k];
      else if (k === 'classe') n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (enfants || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }

  // ---------- Cases à cocher mémorisées et barres de progression ----------

  function majProgressions() {
    document.querySelectorAll('[data-progression]').forEach(function (barre) {
      var groupe = barre.getAttribute('data-progression');
      var cases = document.querySelectorAll('input[data-groupe="' + groupe + '"]');
      var faites = Array.prototype.filter.call(cases, function (c) { return c.checked; }).length;
      var pct = cases.length ? Math.round((faites / cases.length) * 100) : 0;
      var jauge = barre.querySelector('span');
      if (jauge) jauge.style.width = pct + '%';
      barre.setAttribute('aria-valuenow', String(pct));
      var libelle = document.querySelector('[data-libelle-progression="' + groupe + '"]');
      if (libelle) libelle.textContent = faites + ' sur ' + cases.length;
    });
  }

  function initMemoire() {
    document.querySelectorAll('input[type="checkbox"][data-memoire]').forEach(function (c) {
      var cle = c.getAttribute('data-memoire');
      c.checked = lire(cle) === '1';
      c.addEventListener('change', function () {
        ecrire(cle, c.checked ? '1' : '0');
        majProgressions();
      });
    });
    document.querySelectorAll('textarea[data-memoire], input[type="text"][data-memoire]').forEach(function (champ) {
      var cle = champ.getAttribute('data-memoire');
      var valeur = lire(cle);
      if (valeur) champ.value = valeur;
      champ.addEventListener('input', function () { ecrire(cle, champ.value); });
    });
    majProgressions();
  }

  // ---------- Copier dans le presse-papiers ----------

  function copier(texte, bouton) {
    var fini = function (ok) {
      var avant = bouton.textContent;
      bouton.textContent = ok ? 'Copié' : 'Copie impossible : sélectionnez le texte';
      setTimeout(function () { bouton.textContent = avant; }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texte).then(function () { fini(true); }, function () { fini(false); });
    } else {
      fini(false);
    }
  }

  function initCopie() {
    document.querySelectorAll('[data-copier]').forEach(function (b) {
      b.addEventListener('click', function () {
        var cible = document.getElementById(b.getAttribute('data-copier'));
        if (cible) copier(cible.textContent, b);
      });
    });
  }

  // ---------- Impression ----------

  function initImpression() {
    document.querySelectorAll('[data-imprimer]').forEach(function (b) {
      b.addEventListener('click', function () { window.print(); });
    });
  }

  // ---------- Constructeur de prompt ----------

  function initConstructeur() {
    var form = document.getElementById('constructeur-prompt');
    if (!form) return;
    var sortie = document.getElementById('prompt-resultat');
    var zone = document.getElementById('prompt-zone');
    var erreur = document.getElementById('prompt-erreur');
    var consigne = form.elements.consigne;

    consigne.addEventListener('input', function () { erreur.textContent = ''; consigne.removeAttribute('aria-invalid'); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!consigne.value.trim()) {
        erreur.textContent = 'Écrivez au moins la consigne : ce que vous voulez obtenir.';
        consigne.setAttribute('aria-invalid', 'true');
        consigne.focus();
        return;
      }
      var parties = [];
      var contexte = form.elements.contexte.value.trim();
      var format = form.elements.format.value.trim();
      var source = form.elements.source.value.trim();
      if (contexte) parties.push('Contexte : ' + contexte);
      parties.push('Ta tâche : ' + consigne.value.trim());
      if (source) parties.push('Appuie-toi uniquement sur le texte suivant :\n"""\n' + source + '\n"""');
      if (format) parties.push('Format attendu : ' + format);
      parties.push('Si une information te manque, pose-moi la question au lieu de l\'inventer.');
      sortie.textContent = parties.join('\n\n');
      zone.hidden = false;
      zone.focus();
    });
  }

  // ---------- « Puis-je saisir cette donnée ? » ----------

  function initTriage() {
    var form = document.getElementById('triage-donnees');
    if (!form) return;
    var res = document.getElementById('triage-resultat');
    var erreur = document.getElementById('triage-erreur');

    form.addEventListener('change', function () { erreur.textContent = ''; });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var r = {};
      var manque = false;
      ['outil', 'personnes', 'sensible', 'interne'].forEach(function (q) {
        var coche = form.querySelector('input[name="' + q + '"]:checked');
        if (!coche) manque = true; else r[q] = coche.value;
      });
      if (manque) {
        erreur.textContent = 'Répondez aux quatre questions pour obtenir une réponse.';
        res.textContent = '';
        res.className = 'resultat';
        return;
      }
      var verdict, classe, conseils = [];
      if (r.sensible === 'oui') {
        verdict = 'Non : ces données ne vont dans aucun outil d\'IA.';
        classe = 'non';
        conseils.push('Données de santé, d\'évaluation, de sanction, de situation sociale, avis sur une personne : on ne les saisit pas, même anonymisées à la main.');
        conseils.push('Travaillez sur un modèle vide ou un exemple inventé, puis complétez vous-même hors de l\'outil.');
      } else if (r.outil === 'non') {
        if (r.personnes === 'non' && r.interne === 'non') {
          verdict = 'Possible, mais seulement parce que le contenu est public.';
          classe = 'prudence';
          conseils.push('Avec un outil non autorisé, limitez-vous à des contenus déjà publics (page web de l\'université, texte réglementaire publié…).');
          conseils.push('Pour tout contenu de travail, passez par un outil autorisé.');
        } else {
          verdict = 'Non : pas dans cet outil.';
          classe = 'non';
          conseils.push('Cet outil n\'est pas sur la liste des outils autorisés : ce que vous saisissez peut sortir de l\'université.');
          conseils.push('Utilisez un outil autorisé (voir la page Repères), après avoir anonymisé si besoin.');
        }
      } else if (r.personnes === 'oui' || r.interne === 'oui') {
        verdict = 'Oui, après préparation.';
        classe = 'prudence';
        if (r.personnes === 'oui') conseils.push('Retirez noms, prénoms, adresses, numéros, identifiants : remplacez-les par « agent A », « service B ».');
        if (r.interne === 'oui') conseils.push('Ne gardez que le passage utile au lieu du document entier, et retirez ce qui est confidentiel.');
        conseils.push('Relisez votre saisie avant d\'envoyer : est-ce que quelqu\'un pourrait être reconnu ?');
      } else {
        verdict = 'Oui.';
        classe = 'ok';
        conseils.push('Outil autorisé, ni personne identifiable ni contenu interne sensible : vous pouvez y aller.');
        conseils.push('Vérifiez toujours le résultat avant de l\'utiliser.');
      }
      res.className = 'resultat ' + classe;
      res.textContent = '';
      res.appendChild(el('p', {}, [el('strong', { texte: verdict })]));
      res.appendChild(el('ul', {}, conseils.map(function (c) { return el('li', { texte: c }); })));
      res.focus();
    });
  }

  // ---------- Mini-défis (rappels espacés) ----------

  var DEFIS = {
    'j3': [
      {
        q: 'Vous voulez un courriel de relance. Quel prompt donnera le meilleur résultat du premier coup ?',
        choix: [
          'Fais-moi un courriel de relance.',
          'Je suis gestionnaire de laboratoire. Rédige un courriel de relance courtois à un fournisseur qui n\'a pas livré la commande n° 1234, 8 lignes maximum, avec une date limite.',
          'Écris un très bon courriel professionnel, fais de ton mieux.'
        ],
        bonne: 1,
        explication: 'Contexte (qui je suis, à qui j\'écris), consigne précise et format : les trois blocs du prompt.'
      },
      {
        q: 'L\'IA vous cite un article de loi précis. Que faites-vous ?',
        choix: [
          'Je le reprends : la référence est précise, donc fiable.',
          'Je demande à l\'IA si elle est sûre.',
          'Je vérifie l\'article à la source (Légifrance, service juridique).'
        ],
        bonne: 2,
        explication: 'Une référence précise peut être inventée. On vérifie à la source, pas en redemandant à l\'IA.'
      },
      {
        q: 'Peut-on coller le tableau des arrêts maladie de l\'équipe dans un outil autorisé pour en faire la synthèse ?',
        choix: ['Oui, puisque l\'outil est autorisé.', 'Oui, si j\'enlève les noms.', 'Non.'],
        bonne: 2,
        explication: 'Les données de santé ne vont dans aucun outil d\'IA, même autorisé, même sans les noms : une équipe est petite, les personnes restent reconnaissables.'
      }
    ],
    'j7': [
      {
        q: 'La première réponse ne vous convient pas. Le plus efficace est souvent de…',
        choix: [
          'Tout réécrire et recommencer une nouvelle conversation.',
          'Dire précisément ce qui ne va pas : « plus court », « retire la formule d\'excuse », « ajoute la date limite ».',
          'Abandonner : l\'outil n\'est pas fait pour ça.'
        ],
        bonne: 1,
        explication: 'On itère : une consigne de correction ciblée améliore la réponse sans repartir de zéro.'
      },
      {
        q: 'L\'IA a calculé le total de votre tableau budgétaire. Que faites-vous ?',
        choix: ['Je recopie le total.', 'Je refais le calcul dans un tableur.', 'Je demande le total une seconde fois pour comparer.'],
        bonne: 1,
        explication: 'Un modèle de langage prédit du texte ; il peut se tromper de peu sur un calcul. Le tableur, lui, calcule.'
      },
      {
        q: 'Qui est responsable d\'un document produit avec l\'aide de l\'IA ?',
        choix: ['L\'éditeur de l\'outil.', 'Personne : c\'est automatique.', 'L\'agent qui l\'utilise et le diffuse.'],
        bonne: 2,
        explication: 'L\'IA est un outil : l\'agent reste responsable de ce qu\'il produit et diffuse.'
      }
    ],
    'j15': [
      {
        q: 'Vous demandez quatre fiches de poste. Les postes d\'assistanat sont au féminin, ceux de direction au masculin. C\'est…',
        choix: ['Normal : c\'est la réalité statistique.', 'Un biais à corriger avant diffusion.', 'Sans importance pour une fiche de poste.'],
        bonne: 1,
        explication: 'L\'IA reproduit les stéréotypes de ses données. On relit avec la grille (genre, âge, origine) et on demande une version neutre.'
      },
      {
        q: 'Votre cas d\'usage vous fait gagner 20 minutes, mais la vérification en prend 30. Votre décision ?',
        choix: [
          'J\'adopte : l\'IA va plus vite.',
          'Je n\'adopte pas tel quel : je cherche à réduire la vérification (source fournie, format imposé) ou je renonce.',
          'J\'adopte sans vérifier pour gagner du temps.'
        ],
        bonne: 1,
        explication: 'L\'utilité se mesure vérification comprise : c\'est la première question de la boussole IA.'
      },
      {
        q: 'Avant de diffuser un texte rédigé avec l\'IA à l\'extérieur de votre service, il faut…',
        choix: [
          'Rien de particulier.',
          'Le faire relire et valider comme n\'importe quel document, et suivre la règle de transparence de votre service.',
          'Supprimer toute trace de l\'usage de l\'IA.'
        ],
        bonne: 1,
        explication: 'Même circuit de validation qu\'un autre document ; la charte IA pose un principe de transparence, à décliner avec votre responsable.'
      }
    ]
  };

  function initDefis() {
    document.querySelectorAll('[data-defi]').forEach(function (bloc) {
      var id = bloc.getAttribute('data-defi');
      var questions = DEFIS[id];
      if (!questions) return;
      var form = el('form', { novalidate: 'novalidate' });
      questions.forEach(function (item, i) {
        var nom = 'defi-' + id + '-' + i;
        var fs = el('fieldset', {}, [el('legend', { texte: (i + 1) + '. ' + item.q })]);
        var choix = el('div', { classe: 'choix' });
        item.choix.forEach(function (texte, j) {
          var idInput = nom + '-' + j;
          choix.appendChild(el('label', { for: idInput }, [
            el('input', { type: 'radio', name: nom, id: idInput, value: String(j) }),
            el('span', { texte: texte })
          ]));
        });
        fs.appendChild(choix);
        fs.appendChild(el('div', { classe: 'resultat', id: nom + '-retour', 'aria-live': 'polite' }));
        form.appendChild(fs);
      });
      var erreur = el('p', { classe: 'erreur-champ', 'aria-live': 'polite' });
      var bilan = el('div', { classe: 'resultat', tabindex: '-1' });
      form.appendChild(erreur);
      form.appendChild(el('div', { classe: 'actions' }, [el('button', { type: 'submit', classe: 'bouton bouton-plein', texte: 'Vérifier mes réponses' })]));
      form.appendChild(bilan);
      form.addEventListener('change', function () { erreur.textContent = ''; });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var reponses = questions.map(function (item, i) {
          var coche = form.querySelector('input[name="defi-' + id + '-' + i + '"]:checked');
          return coche ? Number(coche.value) : null;
        });
        if (reponses.indexOf(null) !== -1) {
          erreur.textContent = 'Répondez à toutes les questions avant de vérifier.';
          return;
        }
        var score = 0;
        questions.forEach(function (item, i) {
          var juste = reponses[i] === item.bonne;
          if (juste) score += 1;
          var retour = document.getElementById('defi-' + id + '-' + i + '-retour');
          retour.className = 'resultat ' + (juste ? 'ok' : 'non');
          retour.textContent = '';
          retour.appendChild(el('p', {}, [el('strong', { texte: juste ? 'Juste. ' : 'Pas tout à fait. ' }), item.explication]));
        });
        bilan.className = 'resultat ' + (score === questions.length ? 'ok' : 'prudence');
        bilan.textContent = '';
        bilan.appendChild(el('p', {}, [el('strong', { texte: score + ' sur ' + questions.length + '. ' }),
          score === questions.length ? 'Bravo, vous êtes prêt pour cette étape.' : 'Relisez les explications : ces points reviennent dans le quiz du badge.']));
        ecrire('defi-' + id, String(score));
        var caseFaite = document.querySelector('input[data-memoire="defi-fait-' + id + '"]');
        if (caseFaite && !caseFaite.checked) {
          caseFaite.checked = true;
          ecrire('defi-fait-' + id, '1');
          majProgressions();
        }
        bilan.focus();
      });
      bloc.appendChild(form);
    });
  }

  // ---------- Bibliothèque de cas d'usage ----------

  function initCasUsage() {
    var liste = document.getElementById('cas-liste');
    if (!liste || !window.CAS_USAGE) return;
    var filtreMetier = document.getElementById('filtre-metier');
    var filtreDecision = document.getElementById('filtre-decision');
    var filtreTexte = document.getElementById('filtre-texte');
    var compteur = document.getElementById('cas-compteur');
    var DECISIONS = {
      adopte: ['J\'adopte', 'badge-ok'],
      precautions: ['J\'adopte avec précautions', 'badge-prudence'],
      non: ['Je n\'adopte pas', 'badge-non']
    };

    var metiers = [];
    window.CAS_USAGE.forEach(function (c) { if (metiers.indexOf(c.metier) === -1) metiers.push(c.metier); });
    metiers.sort().forEach(function (m) { filtreMetier.appendChild(el('option', { value: m, texte: m })); });

    function ligne(titre, texte) {
      return el('div', {}, [el('dt', { texte: titre }), el('dd', { texte: texte })]);
    }

    function afficher() {
      var m = filtreMetier.value, d = filtreDecision.value, t = filtreTexte.value.trim().toLowerCase();
      var retenus = window.CAS_USAGE.filter(function (c) {
        if (m && c.metier !== m) return false;
        if (d && c.decision !== d) return false;
        if (t && (c.titre + ' ' + c.tache + ' ' + c.prompt).toLowerCase().indexOf(t) === -1) return false;
        return true;
      });
      liste.textContent = '';
      compteur.textContent = retenus.length + (retenus.length > 1 ? ' cas affichés' : ' cas affiché');
      retenus.forEach(function (c, i) {
        var dec = DECISIONS[c.decision];
        var idPrompt = 'cas-prompt-' + i;
        var bouton = el('button', { type: 'button', classe: 'bouton', texte: 'Copier le prompt' });
        bouton.addEventListener('click', function () { copier(c.prompt, bouton); });
        liste.appendChild(el('article', { classe: 'carte' }, [
          el('p', { classe: 'petit doux', texte: c.metier }),
          el('h3', { texte: c.titre }),
          el('p', {}, [el('span', { classe: 'badge ' + dec[1], texte: dec[0] }), ' ', el('span', { classe: 'badge', texte: c.outil })]),
          el('dl', { classe: 'cas' }, [
            ligne('Tâche', c.tache),
            ligne('Vérification', c.verification),
            ligne('Précautions', c.precautions),
            ligne('Gain constaté', c.gain)
          ]),
          el('p', { classe: 'petit' }, [el('strong', { texte: 'Prompt' })]),
          el('pre', { classe: 'prompt', id: idPrompt, texte: c.prompt }),
          el('div', { classe: 'actions' }, [bouton])
        ]));
      });
      if (!retenus.length) liste.appendChild(el('p', { texte: 'Aucun cas ne correspond à ces filtres.' }));
    }

    [filtreMetier, filtreDecision].forEach(function (f) { f.addEventListener('change', afficher); });
    filtreTexte.addEventListener('input', afficher);
    afficher();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMemoire();
    initCopie();
    initImpression();
    initConstructeur();
    initTriage();
    initDefis();
    initCasUsage();
  });
})();
