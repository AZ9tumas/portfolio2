/* ==========================================================================
   AZ9tumas Portfolio — renderer
   Builds the one-page portfolio from window.PORTFOLIO_CONFIG: hero,
   games, showcases, code viewer, about and contact. Content lives in
   config.js; you shouldn't need to edit this file.
   ========================================================================== */

(() => {
  "use strict";

  const C = window.PORTFOLIO_CONFIG;
  if (!C) {
    console.error("[portfolio] config.js failed to load — nothing to render.");
    return;
  }

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

  const YEARS = Math.max(1, new Date().getFullYear() - C.profile.startYear);
  const fill = (s) =>
    String(s).replace(/\{name\}/g, C.profile.displayName).replace(/\{years\}/g, YEARS);
  const text = (s) => esc(fill(s)).replace(/`([^`]+)`/g, "<code>$1</code>");
  const ext = 'target="_blank" rel="noopener noreferrer"';

  /* ---------- icons (Lucide, 1.75 stroke) ---------- */
  const ICONS = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    "arrow-down": '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    card: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
  };
  const icon = (name) =>
    '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.6v14.8a1 1 0 0 0 1.5.86l12.2-7.4a1 1 0 0 0 0-1.72L8.5 3.74A1 1 0 0 0 7 4.6z"/></svg>';

  const badge = (label, kind) =>
    '<span class="badge' + (kind ? " badge-" + kind : "") + '">' +
    (kind === "green" || kind === "amber" ? '<span class="dot"></span>' : "") + esc(label) + "</span>";
  const statusBadge = (s) => (s ? badge(s, /live/i.test(s) ? "green" : "amber") : "");

  /* ---------- Luau highlighter (line by line; enough for snippets) ---------- */
  const KW = new Set(("local function end return if then else elseif for in do while repeat " +
    "until not and or break continue export type").split(" "));
  const LIT = new Set(["nil", "true", "false", "self"]);
  const TOKEN_RE =
    /(--.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+)|(.)/g;

  function highlight(line) {
    let out = "";
    let m;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(line))) {
      if (m[1]) out += '<span class="t-cm">' + esc(m[1]) + "</span>";
      else if (m[2]) out += '<span class="t-st">' + esc(m[2]) + "</span>";
      else if (m[3]) out += '<span class="t-nu">' + m[3] + "</span>";
      else if (m[4]) {
        const w = m[4];
        const call = /^\s*[({"]/.test(line.slice(TOKEN_RE.lastIndex));
        const cls = KW.has(w) ? "kw" : LIT.has(w) ? "li" : call ? "fn" : /^[A-Z]/.test(w) ? "ty" : "";
        out += cls ? '<span class="t-' + cls + '">' + w + "</span>" : w;
      } else out += esc(m[5] || m[6]);
    }
    return out;
  }

  // Tabs are expanded for display (tab stops would otherwise count the
  // line-number gutter); the copy button uses the original source.
  function codeBlock(s, numbered = true) {
    const lines = s.code.replace(/\t/g, "    ").split("\n").map((l) =>
      '<span class="line">' + (s.lang === "luau" ? highlight(l) : esc(l)) + "</span>").join("");
    return '<div class="code' + (numbered ? " numbered" : "") + '">' +
      '<div class="code-head"><span class="code-file">' + esc(s.file || "") + "</span>" +
      '<button class="copy-btn" type="button">' + icon("copy") + "Copy</button></div>" +
      "<pre><code>" + lines + "</code></pre></div>";
  }

  /* ---------- video (thumbnail first, YouTube on click) ---------- */
  function video(item) {
    const parts = item.parts || [];
    const tabs = parts.length > 1
      ? '<div class="tabs" role="tablist" aria-label="Chapters">' + parts.map((p, i) =>
          '<button class="tab" type="button" role="tab" aria-selected="' + (i === 0) + '" data-part="' + i + '">' +
          esc(p.label || "Part " + (i + 1)) + "</button>").join("") + "</div>"
      : "";
    return '<div class="video" data-parts="' + esc(JSON.stringify(parts)) + '" data-title="' + esc(item.title) + '">' +
      tabs + '<div class="video-frame">' + thumb(parts[0], item.title) + "</div></div>";
  }

  function thumb(part, title) {
    return '<button class="video-thumb" type="button" data-id="' + esc(part.id) + '" aria-label="Play ' +
      esc(title + (part.label && part.label !== "Watch" ? " — " + part.label : "")) + '">' +
      '<img src="https://i.ytimg.com/vi/' + encodeURIComponent(part.id) + '/hqdefault.jpg" alt="" loading="lazy">' +
      '<span class="video-play">' + PLAY + "Play</span></button>";
  }

  const iframe = (id, title) =>
    '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0" title="' +
    esc(title) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';

  /* ==========================================================
     SECTIONS
     ========================================================== */
  function renderHero() {
    const p = C.profile;
    $("#hero").innerHTML =
      badge(p.availability, "green") +
      "<h1>" + esc(p.displayName) + "</h1>" +
      '<p class="hero-role">' + esc(p.tagline) + "</p>" +
      '<p class="hero-intro">' + text(p.intro) + "</p>" +
      '<div class="hero-actions">' +
        '<a class="btn btn-primary" href="' + esc(C.contact.discordUrl) + '" ' + ext + ">" + icon("message") + "Message me on Discord</a>" +
        '<a class="btn btn-secondary" href="#work">See my work ' + icon("arrow-down") + "</a>" +
      "</div>" +
      '<div class="stats">' + p.stats.map((s) =>
        '<div class="stat"><div class="stat-value">' + esc(s.value) + '</div><div class="stat-label">' +
        esc(s.label) + '</div><div class="stat-note">' + esc(s.note || "") + "</div></div>").join("") + "</div>";
  }

  function renderProjects() {
    $("#projects").innerHTML = C.projects.map((p) => {
      const s = p.stats || {};
      const metric = s.visits ? [s.visits, "visits"] : s.concurrents ? [s.concurrents, "peak players online"] : null;
      const footage = C.caseStudies.find((c) => c.project === p.slug);
      return '<article class="project">' +
        '<div class="project-top"><div>' +
          "<h3>" + esc(p.title) + "</h3>" +
          '<div class="project-badges">' + badge(p.role, "accent") + statusBadge(p.status) + "</div>" +
        "</div>" +
        (metric ? '<div class="project-metric"><b>' + esc(metric[0]) + "</b><span>" + metric[1] + "</span></div>" : "") +
        "</div>" +
        "<p>" + text(p.summary) + "</p>" +
        (footage ? video(footage) : "") +
        '<div class="project-foot">' +
          '<div class="chips">' + (p.tags || []).map((t) => '<span class="chip">' + esc(t) + "</span>").join("") + "</div>" +
          '<a class="link-arrow" href="' + esc(p.url) + '" ' + ext + ">Play on Roblox " + icon("arrow-up-right") + "</a>" +
        "</div></article>";
    }).join("");
    if (C.additionalContributions) $("#more").innerHTML = text(C.additionalContributions);
  }

  function renderShowcases() {
    // Footage that belongs to a game is shown on that game's card instead.
    $("#showcase-list").innerHTML = C.caseStudies.filter((c) => !c.project).map((c) =>
      '<article class="showcase">' + video(c) +
      "<h3>" + esc(c.title) + "</h3>" +
      (c.role ? badge(c.role, "accent") : "") +
      "<p>" + text(c.summary) + "</p></article>").join("");
  }

  function renderCode() {
    const E = C.engineering || {};
    $("#code-intro").innerHTML = text(E.intro || "");
    $("#principles").innerHTML = (E.principles || []).map((p) =>
      '<div class="principle"><b>' + esc(p.title) + "</b><p>" + text(p.body) + "</p></div>").join("");

    const items = (E.snippets || []).slice();
    if (E.layout) items.push({ id: "layout", title: E.layout.title, description: "Every place follows the same shape: services on the server, controllers on the client, shared code in one place.", ...E.layout, numbered: false });
    if (!items.length) return;

    const viewer = $("#code-viewer");
    viewer.innerHTML =
      '<div class="code-tabs" role="tablist" aria-label="Code examples">' + items.map((s, i) =>
        '<button class="code-tab" type="button" role="tab" aria-selected="' + (i === 0) + '" data-i="' + i + '">' + esc(s.title) + "</button>").join("") +
      "</div>" +
      '<p class="code-desc" id="code-desc"></p><div id="code-slot"></div>' +
      '<p class="code-note">' + icon("info") + "<span>Simplified, representative examples of the patterns I use — not code lifted from a client project.</span></p>";

    const show = (i) => {
      const s = items[i];
      $("#code-desc").innerHTML = text(s.description || "");
      $("#code-slot").innerHTML = codeBlock(s, s.numbered !== false);
      $("#code-slot").dataset.src = s.code;
      $$(".code-tab", viewer).forEach((t) => t.setAttribute("aria-selected", String(+t.dataset.i === i)));
    };
    viewer.addEventListener("click", (e) => {
      const t = e.target.closest(".code-tab");
      if (t) show(+t.dataset.i);
    });
    show(0);
  }

  function renderAbout() {
    const p = C.profile;
    $("#about-body").innerHTML =
      '<div><div class="about-text">' + p.aboutParagraphs.map((x) => "<p>" + text(x) + "</p>").join("") + "</div>" +
      '<div class="skills"><h3>What I work on</h3><div class="chips">' +
      C.skills.map((s) => '<span class="chip">' + esc(s) + "</span>").join("") + "</div></div></div>" +
      '<dl class="facts">' + p.facts.map((f) =>
        '<div class="fact"><dt>' + esc(f.key) + "</dt><dd>" + text(f.value) + "</dd></div>").join("") + "</dl>";
  }

  function renderContact() {
    const pay = C.contact.paymentNote;
    $("#contact-body").innerHTML =
      "<div><h2>Let's work together</h2>" +
      '<p class="contact-lead">' + esc(C.profile.availability) + ". Tell me what you're building and I'll come back with scope and availability.</p>" +
      '<div class="steps">' +
        '<div class="step"><span class="step-num">1</span><span><b>Send a short brief</b> — what you\'re building, the systems you need and your timeline.</span></div>' +
        '<div class="step"><span class="step-num">2</span><span><b>Get scope and availability</b> — what the work involves and when I can start.</span></div>' +
        '<div class="step"><span class="step-num">3</span><span><b>Agree on payment</b> — ' + esc(pay) + ".</span></div>" +
      "</div></div>" +
      '<div class="channels">' +
        '<div class="channel"><span class="channel-icon">' + icon("message") + '</span><div class="channel-text">' +
          '<div class="channel-title">Discord</div><div class="channel-sub">Fastest reply — send a DM</div></div>' +
          '<a class="btn btn-primary btn-sm" href="' + esc(C.contact.discordUrl) + '" ' + ext + ">Message</a></div>" +
        '<div class="channel"><span class="channel-icon">' + icon("mail") + '</span><div class="channel-text">' +
          '<div class="channel-title">Email</div><div class="channel-sub" id="email-sub">Hidden from spam bots — click to show</div></div>' +
          '<button class="btn btn-secondary btn-sm" type="button" id="email-btn">Show</button></div>' +
        '<div class="channel"><span class="channel-icon">' + icon("card") + '</span><div class="channel-text">' +
          '<div class="channel-title">Payment</div><div class="channel-sub">' + esc(pay) + "</div></div></div>" +
      "</div>";
  }

  function renderFooter() {
    $("#brand-mark").textContent = C.profile.monogram || C.profile.displayName.slice(0, 2).toUpperCase();
    $("#brand-name").textContent = C.profile.displayName;
    $("#footer").innerHTML =
      "<span>© " + new Date().getFullYear() + " " + esc(C.profile.displayName) + " · " + esc(C.profile.tagline) + "</span>" +
      '<a href="#top">Back to top ↑</a>';
    document.title = C.seo.title;
  }

  /* ==========================================================
     BEHAVIOUR
     ========================================================== */
  // Email — assembled only on click; never present in the page before that.
  function revealEmail(btn) {
    const addr = C.contact.emailUser + "@" + C.contact.emailDomain;
    if (btn.dataset.shown) {
      navigator.clipboard.writeText(addr).then(
        () => { btn.textContent = "Copied"; setTimeout(() => { btn.textContent = "Copy"; }, 1600); },
        () => { btn.textContent = "Select to copy"; });
      return;
    }
    $("#email-sub").innerHTML = '<a href="mailto:' + esc(addr) + '">' + esc(addr) + "</a>";
    btn.textContent = "Copy";
    btn.dataset.shown = "1";
  }

  function initClicks() {
    document.addEventListener("click", (e) => {
      const th = e.target.closest(".video-thumb");
      if (th) {
        const box = th.closest(".video");
        th.parentElement.innerHTML = iframe(th.dataset.id, box.dataset.title);
        box.dataset.playing = "1";
        return;
      }

      const tab = e.target.closest(".video .tab");
      if (tab) {
        const box = tab.closest(".video");
        const part = JSON.parse(box.dataset.parts)[+tab.dataset.part];
        $$(".tab", box).forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
        $(".video-frame", box).innerHTML = box.dataset.playing
          ? iframe(part.id, box.dataset.title + " — " + (part.label || ""))
          : thumb(part, box.dataset.title);
        return;
      }

      const copy = e.target.closest(".copy-btn");
      if (copy) {
        navigator.clipboard.writeText($("#code-slot").dataset.src || "").then(
          () => { copy.innerHTML = icon("check") + "Copied"; },
          () => { copy.textContent = "Select to copy"; });
        setTimeout(() => { copy.innerHTML = icon("copy") + "Copy"; }, 1600);
        return;
      }

      const email = e.target.closest("#email-btn");
      if (email) revealEmail(email);
    });
  }

  function initTheme() {
    const btn = $("#theme-btn");
    const root = document.documentElement;
    const paint = () => {
      const dark = root.getAttribute("data-theme") === "dark";
      btn.innerHTML = icon(dark ? "sun" : "moon");
      btn.setAttribute("aria-label", "Switch to " + (dark ? "light" : "dark") + " theme");
    };
    paint();
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* private mode */ }
      paint();
    });
  }

  function initNav() {
    const header = $("#header");
    const nav = $("#nav");
    const btn = $("#menu-btn");
    const setOpen = (open) => {
      nav.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      btn.innerHTML = icon(open ? "x" : "menu");
    };
    setOpen(false);
    btn.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });

    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Highlight the section currently in view.
    const links = new Map($$("a", nav).map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a, id) => a.classList.toggle("active", id === en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- boot ---------- */
  try {
    renderHero();
    renderProjects();
    renderShowcases();
    renderCode();
    renderAbout();
    renderContact();
    renderFooter();
    initClicks();
    initTheme();
    initNav();
  } catch (err) {
    console.error(err);
  }
})();
