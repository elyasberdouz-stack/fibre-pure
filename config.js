/* =====================================================================
   FIBRE PURE — CONFIGURATION
   ---------------------------------------------------------------------
   Tout ce qui est propre à l'entreprise se règle dans ce fichier :
   coordonnées, envoi WhatsApp, articles et prix, options, zone, avis et FAQ.
   Modifiez une valeur, enregistrez, rechargez la page : c'est tout.
   ===================================================================== */

window.SITE = {

  /* ---------------- L'entreprise ---------------- */
  entreprise: {
    nom: "Fibre Pure",
    nomDebut: "Fibre",                  // le logo affiche « Fibre » puis « Pure » en couleur
    nomFin: "Pure",
    region: "Île-de-France",
    // Pour la démo : numéro WhatsApp d'Elyas, pour recevoir les devis de test. À remplacer par celui de l'entreprise.
    telephoneAffiche: "07 60 35 46 38",
    telephoneLien: "+33760354638",
    whatsapp: "33760354638",            // indicatif + numéro, sans « + » ni espaces
    delaiReponse: "15 minutes",
    joursOuverts: [1, 2, 3, 4, 5, 6],   // 0 = dimanche … 6 = samedi
    heureFin: 19,                       // après heureFin − 2 h, « Aujourd'hui » n'est plus proposé
    prefixeDemande: "FP"
  },

  /* ---------------- Envoi automatique sur WhatsApp ----------------
     Quand le client appuie sur « Voir mon devis », le devis part tout seul sur le WhatsApp
     de l'entreprise (service gratuit CallMeBot). Activation : suivre
     https://www.callmebot.com/blog/free-api-whatsapp-messages/ puis coller la clé ci-dessous.
     Tant que la clé est vide, le client voit à la place un bouton « Envoyer sur WhatsApp ». */
  envoiAuto: {
    callmebotCle: "",
    numero: ""                          // vide = le numéro « whatsapp » ci-dessus
  },

  /* ---------------- D'où viennent les clients ----------------
     Détecté tout seul depuis Instagram, TikTok, Snapchat ou Facebook.
     Pour être sûr, ajouter ?via=… au lien de chaque bio, par exemple :
       https://elyasberdouz-stack.github.io/fibre-pure/?via=tiktok */
  sources: {
    tiktok: "TikTok", insta: "Instagram", snap: "Snapchat", facebook: "Facebook",
    google: "Google", whatsapp: "WhatsApp", flyer: "Flyer / carte de visite"
  },

  /* ---------------- Prix ----------------
     Tous les prix sont en euros, déplacement compris. */
  remises: { deux: 10, trois: 15 },     // −10 % dès 2 articles, −15 % dès 3 (sur les articles, pas sur les options)
  minimum: 69,                          // minimum d'intervention
  infos: { sechage: "4 à 6 h", duree: "1 à 3 h" },

  /* Articles. Pour ceux qui ont des tailles : [code, libellé, prix].
     « supplements » (matière, faces) s'ajoutent au prix de la taille. */
  articles: [
    {
      id: "canape", nom: "Canapé", detail: "Tissu, velours, microfibre ou cuir", icone: "canape", max: 3,
      tailles: [
        ["2p", "2 places", 79],
        ["3p", "3 places", 99],
        ["45p", "4-5 places", 129],
        ["angle", "d'angle", 139],
        ["u", "grand angle ou en U", 169]
      ],
      choix: { label: "Matière", options: [["tissu", "Tissu", 0], ["velours", "Velours ou microfibre", 0], ["cuir", "Cuir (+ nourrissage)", 20]] }
    },
    {
      id: "matelas", nom: "Matelas", detail: "Une ou deux faces", icone: "matelas", max: 4,
      tailles: [
        ["90", "1 place (90)", 49],
        ["140", "2 places (140)", 69],
        ["160", "160 × 200", 79],
        ["180", "180 × 200 et plus", 89]
      ],
      choix: { label: "Faces à nettoyer", options: [["1", "1 face", 0], ["2", "2 faces", 30]] }
    },
    { id: "fauteuil", nom: "Fauteuil", detail: "Fauteuil, pouf ou tête de lit", icone: "fauteuil", prix: 39, max: 6 },
    { id: "chaise", nom: "Chaise en tissu", detail: "Assise et dossier", icone: "chaise", prix: 15, max: 12 },
    {
      id: "tapis", nom: "Tapis", detail: "Laine, synthétique ou shaggy", icone: "tapis", max: 4,
      tailles: [
        ["s", "petit (moins de 2 m²)", 39],
        ["m", "moyen (2 à 4 m²)", 59],
        ["l", "grand (4 à 6 m²)", 89]
      ]
    }
  ],

  /* Options, prix fixe pour toute l'intervention */
  options: [
    { id: "taches", nom: "Détachage renforcé", detail: "Taches anciennes : vin, café, sang, maquillage…", icone: "goutte", prix: 20 },
    { id: "odeurs", nom: "Traitement anti-odeurs", detail: "Animaux, tabac, urine", icone: "vent", prix: 20 },
    { id: "acariens", nom: "Traitement anti-acariens", detail: "Idéal pour les matelas et les allergies", icone: "bouclier", prix: 15 },
    { id: "protection", nom: "Protection anti-taches", detail: "Un film invisible qui repousse les liquides", icone: "parapluie", prix: 25 }
  ],

  /* ---------------- Zone d'intervention ---------------- */
  zone: {
    departements: [
      ["75", "Paris"], ["77", "Seine-et-Marne"], ["78", "Yvelines"], ["91", "Essonne"],
      ["92", "Hauts-de-Seine"], ["93", "Seine-Saint-Denis"], ["94", "Val-de-Marne"], ["95", "Val-d'Oise"]
    ],
    horsZone: "Je ne suis pas en Île-de-France"
  },

  /* ---------------- Avis clients ----------------
     EXEMPLES à remplacer par de vrais avis. Tant que « avisExemples » vaut true,
     le site indique clairement qu'il s'agit d'exemples. */
  avisExemples: true,
  avis: [
    { prenom: "Sarah", lieu: "Paris 15e", note: 5, prestation: "Canapé d'angle + 2 matelas",
      texte: "Mon canapé beige avait cinq ans de taches d'enfants. Il est ressorti comme neuf, j'ai cru qu'ils l'avaient changé." },
    { prenom: "Karim", lieu: "Saint-Denis", note: 5, prestation: "Matelas 2 faces + anti-odeurs",
      texte: "Travail propre et rapide, et l'odeur du chien a complètement disparu. Je recommande." },
    { prenom: "Laura", lieu: "Boulogne", note: 5, prestation: "Canapé 3 places en velours",
      texte: "Très soigneuse avec le velours, et le prix était exactement celui du devis." },
    { prenom: "Yacine", lieu: "Créteil", note: 4, prestation: "Tapis + fauteuil",
      texte: "Il a fallu patienter pour le séchage, mais le résultat est impressionnant." },
    { prenom: "Mélanie", lieu: "Versailles", note: 5, prestation: "Canapé 3 places + 2 fauteuils",
      texte: "Rendez-vous calé le jour même sur WhatsApp. Le technicien a protégé le parquet et a tout laissé impeccable." }
  ],

  /* ---------------- FAQ ----------------
     Mots remplacés automatiquement : {region}, {sechage}, {minimum}. */
  faq: [
    { q: "Comment se passe le nettoyage ?",
      r: "Le technicien vient chez toi avec une machine professionnelle d'injection-extraction. Il applique un produit adapté au tissu, frotte, puis aspire l'eau et la saleté en profondeur. Rien à démonter." },
    { q: "Combien de temps pour que ça sèche ?",
      r: "En général {sechage}. Aère la pièce et évite de t'asseoir dessus en attendant." },
    { q: "Toutes les taches vont partir ?",
      r: "La grande majorité, oui. Certaines taches très anciennes ou décolorées peuvent rester atténuées : le technicien te le dit avant de commencer." },
    { q: "Les produits sont sans danger ?",
      r: "Oui. Ce sont des produits professionnels adaptés aux enfants et aux animaux, sans odeur forte." },
    { q: "Le prix affiché, c'est le prix final ?",
      r: "Oui, déplacement compris en {region}. Seul un article ajouté ou plus grand que prévu peut le changer, et on te prévient avant. Minimum d'intervention : {minimum} €." },
    { q: "Je paie comment ?",
      r: "Après le nettoyage, quand tu as vu le résultat : carte, espèces ou virement instantané." },
    { q: "Il faut préparer quelque chose ?",
      r: "Juste dégager l'accès au canapé ou au matelas et prévoir une prise électrique à côté. On s'occupe du reste." }
  ]
};
