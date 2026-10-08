/* Fibre Pure — fonctionnement du site.
   Les textes, prix, options, départements et coordonnées se modifient dans config.js, pas ici. */
(() => {
"use strict";

const S = window.SITE;
const E = S.entreprise;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const NB = " ";
const euro = (n) => `${n}${NB}€`;
const pad = (n) => String(n).padStart(2, "0");
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const fmtDate = (d, o) => new Intl.DateTimeFormat("fr-FR", o).format(d);
document.documentElement.lang = "fr";

/* ------------------------------------------------------------------ */
/* Icônes                                                              */
/* ------------------------------------------------------------------ */
const ICONS = {
  arrow: '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
  back: '<path d="M19.5 12h-15M10.5 6l-6 6 6 6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  chev: '<path d="m9 5.5 6.5 6.5L9 18.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  maison: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.8 9.4V20h12.4V9.4"/><path d="M10 20v-5.2h4V20"/>',
  canape: '<path d="M5 11V8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5V11"/><path d="M2.5 13a2 2 0 0 1 4 0v1.5h11V13a2 2 0 0 1 4 0v4.5h-19z"/><path d="M5 17.5V19.5M19 17.5V19.5"/>',
  matelas: '<rect x="2.5" y="8" width="19" height="8.5" rx="2.5"/><path d="M2.5 12.2h19"/><path d="M7 10.1h.01M12 10.1h.01M17 10.1h.01M5.5 16.5v2M18.5 16.5v2"/>',
  fauteuil: '<path d="M6.5 11V7.5A2.5 2.5 0 0 1 9 5h6a2.5 2.5 0 0 1 2.5 2.5V11"/><path d="M4 12.5a2 2 0 0 1 4 0V14h8v-1.5a2 2 0 0 1 4 0V18H4z"/><path d="M6 18v2M18 18v2"/>',
  chaise: '<path d="M8 3.5h8v7.5H8z"/><path d="M6.5 11h11v3h-11zM8 14v6.5M16 14v6.5"/>',
  tapis: '<rect x="4.5" y="5" width="15" height="14" rx="1.5"/><rect x="8" y="8.5" width="8" height="7" rx="1"/><path d="M4.5 7.5H2.5M4.5 10.5H2.5M4.5 13.5H2.5M4.5 16.5H2.5M19.5 7.5h2M19.5 10.5h2M19.5 13.5h2M19.5 16.5h2"/>',
  goutte: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
  vent: '<path d="M3 8h10.5a2.5 2.5 0 1 0-2.5-2.5M3 12h15a2.5 2.5 0 1 1-2.5 2.5M3 16h7"/>',
  bouclier: '<path d="M12 3 19 5.8v5.6c0 4.4-2.9 7.9-7 9.6-4.1-1.7-7-5.2-7-9.6V5.8z"/><path d="m8.9 12.1 2.2 2.2 4.1-4.3"/>',
  parapluie: '<path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5h-17A8.5 8.5 0 0 1 12 3.5z"/><path d="M12 12v6a2 2 0 0 1-4 0"/>',
  wa: '<path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5 5 16.2a8.5 8.5 0 1 1 15.5-4.6z"/><path d="M9.2 8.4c-.4 2.9 3.4 6.7 6.3 6.3l.9-1.5-2-1-.9.8a4.6 4.6 0 0 1-2.6-2.6l.8-.9-1-2z"/>',
  flash: '<path d="M13 2.5 4.5 13.5h6.5l-1 8 8.5-11h-6.5z"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  percent: '<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.3"/><circle cx="17" cy="17" r="2.3"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  star: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>'
};
const icon = (name, cls = "") =>
  `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
const star = (on) => `<svg class="ico ${on ? "" : "off"}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICONS.star}</svg>`;

/* ------------------------------------------------------------------ */
/* Données, état et prix                                               */
/* ------------------------------------------------------------------ */
const ART = S.articles;
const OPT = S.options;
const fromOf = (a) => (a.tailles ? Math.min(...a.tailles.map((t) => t[2])) : a.prix);
const minCanape = (() => { const c = ART.find((a) => a.id === "canape"); return c ? fromOf(c) : Math.min(...ART.map(fromOf)); })();

const D = { qty: {}, cfg: {}, opts: [], dept: null, quand: null, quandLbl: "", prenom: "", tel: "", ref: "", auto: false, via: "" };
function blankItems() {
  ART.forEach((a) => {
    D.qty[a.id] = 0;
    D.cfg[a.id] = { taille: null, choix: a.choix ? a.choix.options[0][0] : null };
  });
}
blankItems();

const count = () => ART.reduce((s, a) => s + D.qty[a.id], 0);
const chosen = () => ART.filter((a) => D.qty[a.id] > 0);
const missing = () => chosen().filter((a) => a.tailles && !D.cfg[a.id].taille);
function unitOf(a) {
  if (!a.tailles) return a.prix;
  const c = D.cfg[a.id];
  const t = a.tailles.find((x) => x[0] === c.taille);
  if (!t) return null;
  const o = a.choix && (a.choix.options.find((x) => x[0] === c.choix) || a.choix.options[0]);
  return t[2] + (o ? o[2] : 0);
}
function lineName(a) {
  const c = D.cfg[a.id];
  const t = a.tailles && a.tailles.find((x) => x[0] === c.taille);
  const o = a.choix && a.choix.options.find((x) => x[0] === c.choix);
  return `${a.nom}${t ? " " + t[1] : ""}${o && (o[2] || a.id === "matelas" || o[0] !== a.choix.options[0][0]) ? " · " + o[1] : ""}`;
}
function calc() {
  const lines = chosen().map((a) => {
    const u = unitOf(a);
    return { id: a.id, nom: lineName(a), qty: D.qty[a.id], unit: u == null ? fromOf(a) : u, exact: u != null };
  });
  lines.forEach((l) => { l.total = l.unit * l.qty; });
  const sub = lines.reduce((s, l) => s + l.total, 0);
  const n = count();
  const pct = n >= 3 ? S.remises.trois : n >= 2 ? S.remises.deux : 0;
  const remise = Math.round((sub * pct) / 100);
  const opts = OPT.filter((o) => D.opts.includes(o.id));
  const optTotal = opts.reduce((s, o) => s + o.prix, 0);
  let total = sub - remise + optTotal;
  const ajust = n && total < S.minimum ? S.minimum - total : 0;
  total += ajust;
  return { lines, sub, n, pct, remise, opts, optTotal, ajust, total, exact: lines.every((l) => l.exact) };
}
const deptTxt = () => {
  if (!D.dept) return "";
  if (D.dept === "hors") return "Hors " + E.region;
  const d = S.zone.departements.find((x) => x[0] === D.dept);
  return d ? `${d[1]} (${d[0]})` : D.dept;
};
const resumeTxt = () => chosen().map((a) => (D.qty[a.id] > 1 ? `${D.qty[a.id]} ${a.nom.toLowerCase()}s` : a.nom)).join(", ");

/* Quand le client veut le technicien */
function quandOptions() {
  const now = new Date();
  const open = (d) => E.joursOuverts.includes(d.getDay());
  const demain = new Date(now);
  demain.setDate(now.getDate() + 1);
  const next = new Date(demain);
  for (let i = 0; i < 7 && !open(next); i++) next.setDate(next.getDate() + 1);
  const todayOk = open(now) && now.getHours() < E.heureFin - 2;
  const nextNom = next.toDateString() === demain.toDateString() ? "Demain" : cap(fmtDate(next, { weekday: "long" }));
  const nextLong = fmtDate(next, { weekday: "long", day: "numeric", month: "long" });
  return [
    { id: "auj", nom: "Aujourd'hui", sub: todayOk ? "Si un créneau est libre" : "Plus de créneau aujourd'hui", off: !todayOk, ico: "flash",
      lbl: `Aujourd'hui (${fmtDate(now, { weekday: "long", day: "numeric", month: "long" })})` },
    { id: "dem", nom: nextNom, sub: cap(nextLong), ico: "cal",
      lbl: nextNom === "Demain" ? `Demain (${nextLong})` : `${nextNom} (${fmtDate(next, { day: "numeric", month: "long" })})` },
    { id: "sem", nom: "Cette semaine", sub: "Le jour qui t'arrange", ico: "cal", lbl: "Cette semaine" },
    { id: "pp", nom: "Je ne suis pas pressé", sub: "On cale ça ensemble", ico: "clock", lbl: "Pas pressé" }
  ];
}

/* D'où vient le client : ?via=tiktok, sinon l'appli qui a ouvert le lien, sinon le site d'origine */
function detectVia() {
  let v = "";
  try { const q = new URLSearchParams(location.search); v = (q.get("via") || q.get("utm_source") || "").toLowerCase().trim(); } catch (err) { /* rien */ }
  if (!v) {
    const ua = navigator.userAgent || "";
    if (/Instagram/i.test(ua)) v = "insta";
    else if (/BytedanceWebview|musical_ly|TikTok|trill_/i.test(ua)) v = "tiktok";
    else if (/Snapchat/i.test(ua)) v = "snap";
    else if (/FBAN|FBAV|FB_IAB/i.test(ua)) v = "facebook";
  }
  if (!v) {
    const r = document.referrer || "";
    if (/google\./i.test(r)) v = "google";
    else if (/instagram/i.test(r)) v = "insta";
    else if (/tiktok/i.test(r)) v = "tiktok";
    else if (/snapchat/i.test(r)) v = "snap";
    else if (/facebook/i.test(r)) v = "facebook";
  }
  try {
    if (v) sessionStorage.setItem("fibre-via", v);
    else v = sessionStorage.getItem("fibre-via") || "";
  } catch (err) { /* rien */ }
  return v;
}
const viaTxt = () => (D.via ? (S.sources && S.sources[D.via]) || cap(D.via) : "");

/* Reprise d'un devis commencé (stocké seulement sur le téléphone du client) */
const DRAFT = "fibre-pure-devis";
let page = "home";
function saveDraft() {
  if (!count() || D.ref || page === "devis") return;
  try {
    localStorage.setItem(DRAFT, JSON.stringify({ ts: Date.now(), day: todayIso(), qty: D.qty, cfg: D.cfg, opts: D.opts, dept: D.dept, quand: D.quand, quandLbl: D.quandLbl, prenom: D.prenom }));
  } catch (err) { /* stockage indisponible : tant pis */ }
}
function clearDraft() { try { localStorage.removeItem(DRAFT); } catch (err) { /* rien */ } }
function loadDraft() {
  let d = null;
  try { d = JSON.parse(localStorage.getItem(DRAFT) || "null"); } catch (err) { return; }
  if (!d || Date.now() - d.ts > 14 * 864e5) return;
  ART.forEach((a) => {
    const q = d.qty && Number(d.qty[a.id]);
    if (q > 0) D.qty[a.id] = Math.min(q, a.max || 9);
    const c = d.cfg && d.cfg[a.id];
    if (c) {
      if (a.tailles && a.tailles.some((t) => t[0] === c.taille)) D.cfg[a.id].taille = c.taille;
      if (a.choix && a.choix.options.some((o) => o[0] === c.choix)) D.cfg[a.id].choix = c.choix;
    }
  });
  D.opts = (d.opts || []).filter((id) => OPT.some((o) => o.id === id));
  D.dept = d.dept || null;
  if (d.day === todayIso()) { D.quand = d.quand || null; D.quandLbl = d.quandLbl || ""; }
  D.prenom = d.prenom || "";
}
function resetDevis() {
  blankItems();
  Object.assign(D, { opts: [], dept: null, quand: null, quandLbl: "", ref: "", auto: false });
  clearDraft();
}
const resumeTarget = () => {
  if (!count()) return "articles";
  if (missing().length) return "details";
  if (!D.dept) return "zone";
  if (!D.quand) return "quand";
  return "numero";
};

/* Numéro de téléphone */
const telDigits = (s) => {
  let d = String(s || "").replace(/\D/g, "");
  if (d.startsWith("0033")) d = d.slice(4);
  else if (d.startsWith("33") && d.length >= 11) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  return d;
};
const telValid = (s) => /^[1-9]\d{8}$/.test(telDigits(s));
const telNational = (s) => `0${telDigits(s)}`.replace(/(\d{2})(?=\d)/g, "$1 ");
const telIntl = (s) => `33${telDigits(s)}`;
const formatTyping = (v) => {
  const d = v.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return d;
  return d.slice(0, 10).replace(/(\d{2})(?=\d)/g, "$1 ");
};

/* ------------------------------------------------------------------ */
/* WhatsApp                                                            */
/* ------------------------------------------------------------------ */
const waLink = (text, num = E.whatsapp) => `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
const makeRef = () => { const d = new Date(); return `${E.prefixeDemande}-${pad(d.getDate())}${pad(d.getMonth() + 1)}-${Math.floor(1000 + Math.random() * 9000)}`; };
function detailLines(c) {
  const L = c.lines.map((l) => `• ${l.qty > 1 ? l.qty + " × " : ""}${l.nom} : ${euro(l.total)}`);
  c.opts.forEach((o) => L.push(`• ${o.nom} : ${euro(o.prix)}`));
  if (c.remise) L.push(`• Remise ${c.n} articles (−${c.pct} %) : −${euro(c.remise)}`);
  if (c.ajust) L.push(`• Minimum d'intervention : +${euro(c.ajust)}`);
  return L;
}
function msgPro() {
  const c = calc();
  const quand = D.quand === "auj" ? "Je peux passer aujourd'hui, quel créneau t'arrange ?"
    : D.quand === "dem" ? `Pour ${D.quandLbl.split(" (")[0].toLowerCase()}, quel créneau t'arrange ?`
    : "Quel jour et quelle heure t'arrangent ?";
  const reply = `Bonjour${D.prenom ? " " + D.prenom : ""}, ici ${E.nom} 👋 Ton devis n° ${D.ref} : ${euro(c.total)}, déplacement compris. ${quand}`;
  return [
    `🧽 Nouveau devis · ${E.nom}`,
    `N° ${D.ref}`,
    "",
    ...detailLines(c),
    `💶 Total : ${euro(c.total)}`,
    "",
    `📍 ${deptTxt()}`,
    `🗓 ${D.quandLbl}`,
    `👤 ${D.prenom || "Client"} · ${telNational(D.tel)}`,
    viaTxt() ? `📣 Venu de : ${viaTxt()}` : "",
    "",
    `Répondre au client : ${waLink(reply, telIntl(D.tel))}`
  ].filter((l, i, a) => l !== "" || (i > 0 && a[i - 1] !== "")).join("\n");
}
function msgClient() {
  const c = calc();
  return [
    `Bonjour ${E.nom} 👋`,
    `Je viens de faire mon devis sur votre site (n° ${D.ref}).`,
    "",
    ...detailLines(c),
    `💶 Total : ${euro(c.total)}`,
    "",
    `📍 ${deptTxt()}`,
    `🗓 ${D.quandLbl}`,
    `👤 ${D.prenom || ""} · ${telNational(D.tel)}`.trim(),
    viaTxt() ? `📣 Je vous ai trouvé sur ${viaTxt()}` : ""
  ].filter((l, i, a) => l !== "" || i < a.length - 1).join("\n");
}

/* Envoi automatique sur le WhatsApp de l'entreprise (CallMeBot). Renvoie true si un envoi est parti. */
function envoyerAuto(texte) {
  const cle = S.envoiAuto && S.envoiAuto.callmebotCle;
  if (!cle) return false;
  const num = `+${(S.envoiAuto.numero || E.whatsapp).replace(/\D/g, "")}`;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(num)}&text=${encodeURIComponent(texte)}&apikey=${encodeURIComponent(cle)}`;
  try { fetch(url, { mode: "no-cors", keepalive: true }).catch(() => { new Image().src = url; }); }
  catch (err) { new Image().src = url; }
  return true;
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */
const STEP = { articles: 1, details: 2, zone: 3, quand: 4, numero: 5, devis: 5 };
const STEPS = 5;
let depth = 0;
let useHistory = true;
const prevOf = (p) => ({ articles: "home", details: "articles", zone: "details", quand: "zone", numero: "quand", devis: "numero" })[p] || "home";
function guard(p) {
  const is = (list) => list.includes(p);
  if (is(["details", "zone", "quand", "numero", "devis"]) && !count()) return "articles";
  if (is(["zone", "quand", "numero", "devis"]) && missing().length) return "details";
  if (is(["quand", "numero", "devis"]) && !D.dept) return "zone";
  if (is(["numero", "devis"]) && !D.quand) return "quand";
  if (p === "devis" && !D.ref) return "numero";
  return p;
}
function go(p, replace) {
  page = guard(p);
  if (useHistory) {
    try {
      if (replace) history.replaceState({ p: page }, "");
      else { history.pushState({ p: page }, ""); depth++; }
    } catch (err) { useHistory = false; }
  }
  render();
}
function back() {
  if (useHistory && depth > 0) { history.back(); return; }
  go(prevOf(page), true);
}
window.addEventListener("popstate", (ev) => {
  depth = Math.max(0, depth - 1);
  page = guard((ev.state && ev.state.p) || "home");
  render();
});

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */
const head = (title, sub, kicker) =>
  `<div class="head">${kicker ? `<p class="kicker">${kicker}</p>` : ""}<h1 class="title" id="pageTitle" tabindex="-1">${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ""}</div>`;
const stepK = (p) => `Étape ${STEP[p]} sur ${STEPS}`;
const checkSvg = '<svg class="ico ico--s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

function faqHtml() {
  const fill = (s) => s.replace(/\{region\}/g, E.region).replace(/\{sechage\}/g, S.infos.sechage).replace(/\{minimum\}/g, S.minimum);
  return S.faq.map((f) => `<details class="qa"><summary><span>${esc(fill(f.q))}</span><span class="pm">${icon("plus", "ico--xs")}</span></summary><p class="qa__a">${esc(fill(f.r))}</p></details>`).join("");
}
function qtyHtml(a) {
  const q = D.qty[a.id];
  const plus = `<button type="button" class="qty__plus" data-plus="${a.id}" data-k="plus-${a.id}" aria-label="Ajouter : ${esc(a.nom)}"${q >= (a.max || 9) ? " disabled" : ""}>${icon("plus")}</button>`;
  if (!q) return `<span class="qty">${plus}</span>`;
  return `<span class="qty"><button type="button" data-minus="${a.id}" data-k="minus-${a.id}" aria-label="Retirer : ${esc(a.nom)}">${icon("minus")}</button><output aria-live="polite">${q}</output>${plus}</span>`;
}

const VIEWS = {
  home: () => {
    const n = count();
    const resume = n && !D.ref ? `
        <div class="resume">
          <span class="resume__ico">${icon("canape", "ico--s")}</span>
          <span class="resume__txt"><b>Devis en cours</b><span>${esc(resumeTxt())}</span></span>
          <button type="button" class="resume__go" data-act="resume">Reprendre</button>
          <button type="button" class="resume__x" data-act="drop-draft" aria-label="Effacer ce devis">${icon("plus", "ico--xs")}</button>
        </div>` : "";
    return `
      <div class="page">
        ${resume}
        ${head("Ton canapé et ton matelas comme neufs.", "Nettoyage en profondeur chez toi, par injection-extraction. Ton prix en 40 secondes.")}
        <div class="choices">
          <a class="choice choice--hi" href="#devis" data-go="articles">
            <span class="badge badge--accent">${icon("maison", "ico--xs")} Nettoyage à domicile</span>
            <h2>Obtenir mon devis</h2>
            <p>Canapé, matelas, fauteuil, chaises ou tapis : choisis ce qu'il faut nettoyer, ton prix s'affiche tout de suite.</p>
            <span class="choice__foot"><span class="choice__from">Canapé dès <b>${euro(minCanape)}</b> · déplacement offert</span><span class="go">${icon("arrow")}</span></span>
          </a>
        </div>
        <p class="section-t">Avis clients${S.avisExemples ? " · exemples" : ""}</p>
        <div class="reviews">${S.avis.map((a) => `
          <figure class="review">
            <div class="stars" aria-label="${a.note} sur 5">${[1, 2, 3, 4, 5].map((k) => star(k <= a.note)).join("")}</div>
            <blockquote>${esc(a.texte)}</blockquote>
            <figcaption><span><b>${esc(a.prenom)} · ${esc(a.lieu)}</b><span>${esc(a.prestation)}</span></span>${S.avisExemples ? '<span class="tag">Exemple</span>' : ""}</figcaption>
          </figure>`).join("")}</div>
        <p class="section-t">Questions fréquentes</p>
        <div>${faqHtml()}</div>
      </div>`;
  },

  articles: () => `
    <div class="page">
      ${head("Qu'est-ce qu'on nettoie&nbsp;?", "Ajoute tout ce que tu veux faire nettoyer.", stepK("articles"))}
      <div class="promo"><span class="promo__ico">${icon("percent", "ico--s")}</span><p>Plus il y en a, moins c'est cher<b>−${S.remises.deux}&nbsp;% dès 2 articles, −${S.remises.trois}&nbsp;% dès 3</b></p></div>
      <div class="items">${ART.map((a) => `
        <div class="item${D.qty[a.id] ? " is-on" : ""}">
          <span class="item__ico">${icon(a.icone)}</span>
          <span class="item__main"><span class="item__t">${esc(a.nom)}</span><span class="item__d">${esc(a.detail)}</span><span class="item__p">${a.tailles ? `dès ${euro(fromOf(a))}` : `${euro(a.prix)} / pièce`}</span></span>
          ${qtyHtml(a)}
        </div>`).join("")}</div>
      <p class="note">Prix déplacement compris. Minimum d'intervention : ${euro(S.minimum)}.</p>
    </div>`,

  details: () => {
    const cfgs = chosen().filter((a) => a.tailles);
    return `
      <div class="page">
        ${head(cfgs.length ? "Dis-nous en un peu plus" : "Un besoin particulier&nbsp;?", cfgs.length ? "Pour te donner le prix exact." : "Tout est facultatif.", stepK("details"))}
        ${cfgs.map((a) => {
          const c = D.cfg[a.id];
          return `
          <section class="cfg${c.taille ? "" : " is-missing"}" id="cfg-${a.id}">
            <div class="cfg__head"><span class="item__ico">${icon(a.icone)}</span><b>${esc(a.nom)}</b>${D.qty[a.id] > 1 ? `<span class="cfg__qty">× ${D.qty[a.id]}</span>` : ""}</div>
            <p class="cfg__label">Taille</p>
            <div class="chips">${a.tailles.map((t) => `<button type="button" class="chip" data-art="${a.id}" data-size="${t[0]}" data-k="size-${a.id}-${t[0]}" aria-pressed="${c.taille === t[0]}">${esc(cap(t[1]))}<small>${euro(t[2])}</small></button>`).join("")}</div>
            ${a.choix ? `
            <p class="cfg__label">${esc(a.choix.label)}</p>
            <div class="chips">${a.choix.options.map((o) => `<button type="button" class="chip" data-art="${a.id}" data-choix="${o[0]}" data-k="choix-${a.id}-${o[0]}" aria-pressed="${c.choix === o[0]}">${esc(o[1])}${o[2] ? `<small>+${euro(o[2])}</small>` : ""}</button>`).join("")}</div>` : ""}
            ${D.qty[a.id] > 1 && a.id !== "chaise" ? `<p class="note">Tailles différentes ? Précise-le sur WhatsApp, on ajuste le prix.</p>` : ""}
          </section>`;
        }).join("")}
        ${cfgs.length ? `<p class="section-t">Un besoin particulier&nbsp;?</p>` : ""}
        <div class="list">${OPT.map((o) => `
          <button type="button" class="row" data-opt="${o.id}" data-k="opt-${o.id}" aria-pressed="${D.opts.includes(o.id)}">
            <span class="box">${icon("check")}</span>
            <span class="row__main"><span class="row__t">${esc(o.nom)}</span><span class="row__d">${esc(o.detail)}</span></span>
            <span class="row__p">+${euro(o.prix)}</span>
          </button>`).join("")}</div>
        <p class="note">Options facultatives, prix pour toute l'intervention.</p>
      </div>`;
  },

  zone: () => `
    <div class="page">
      ${head("Tu es dans quel département&nbsp;?", "Le technicien se déplace chez toi avec tout son matériel.", stepK("zone"))}
      <div class="depts">
        ${S.zone.departements.map(([num, nom]) => `<button type="button" class="dept" data-dept="${num}" aria-pressed="${D.dept === num}"><b>${esc(num)}</b><span>${esc(nom)}</span></button>`).join("")}
        <button type="button" class="dept dept--wide" data-dept="hors" aria-pressed="${D.dept === "hors"}">${esc(S.zone.horsZone)}</button>
      </div>
    </div>`,

  quand: () => `
    <div class="page">
      ${head("Tu veux le technicien quand&nbsp;?", "On te confirme l'heure exacte sur WhatsApp.", stepK("quand"))}
      <div class="whens">${quandOptions().map((o) => `
        <button type="button" class="when" data-quand="${o.id}" aria-pressed="${D.quand === o.id}"${o.off ? " disabled" : ""}>
          <span class="when__ico">${icon(o.ico, "ico--s")}</span>
          <span class="when__txt"><b>${esc(o.nom)}</b><span>${esc(o.sub)}</span></span>
          ${icon(D.quand === o.id ? "check" : "chev", "chev")}
        </button>`).join("")}</div>
    </div>`,

  numero: () => {
    const c = calc();
    const hors = D.dept === "hors";
    return `
      <div class="page">
        ${head(hors ? "On regarde si c'est possible" : "Ton devis arrive", hors
          ? `On ne se déplace pas encore partout hors ${esc(E.region)}. Laisse ton numéro : on te dit sur WhatsApp si on peut venir.`
          : `Laisse ton numéro, on t'écrit sur <b style="color:var(--ink)">WhatsApp</b> dans les ${esc(E.delaiReponse)}.`, stepK("numero"))}
        <div class="recapmini"><span class="recapmini__ico">${icon("check", "ico--s")}</span><span class="recapmini__txt"><b>${c.n} article${c.n > 1 ? "s" : ""} à nettoyer</b><span>${esc(deptTxt())} · ${esc(D.quandLbl.split(" (")[0])}</span></span></div>
        <form id="telForm" novalidate style="display:grid;gap:14px">
          <div class="field"><label for="fPrenom">Ton prénom <span class="opt">facultatif</span></label><input class="input" id="fPrenom" type="text" autocomplete="given-name" enterkeyhint="next" value="${esc(D.prenom)}"></div>
          <div class="field">
            <label for="fTel">Ton numéro WhatsApp</label>
            <div class="tel" id="telBox"><span class="flag" aria-hidden="true"></span><span class="tel__cc">+33</span><input id="fTel" type="tel" inputmode="tel" autocomplete="tel" enterkeyhint="send" placeholder="06 12 34 56 78" value="${esc(D.tel)}"></div>
          </div>
          <p class="err" id="telErr" hidden></p>
          <button type="submit" class="btn btn--accent" id="seeBtn">Voir mon devis</button>
          <p class="fine">Ton numéro sert uniquement à te recontacter pour ton nettoyage.</p>
        </form>
      </div>`;
  },

  devis: () => {
    const c = calc();
    const status = D.auto
      ? `<div class="done"><span class="done__ico">${checkSvg}</span><span class="done__txt"><b>C'est transmis&nbsp;!</b><span>On t'écrit sur WhatsApp au ${esc(telNational(D.tel))} dans les ${esc(E.delaiReponse)}.</span></span></div>`
      : `<div class="done done--todo"><span class="done__ico">${icon("wa", "ico--s")}</span><span class="done__txt"><b>Dernière étape</b><span>Envoie ce devis sur WhatsApp pour réserver : on te répond dans les ${esc(E.delaiReponse)}.</span></span></div>`;
    const tl = (n, m, p, cls = "") => `<div class="tl"><span class="tl__n">${n}</span><span class="tl__m">${m}</span><span class="tl__p"${cls}>${p}</span></div>`;
    return `
      <div class="page">
        ${head(`Voilà ton devis${D.prenom ? ", " + esc(D.prenom) : ""}`, "", `<span style="color:var(--ok)">Devis n° ${esc(D.ref)}</span>`)}
        ${status}
        <article class="ticket">
          <div class="ticket__top"><span class="tape">Devis</span><span class="ticket__ref">${esc(fmtDate(new Date(), {}))}</span></div>
          <p class="ticket__model">Ton nettoyage<span>${esc(deptTxt())} · ${esc(D.quandLbl.split(" (")[0])}</span></p>
          ${c.lines.map((l) => tl(esc(l.nom), l.qty > 1 ? `${l.qty} × ${euro(l.unit)}` : "", euro(l.total))).join("")}
          ${c.opts.map((o) => tl(esc(o.nom), "Option", euro(o.prix))).join("")}
          ${c.remise ? tl(`Remise ${c.n} articles<span class="minus">−${c.pct}&nbsp;%</span>`, "Sur les articles", `−${euro(c.remise)}`, ' style="color:var(--ok)"') : ""}
          ${c.ajust ? tl("Minimum d'intervention", `${euro(S.minimum)} minimum`, `+${euro(c.ajust)}`) : ""}
          ${tl("Déplacement", esc(E.region), "Offert")}
          <div class="cut"></div>
          <div class="ticket__total"><span>Total</span><b>${euro(c.total)}</b></div>
          ${c.remise ? `<p class="ticket__save">Tu économises ${euro(c.remise)} grâce à la remise ${c.n} articles.</p>` : ""}
        </article>
        <div class="facts">
          <div>Séchage<b>${esc(S.infos.sechage)}</b></div>
          <div>Sur place<b>${esc(S.infos.duree)}</b></div>
          <div>Paiement<b>Après le nettoyage</b></div>
        </div>
        <div class="actions">
          ${D.auto
            ? `<a class="btn btn--line" href="${waLink(msgClient())}" target="_blank" rel="noopener">${icon("wa")} Écrire sur WhatsApp maintenant</a>`
            : `<a class="btn btn--accent" href="${waLink(msgClient())}" target="_blank" rel="noopener">${icon("wa")} Envoyer mon devis sur WhatsApp</a>`}
          <button type="button" class="btn btn--line" data-go="articles">Modifier mon devis</button>
        </div>
        <p class="section-t">Et maintenant&nbsp;?</p>
        <ol class="how">
          <li><span class="how__n">01</span><span class="how__txt"><b>On te confirme un créneau</b><span>Sur WhatsApp, au moment qui t'arrange.</span></span></li>
          <li><span class="how__n">02</span><span class="how__txt"><b>Le technicien vient chez toi</b><span>Avec tout son matériel. Il lui faut juste une prise électrique.</span></span></li>
          <li><span class="how__n">03</span><span class="how__txt"><b>Tu paies quand tu as vu le résultat</b><span>Carte, espèces ou virement instantané.</span></span></li>
        </ol>
      </div>`;
  }
};

/* ------------------------------------------------------------------ */
/* Rendu                                                               */
/* ------------------------------------------------------------------ */
function battery(step, full) {
  return `<span class="battery${full ? " is-full" : ""}" aria-label="Étape ${step} sur ${STEPS}"><span class="battery__body">${Array.from({ length: STEPS }, (_, k) => k + 1).map((i) => `<span class="battery__cell${i <= step ? " on" : ""}"></span>`).join("")}</span>${full ? "100 %" : `${step}/${STEPS}`}</span>`;
}
function barHtml() {
  const btn = (label, act, disabled) => `<button type="button" class="btn btn--accent" data-act="${act}"${disabled ? " disabled" : ""}>${label}</button>`;
  if (page === "articles") {
    const c = calc();
    const sum = !c.n ? "<span>Ajoute au moins un article</span>"
      : `<span>${c.n} article${c.n > 1 ? "s" : ""}${c.pct ? ` · −${c.pct}&nbsp;%` : ""}</span><span>${c.exact ? "" : "dès "}<b>${euro(c.total)}</b></span>`;
    return `<div class="bar__sum">${sum}</div>${btn("Continuer", "next-articles", !c.n)}`;
  }
  if (page === "details") {
    const c = calc();
    const miss = missing();
    const sum = miss.length
      ? `<span>Choisis la taille : ${esc(miss.map((a) => a.nom.toLowerCase()).join(", "))}</span>`
      : `<span>${c.n} article${c.n > 1 ? "s" : ""}${c.opts.length ? ` + ${c.opts.length} option${c.opts.length > 1 ? "s" : ""}` : ""}</span><span><b>${euro(c.total)}</b></span>`;
    return `<div class="bar__sum">${sum}</div>${btn("Continuer", "next-details", false)}`;
  }
  return "";
}
function paintBar() {
  const bar = barHtml();
  $("#barIn").innerHTML = bar;
  $("#bar").hidden = !bar;
  document.body.classList.toggle("has-bar", !!bar);
}
function render() {
  $("#view").innerHTML = VIEWS[page]();
  $("#backBtn").hidden = page === "home";
  $("#topRight").innerHTML = STEP[page] ? battery(STEP[page], page === "devis") : `<span class="pill">${esc(E.region)}</span>`;
  paintBar();
  window.scrollTo(0, 0);
  const h = $("#pageTitle");
  if (h && page !== "home") h.focus({ preventScroll: true });
  saveDraft();
}
function refresh() {
  const top = window.scrollY;
  const k = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.k : null;
  $("#view").innerHTML = VIEWS[page]().replace('class="page"', 'class="page" style="animation:none"');
  paintBar();
  window.scrollTo(0, top);
  if (k) { const el = $(`[data-k="${CSS.escape(k)}"]`); if (el && !el.disabled) el.focus({ preventScroll: true }); }
  saveDraft();
}

/* ------------------------------------------------------------------ */
/* Interactions                                                        */
/* ------------------------------------------------------------------ */
document.addEventListener("click", (ev) => {
  const t = ev.target;
  const goEl = t.closest("[data-go]");
  if (goEl) { ev.preventDefault(); if (page === "devis") { D.ref = ""; D.auto = false; } go(goEl.dataset.go); return; }
  if (t.closest("#backBtn")) { back(); return; }
  if (t.closest("#logoBtn")) { ev.preventDefault(); if (page !== "home") go("home"); return; }

  const plus = t.closest("[data-plus]");
  if (plus && !plus.disabled) { const a = S.articles.find((x) => x.id === plus.dataset.plus); D.qty[a.id] = Math.min((a.max || 9), D.qty[a.id] + 1); refresh(); return; }
  const minus = t.closest("[data-minus]");
  if (minus) { const id = minus.dataset.minus; D.qty[id] = Math.max(0, D.qty[id] - 1); refresh(); return; }
  const size = t.closest("[data-size]");
  if (size) { D.cfg[size.dataset.art].taille = size.dataset.size; refresh(); return; }
  const choix = t.closest("[data-choix]");
  if (choix) { D.cfg[choix.dataset.art].choix = choix.dataset.choix; refresh(); return; }
  const opt = t.closest("[data-opt]");
  if (opt) { const id = opt.dataset.opt; D.opts = D.opts.includes(id) ? D.opts.filter((x) => x !== id) : D.opts.concat(id); refresh(); return; }
  const dept = t.closest("[data-dept]");
  if (dept) { D.dept = dept.dataset.dept; refresh(); setTimeout(() => go("quand"), 170); return; }
  const quand = t.closest("[data-quand]");
  if (quand && !quand.disabled) {
    const o = quandOptions().find((x) => x.id === quand.dataset.quand);
    D.quand = o.id;
    D.quandLbl = o.lbl;
    refresh();
    setTimeout(() => go("numero"), 170);
    return;
  }

  const act = t.closest("[data-act]");
  if (!act || act.disabled) return;
  switch (act.dataset.act) {
    case "next-articles":
      go("details");
      break;
    case "next-details": {
      const miss = missing();
      if (miss.length) {
        const el = $(`#cfg-${miss[0].id}`);
        if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 300 }); }
        return;
      }
      go("zone");
      break;
    }
    case "resume":
      go(resumeTarget());
      break;
    case "drop-draft":
      resetDevis();
      refresh();
      break;
  }
});

document.addEventListener("input", (ev) => {
  const el = ev.target;
  if (el.id === "fPrenom") { D.prenom = el.value.trim(); return; }
  if (el.id === "fTel") {
    const f = formatTyping(el.value);
    if (f !== el.value) el.value = f;
    D.tel = el.value;
    $("#telBox").classList.remove("is-err");
    $("#telErr").hidden = true;
  }
});
document.addEventListener("submit", (ev) => {
  if (ev.target.id !== "telForm") return;
  ev.preventDefault();
  if (!telValid(D.tel)) {
    $("#telBox").classList.add("is-err");
    const e = $("#telErr");
    e.textContent = D.tel.trim() ? "Ce numéro ne semble pas complet. Exemple : 06 12 34 56 78" : "Indique ton numéro pour recevoir ton devis.";
    e.hidden = false;
    $("#fTel").focus();
    return;
  }
  const btn = $("#seeBtn");
  btn.disabled = true;
  btn.innerHTML = '<span class="spin" aria-hidden="true"></span> Envoi de ton devis…';
  D.ref = makeRef();
  D.auto = envoyerAuto(msgPro());
  clearDraft();
  setTimeout(() => go("devis"), 650);
});

/* Démarrage */
$("#logoTxt").innerHTML = `${esc(E.nomDebut || E.nom)} <em>${esc(E.nomFin || "")}</em>`;
$("#backBtn").innerHTML = icon("back");
D.via = detectVia();
loadDraft();
try { history.replaceState({ p: "home" }, ""); } catch (err) { useHistory = false; }
if (location.hash === "#devis") go("articles");
else render();
})();
