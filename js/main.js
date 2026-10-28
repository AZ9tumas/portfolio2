/* ==========================================================================
   AZ9tumas Portfolio — renderer
   Builds a small documentation site from window.PORTFOLIO_CONFIG:
   hash-routed pages, sidebar, "On this page" rail, search (⌘K / Ctrl K),
   code blocks and video embeds. Content lives in config.js.
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

  // Escaped text with `backticks` rendered as inline code.
  const text = (s) => esc(fill(s)).replace(/`([^`]+)`/g, '<code class="inline">$1</code>');

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  /* ---------- icons (Lucide, 1.75 stroke) ---------- */
  const ICONS = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
    hash: '<line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>',
    list: '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
    gamepad: '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    card: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  };
  const icon = (name) =>
    '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.6v14.8a1 1 0 0 0 1.5.86l12.2-7.4a1 1 0 0 0 0-1.72L8.5 3.74A1 1 0 0 0 7 4.6z"/></svg>';

  /* ==========================================================
     LUAU HIGHLIGHTER (one line at a time; enough for docs snippets)
     ========================================================== */
  const KW = new Set(("local function end return if then else elseif for in do while repeat " +
    "until not and or break continue export type").split(" "));
  const LIT = new Set(["nil", "true", "false", "self"]);
  const TOKEN_RE =
    /(--.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+)|(.)/g;

  function highlightLine(line) {
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

  /* ==========================================================
     BUILDING BLOCKS
     ========================================================== */
  let currentPath = "";
  const codeStore = [];   // raw source for copy buttons

  const h2 = (id, title) =>
    '<h2 id="' + id + '" class="anchor"><a class="hash" href="#/' + currentPath + ":" + id +
    '" aria-label="Link to ' + esc(title) + '">#</a>' + esc(title) + "</h2>";
  const h3 = (id, title) =>
    '<h3 id="' + id + '" class="anchor"><a class="hash" href="#/' + currentPath + ":" + id +
    '" aria-label="Link to ' + esc(title) + '">#</a>' + esc(title) + "</h3>";

  const callout = (kind, ic, html) =>
    '<div class="callout callout-' + kind + '">' + icon(ic) + "<div>" + html + "</div></div>";

  const ext = (url, label) =>
    '<a class="link" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + label + "</a>";

  function table(headers, rows) {
    return '<div class="table-wrap"><table><thead><tr>' +
      headers.map((h) => "<th>" + esc(h) + "</th>").join("") + "</tr></thead><tbody>" +
      rows.map((r) => "<tr>" + r.map((c) =>
        typeof c === "object" ? '<td class="' + c.cls + '">' + c.html + "</td>" : "<td>" + c + "</td>").join("") + "</tr>").join("") +
      "</tbody></table></div>";
  }

  function keyTable(rows, plainKeys) {
    return '<div class="table-wrap table-key' + (plainKeys ? " plain-keys" : "") + '"><table><tbody>' +
      rows.map(([k, v]) => "<tr><td>" + esc(k) + "</td><td>" + v + "</td></tr>").join("") +
      "</tbody></table></div>";
  }

  function code({ file, lang, code: src, numbered = true }) {
    const i = codeStore.push(src) - 1;
    // Tabs are expanded for display: tab stops would otherwise count the
    // line-number gutter. Copy still uses the original source.
    const lines = src.replace(/\t/g, "    ").split("\n").map((l) =>
      '<span class="line">' + (lang === "luau" ? highlightLine(l) : esc(l)) + "</span>").join("");
    return '<div class="code' + (numbered ? " numbered" : "") + '">' +
      '<div class="code-head"><span class="code-file">' + esc(file || "") + "</span>" +
      '<span class="code-lang">' + esc(lang === "luau" ? "Luau" : "Text") + "</span>" +
      '<button class="copy-btn" type="button" data-copy="' + i + '">' + icon("copy") + "Copy</button></div>" +
      "<pre><code>" + lines + "</code></pre></div>";
  }

  function cards(list) {
    return '<div class="cards">' + list.map((c) =>
      '<a class="card" href="' + esc(c.href) + '"' + (c.external ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" +
      '<span class="card-icon">' + icon(c.icon) + "</span>" +
      '<span class="card-title">' + esc(c.title) + icon(c.external ? "arrow-up-right" : "arrow-right") + "</span>" +
      '<span class="card-desc">' + esc(c.desc) + "</span></a>").join("") + "</div>";
  }

  const bullets = (items) =>
    '<ul class="bullets">' + items.map((b) => "<li>" + text(b) + "</li>").join("") + "</ul>";

  function video(item) {
    const parts = item.parts || [];
    const tabs = parts.length > 1
      ? '<div class="tabs" role="tablist" aria-label="Chapters">' + parts.map((p, i) =>
          '<button class="tab" type="button" role="tab" aria-selected="' + (i === 0) + '" data-part="' + i + '">' +
          esc(p.label || "Part " + (i + 1)) + "</button>").join("") + "</div>"
      : "";
    return '<div class="video" data-parts="' + esc(JSON.stringify(parts)) + '" data-title="' + esc(item.title) + '">' +
      tabs + '<div class="video-frame">' + thumb(parts[0], item.title) + "</div>" +
      (item.note ? '<div class="video-caption">' + text(item.note) + "</div>" : "") + "</div>";
  }

  function thumb(part, title) {
    return '<button class="video-thumb" type="button" data-id="' + esc(part.id) + '" aria-label="Play ' +
      esc(title + (part.label ? " — " + part.label : "")) + '">' +
      '<img src="https://i.ytimg.com/vi/' + encodeURIComponent(part.id) + '/hqdefault.jpg" alt="" loading="lazy">' +
      '<span class="video-play">' + PLAY + "Play</span></button>";
  }

  const badge = (label, kind) =>
    '<span class="badge' + (kind ? " badge-" + kind : "") + '">' +
    (kind === "green" || kind === "amber" ? '<span class="dot"></span>' : "") + esc(label) + "</span>";

  const statusBadge = (s) => s ? badge(s, /live/i.test(s) ? "green" : "amber") : "";

  function metricOf(p) {
    const s = p.stats || {};
    if (s.visits) return s.visits + " visits";
    if (s.concurrents) return s.concurrents + " peak CCU";
    return "—";
  }

  // What each credit means — used on the Credits page and project pages.
  const ROLE_NOTES = {
    "Core Contributor": "Built core systems as part of the development team.",
    "Solo Developer — Full Stack": "Built the entire game alone — every front-end and back-end system.",
    "Refactoring Engineer": "Restructured an existing codebase I didn't originally write.",
    "Front-End Scripter": "Client-side gameplay flow, UI and presentation.",
    "Scripter": "Gameplay scripting as part of the development team.",
  };

  /* ==========================================================
     PAGES
     ========================================================== */
  const projects = C.projects;
  const systems = C.caseStudies.filter((s) => !s.project);
  const footageFor = (slug) => C.caseStudies.find((s) => s.project === slug);
  const discord = C.contact.discordUrl;

  const PAGES = [];
  const page = (p) => PAGES.push(p);

  page({
    path: "", group: "Getting started", title: "Introduction", icon: "book",
    desc: C.profile.tagline,
    render: () => {
      const featured = projects.slice(0, 3);
      const caseStudy = systems.find((s) => s.featured) || systems[0];
      return (
        '<p class="breadcrumb">Getting started</p>' +
        "<h1>" + esc(C.profile.displayName) + "</h1>" +
        '<p class="lead">' + text(C.profile.intro) + "</p>" +
        '<div class="page-meta">' + badge(C.profile.availability, "green") + badge(C.profile.tagline) +
        badge("Since " + C.profile.startYear) + "</div>" +
        '<div class="stats">' + C.profile.stats.map((s) =>
          '<div class="stat"><div class="stat-value">' + esc(s.value) + '</div><div class="stat-label">' +
          esc(s.label) + '</div><div class="stat-note">' + esc(s.note || "") + "</div></div>").join("") + "</div>" +

        h2("start-here", "Start here") +
        "<p>These docs cover the games I've shipped, the systems I've built and how I structure code. Every page states the exact scope of my contribution.</p>" +
        cards([
          { href: "#/credits", icon: "list", title: "Credits", desc: "Every shipped title and system, with my role on each." },
          { href: "#/systems/" + (caseStudy ? caseStudy.slug : ""), icon: "play", title: caseStudy ? caseStudy.title : "Systems", desc: caseStudy ? "Case study — " + (caseStudy.role || "recorded footage") + "." : "" },
          { href: "#/engineering/architecture", icon: "code", title: "Architecture", desc: "The conventions I follow, with Luau examples." },
          { href: "#/contact", icon: "message", title: "Work with me", desc: "How to reach me and how a commission starts." },
        ]) +

        h2("selected-work", "Selected work") +
        table(["Title", "Role", "Result"], featured.map((p) => [
          '<a href="#/projects/' + p.slug + '">' + esc(p.title) + "</a>", esc(p.role), { cls: "num", html: esc(metricOf(p)) },
        ])) +
        '<p><a class="link" href="#/credits">See all credits</a></p>' +

        h2("availability", "Availability") +
        callout("success", "zap", "<strong>" + esc(C.profile.availability) + ".</strong> The fastest way to reach me is a Discord DM — " +
          ext(discord, "message me") + " or see <a class=\"link\" href=\"#/contact\">Work with me</a>.")
      );
    },
  });

  page({
    path: "credits", group: "Getting started", title: "Credits", icon: "list",
    desc: "Shipped titles and systems, with the exact scope of each contribution.",
    render: () =>
      '<p class="breadcrumb">Getting started</p><h1>Credits</h1>' +
      '<p class="lead">Shipped titles and systems I\'ve worked on, with the exact scope of each contribution.</p>' +
      h2("shipped-titles", "Shipped titles") +
      table(["Title", "Role", "Result", "Status"], projects.map((p) => [
        '<a href="#/projects/' + p.slug + '">' + esc(p.title) + "</a>", esc(p.role),
        { cls: "num", html: esc(metricOf(p)) }, p.status ? statusBadge(p.status) : "—",
      ])) +
      (C.additionalContributions ? "<p>" + text(C.additionalContributions) + "</p>" : "") +
      h2("systems", "Systems & footage") +
      table(["System", "Scope", "Footage"], systems.map((s) => [
        '<a href="#/systems/' + s.slug + '">' + esc(s.title) + "</a>", s.role ? esc(s.role) : "System showcase",
        { cls: "num", html: s.parts.length + (s.parts.length > 1 ? " parts" : " video") },
      ])) +
      h2("roles", "Reading the roles") +
      "<p>Credit scope is stated precisely — a role tells you exactly what I was responsible for.</p>" +
      keyTable(Object.entries(ROLE_NOTES).map(([k, v]) => [k, esc(v)]), true),
  });

  projects.forEach((p) => page({
    path: "projects/" + p.slug, group: "Shipped titles", title: p.title, icon: "gamepad",
    desc: p.role + " · " + metricOf(p), meta: (p.stats && (p.stats.visits || p.stats.concurrents)) || "",
    render: () => {
      const s = p.stats || {};
      const rows = [["role", esc(p.role)], ["platform", "Roblox"]];
      if (s.visits) rows.push(["visits", '<span class="num">' + esc(s.visits) + "</span>"]);
      if (s.concurrents) rows.push(["peak_ccu", '<span class="num">' + esc(s.concurrents) + "</span>"]);
      if (p.status) rows.push(["status", statusBadge(p.status)]);
      rows.push(["link", ext(p.url, "roblox.com " + icon("arrow-up-right"))]);
      const foot = footageFor(p.slug);
      return (
        '<p class="breadcrumb">Shipped titles</p><h1>' + esc(p.title) + "</h1>" +
        '<p class="lead">' + text(p.summary) + "</p>" +
        '<div class="page-meta">' + badge(p.role, "accent") + statusBadge(p.status) +
        (p.tags || []).map((t) => badge(t)).join("") + "</div>" +
        h2("overview", "Overview") + keyTable(rows) +
        h2("scope", "Scope of work") +
        "<p><strong>" + esc(p.role) + ".</strong> " + esc(ROLE_NOTES[p.role] || "") + "</p>" +
        (p.highlights && p.highlights.length ? bullets(p.highlights) : "") +
        (foot ? h2("footage", "Footage") + "<p>" + text(foot.summary) + "</p>" + video(foot) : "") +
        h2("links", "Links") +
        cards([
          { href: p.url, external: true, icon: "gamepad", title: "Play on Roblox", desc: "Open " + p.title + " on roblox.com." },
          { href: "#/contact", icon: "message", title: "Discuss a similar project", desc: "Tell me what you're building." },
        ])
      );
    },
  }));

  systems.forEach((s) => page({
    path: "systems/" + s.slug, group: "Systems & footage", title: s.title, icon: "play",
    desc: s.role || "System showcase",
    render: () =>
      '<p class="breadcrumb">Systems &amp; footage</p><h1>' + esc(s.title) + "</h1>" +
      '<p class="lead">' + text(s.summary) + "</p>" +
      '<div class="page-meta">' + (s.role ? badge(s.role, "accent") : badge("System showcase")) +
      badge(s.parts.length > 1 ? s.parts.length + " chapters" : "Recorded footage") + "</div>" +
      h2("footage", "Footage") + video(s) +
      (s.highlights && s.highlights.length ? h2("highlights", "Highlights") + bullets(s.highlights) : "") +
      h2("related", "Related") +
      cards([
        { href: "#/engineering/architecture", icon: "code", title: "Architecture", desc: "How systems like this are structured." },
        { href: "#/contact", icon: "message", title: "Commission a system", desc: "Discuss scope and availability." },
      ]),
  }));

  const E = C.engineering || {};
  page({
    path: "engineering/architecture", group: "Engineering", title: "Architecture", icon: "layers",
    desc: "Conventions, project layout and Luau examples.",
    render: () =>
      '<p class="breadcrumb">Engineering</p><h1>Architecture &amp; conventions</h1>' +
      '<p class="lead">' + text(E.intro || "") + "</p>" +
      callout("info", "info", "The snippets below are simplified, representative examples of the patterns I use — not code lifted from a client project.") +
      h2("principles", "Principles") +
      '<div class="grid-2">' + (E.principles || []).map((p) =>
        '<div class="principle"><div class="principle-title">' + esc(p.title) + "</div><p>" + text(p.body) + "</p></div>").join("") + "</div>" +
      (E.layout ? h2("layout", E.layout.title) +
        "<p>Every place follows the same shape: services on the server, controllers on the client, shared code in one place.</p>" +
        code({ file: E.layout.file, lang: E.layout.lang, code: E.layout.code, numbered: false }) : "") +
      (E.snippets || []).map((s) => h2(s.id, s.title) + "<p>" + text(s.description) + "</p>" + code(s)).join("") +
      h2("frameworks", "Frameworks") +
      table(["Framework", "Used for", "Docs"], C.frameworks.map((f) => [
        "<strong>" + esc(f.name) + "</strong>", esc(f.tagline + " — " + f.description), ext(f.url, "Docs " + icon("arrow-up-right")),
      ])),
  });

  page({
    path: "engineering/toolkit", group: "Engineering", title: "Toolkit", icon: "zap",
    desc: "Frameworks and the disciplines I work across.",
    render: () =>
      '<p class="breadcrumb">Engineering</p><h1>Toolkit</h1>' +
      '<p class="lead">The frameworks I build on and the disciplines I work across.</p>' +
      h2("frameworks", "Frameworks") +
      cards(C.frameworks.map((f) => ({ href: f.url, external: true, icon: "layers", title: f.name, desc: f.tagline + " — " + f.description }))) +
      h2("disciplines", "Disciplines") +
      '<div class="chips">' + C.skills.map((s) => '<span class="chip">' + esc(s) + "</span>").join("") + "</div>",
  });

  page({
    path: "about", group: "Work with me", title: "About", icon: "user",
    desc: "Background, focus and education.",
    render: () => {
      const [first, ...rest] = C.profile.aboutParagraphs;
      return '<p class="breadcrumb">Work with me</p><h1>About</h1>' +
        '<p class="lead">' + text(first) + "</p>" + rest.map((p) => "<p>" + text(p) + "</p>").join("") +
        h2("profile", "Profile") +
        keyTable(C.profile.facts.map((f) => [f.key.toLowerCase(), text(f.value)])) +
        h2("next", "Next steps") +
        cards([
          { href: "#/credits", icon: "list", title: "Credits", desc: "Everything I've shipped, with my role on each." },
          { href: "#/contact", icon: "message", title: "Work with me", desc: "Channels and how a commission starts." },
        ]);
    },
  });

  page({
    path: "contact", group: "Work with me", title: "Contact", icon: "message",
    desc: "Discord, email and how a commission starts.",
    render: () =>
      '<p class="breadcrumb">Work with me</p><h1>Work with me</h1>' +
      '<p class="lead">' + esc(C.profile.availability) + ". Tell me what you're building, the systems you need and your timeline — I'll come back with scope and availability.</p>" +
      h2("channels", "Channels") +
      '<div class="channels">' +
        '<div class="channel"><span class="channel-icon">' + icon("message") + '</span><div class="channel-text">' +
          '<div class="channel-title">Discord</div><div class="channel-sub">Fastest reply — send a DM</div></div>' +
          '<a class="btn btn-primary btn-sm" href="' + esc(discord) + '" target="_blank" rel="noopener noreferrer">Message ' + icon("arrow-up-right") + "</a></div>" +
        '<div class="channel" id="email-channel"><span class="channel-icon">' + icon("mail") + '</span><div class="channel-text">' +
          '<div class="channel-title">Email</div><div class="channel-sub" id="email-sub">Hidden from scrapers until you reveal it</div></div>' +
          '<button class="btn btn-secondary btn-sm" type="button" id="email-btn">Reveal</button></div>' +
        '<div class="channel"><span class="channel-icon">' + icon("card") + '</span><div class="channel-text">' +
          '<div class="channel-title">Payment</div><div class="channel-sub">' + esc(C.contact.paymentNote) + "</div></div></div>" +
      "</div>" +
      h2("how-it-works", "How a commission starts") +
      '<div class="steps">' +
        '<div class="step"><div class="step-title">Send a short brief</div><p>What you\'re building, the systems you need and your timeline.</p></div>' +
        '<div class="step"><div class="step-title">Get scope and availability</div><p>I reply with what the work involves and when I can start.</p></div>' +
        '<div class="step"><div class="step-title">Agree on payment</div><p>' + esc(C.contact.paymentNote) + ".</p></div>" +
      "</div>",
  });

  const GROUP_ORDER = ["Getting started", "Shipped titles", "Systems & footage", "Engineering", "Work with me"];
  PAGES.sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group));
  const byPath = new Map(PAGES.map((p) => [p.path, p]));

  /* ==========================================================
     CHROME: sidebar, header, rail
     ========================================================== */
  function renderSidebar() {
    const nav = $("#sidebar-nav");
    nav.innerHTML = GROUP_ORDER.map((g) => {
      const items = PAGES.filter((p) => p.group === g);
      if (!items.length) return "";
      return '<div class="nav-group"><p class="nav-group-title">' + esc(g) + "</p>" +
        items.map((p) => '<a class="nav-link" href="#/' + p.path + '" data-path="' + p.path + '"><span>' + esc(p.title) +
          "</span>" + (p.meta ? '<span class="nav-meta">' + esc(p.meta) + "</span>" : "") + "</a>").join("") + "</div>";
    }).join("");

    $("#sidebar-foot").innerHTML =
      '<div class="status"><span class="status-dot"></span>' + esc(C.profile.availability) + "</div>" +
      '<a href="' + esc(discord) + '" target="_blank" rel="noopener noreferrer">Message on Discord →</a>';
  }

  function renderChrome() {
    const mono = C.profile.monogram || C.profile.displayName.slice(0, 2).toUpperCase();
    $("#brand-mark").textContent = mono;
    $("#brand-name").textContent = C.profile.displayName;
    $("#menu-btn").innerHTML = icon("menu");
    $("#search-btn-icon").innerHTML = icon("search");
    $("#search-field-icon").innerHTML = icon("search");
    $("#search-kbd").textContent = IS_MAC ? "⌘K" : "Ctrl K";
  }

  /* ==========================================================
     ROUTER
     ========================================================== */
  function parseHash() {
    const raw = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    const [path, anchor] = raw.split(":");
    return { path: path.replace(/\/$/, ""), anchor: anchor || "" };
  }

  function route() {
    const { path, anchor } = parseHash();
    if (path === currentPath && $("#doc").childElementCount) {
      scrollToAnchor(anchor, true);
      return;
    }
    const p = byPath.get(path);
    currentPath = p ? path : path;
    codeStore.length = 0;

    const doc = $("#doc");
    if (p) {
      const i = PAGES.indexOf(p);
      const prev = PAGES[i - 1], next = PAGES[i + 1];
      doc.innerHTML = '<div class="prose">' + p.render() + "</div>" +
        '<nav class="pager" aria-label="Pagination">' +
          (prev ? '<a class="pager-link prev" href="#/' + prev.path + '"><span class="pager-label">Previous</span><span class="pager-title">« ' + esc(prev.title) + "</span></a>" : "") +
          (next ? '<a class="pager-link next" href="#/' + next.path + '"><span class="pager-label">Next</span><span class="pager-title">' + esc(next.title) + " »</span></a>" : "") +
        "</nav>" +
        '<footer class="doc-foot"><span>© ' + new Date().getFullYear() + " " + esc(C.profile.displayName) + "</span>" +
        '<a href="#/contact">' + esc(C.profile.availability) + " →</a></footer>";
      document.title = (p.path ? p.title + " — " : "") + C.seo.title;
    } else {
      doc.innerHTML = '<div class="prose"><p class="breadcrumb">404</p><h1>Page not found</h1>' +
        '<p class="lead">There\'s no page at this address.</p>' +
        cards([{ href: "#/", icon: "book", title: "Introduction", desc: "Start from the beginning." }]) + "</div>";
      document.title = "Not found — " + C.seo.title;
    }

    if (!REDUCED) {
      doc.classList.remove("enter");
      void doc.offsetWidth;
      doc.classList.add("enter");
    }

    $$(".nav-link").forEach((a) => {
      const on = a.dataset.path === path;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    const section = path.startsWith("engineering") ? "engineering"
      : path === "about" ? "about"
      : /^(credits|projects|systems)/.test(path) ? "credits" : "";
    $$("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === section));

    renderToc();
    closeMenu();
    scrollToAnchor(anchor, false);
  }

  function scrollToAnchor(anchor, smooth) {
    const target = anchor && document.getElementById(anchor);
    if (target) target.scrollIntoView({ behavior: smooth && !REDUCED ? "smooth" : "auto" });
    else window.scrollTo(0, 0);
    updateToc();
  }

  /* ---------- on this page ---------- */
  function renderToc() {
    const heads = $$("#doc h2, #doc h3");
    const toc = $("#toc");
    toc.innerHTML =
      (heads.length
        ? '<p class="toc-title">' + icon("list") + "On this page</p>" +
          '<nav class="toc-list">' + heads.map((h) =>
            '<a href="#/' + currentPath + ":" + h.id + '" data-id="' + h.id + '"' + (h.tagName === "H3" ? ' class="sub"' : "") + ">" +
            esc(h.textContent.replace(/^#/, "")) + "</a>").join("") + "</nav>"
        : "") +
      '<div class="toc-cta"><p class="toc-cta-title">' + esc(C.profile.availability) + "</p>" +
      "<p>Tell me what you're building — Discord DM is fastest.</p>" +
      '<a class="btn btn-primary btn-sm" href="#/contact">Hire me</a></div>';
  }

  function updateToc() {
    const heads = $$("#doc h2, #doc h3");
    let active = heads.length ? heads[0].id : "";
    for (const h of heads) {
      if (h.getBoundingClientRect().top < 120) active = h.id;
      else break;
    }
    // At the very bottom, highlight the last section.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && heads.length) {
      active = heads[heads.length - 1].id;
    }
    $$(".toc-list a").forEach((a) => a.classList.toggle("active", a.dataset.id === active));
  }

  /* ==========================================================
     INTERACTIONS (delegated)
     ========================================================== */
  function initInteractions() {
    document.addEventListener("click", async (e) => {
      // The skip link targets #content, which the hash router would treat as a page.
      if (e.target.closest(".skip-link")) {
        e.preventDefault();
        $("#content").focus();
        return;
      }

      const copy = e.target.closest(".copy-btn");
      if (copy) {
        const src = codeStore[+copy.dataset.copy] || "";
        try {
          await navigator.clipboard.writeText(src);
          copy.innerHTML = icon("check") + "Copied";
        } catch {
          copy.textContent = "Select to copy";
        }
        setTimeout(() => { copy.innerHTML = icon("copy") + "Copy"; }, 1600);
        return;
      }

      const th = e.target.closest(".video-thumb");
      if (th) {
        const box = th.closest(".video");
        th.parentElement.innerHTML =
          '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(th.dataset.id) +
          '?autoplay=1&rel=0" title="' + esc(box.dataset.title) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
        box.dataset.playing = "1";
        return;
      }

      const tab = e.target.closest(".video .tab");
      if (tab) {
        const box = tab.closest(".video");
        const parts = JSON.parse(box.dataset.parts);
        const part = parts[+tab.dataset.part];
        $$(".tab", box).forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
        const frame = $(".video-frame", box);
        if (box.dataset.playing) {
          frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(part.id) +
            '?autoplay=1&rel=0" title="' + esc(box.dataset.title + " — " + (part.label || "")) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
        } else {
          frame.innerHTML = thumb(part, box.dataset.title);
        }
        return;
      }

      if (e.target.closest("#email-btn")) revealEmail(e.target.closest("#email-btn"));
    });

    window.addEventListener("scroll", updateToc, { passive: true });
  }

  // Email — assembled only on click; never present in the page before that.
  function revealEmail(btn) {
    const addr = C.contact.emailUser + "@" + C.contact.emailDomain;
    if (btn.dataset.revealed) {
      navigator.clipboard.writeText(addr).then(
        () => { btn.textContent = "Copied"; setTimeout(() => { btn.textContent = "Copy"; }, 1600); },
        () => { btn.textContent = "Select to copy"; });
      return;
    }
    $("#email-sub").innerHTML = '<a href="mailto:' + esc(addr) + '">' + esc(addr) + "</a>";
    btn.textContent = "Copy";
    btn.dataset.revealed = "1";
  }

  /* ---------- theme ---------- */
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

  /* ---------- mobile menu ---------- */
  function closeMenu() {
    $("#sidebar").classList.remove("open");
    $("#scrim").hidden = true;
    $("#menu-btn").setAttribute("aria-expanded", "false");
    $("#menu-btn").innerHTML = icon("menu");
  }
  function initMenu() {
    const btn = $("#menu-btn");
    btn.addEventListener("click", () => {
      const open = !$("#sidebar").classList.contains("open");
      if (!open) return closeMenu();
      $("#sidebar").classList.add("open");
      $("#scrim").hidden = false;
      btn.setAttribute("aria-expanded", "true");
      btn.innerHTML = icon("x");
    });
    $("#scrim").addEventListener("click", closeMenu);
  }

  /* ==========================================================
     SEARCH (⌘K / Ctrl K / "/")
     ========================================================== */
  let INDEX = [];

  function buildIndex() {
    const saved = currentPath;
    const tmp = document.createElement("div");
    INDEX = [];
    PAGES.forEach((p) => {
      currentPath = p.path;
      tmp.innerHTML = p.render();
      // Pages match on their full text; sections match on their heading.
      INDEX.push({ kind: "page", title: p.title, sub: p.group + " · " + p.desc, href: "#/" + p.path, icon: p.icon,
        hay: (p.title + " " + p.desc + " " + p.group + " " + tmp.textContent).toLowerCase() });
      $$("h2", tmp).forEach((h) => {
        const t = h.textContent.replace(/^#/, "");
        INDEX.push({ kind: "section", title: t, sub: p.title, href: "#/" + p.path + ":" + h.id, icon: "hash", hay: (t + " " + p.title).toLowerCase() });
      });
    });
    currentPath = saved;
    codeStore.length = 0;
  }

  function initSearch() {
    const dlg = $("#search");
    const input = $("#search-input");
    const list = $("#search-results");
    let results = [];
    let sel = 0;

    function draw() {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        results = INDEX.filter((r) => r.kind === "page");
      } else {
        const words = q.split(/\s+/);
        // Title hits first, then description hits, then body-text hits.
        const score = (r) => {
          const t = r.title.toLowerCase();
          return t.startsWith(q) ? 3 : words.every((w) => t.includes(w)) ? 2 :
            words.every((w) => r.sub.toLowerCase().includes(w)) ? 1 : 0;
        };
        results = INDEX.filter((r) => words.every((w) => r.hay.includes(w)))
          .map((r) => ({ r, s: score(r) }))
          .sort((a, b) => (b.s - a.s) || ((a.r.kind === "page" ? 0 : 1) - (b.r.kind === "page" ? 0 : 1)))
          .slice(0, 12)
          .map((x) => x.r);
      }
      sel = Math.min(sel, Math.max(0, results.length - 1));
      if (!results.length) {
        list.innerHTML = '<li class="search-empty">No results for “' + esc(input.value) + "”</li>";
        return;
      }
      let lastGroup = "";
      list.innerHTML = results.map((r, i) => {
        const group = !q ? r.sub.split(" · ")[0] : (r.kind === "page" ? "Pages" : "Sections");
        const head = group !== lastGroup ? '<li class="search-group" role="presentation">' + esc(group) + "</li>" : "";
        lastGroup = group;
        return head + '<li class="search-item" role="option" id="sr-' + i + '" aria-selected="' + (i === sel) + '">' +
          '<a href="' + r.href + '">' + icon(r.icon) + '<span class="search-item-text"><span class="search-item-title">' +
          esc(r.title) + '</span><span class="search-item-sub">' + esc(r.kind === "page" ? r.sub.split(" · ").slice(1).join(" · ") : r.sub) +
          "</span></span></a></li>";
      }).join("");
      const cur = $("#sr-" + sel);
      if (cur) cur.scrollIntoView({ block: "nearest" });
      input.setAttribute("aria-activedescendant", "sr-" + sel);
    }

    const open = () => {
      if (dlg.open) return;
      input.value = "";
      sel = 0;
      draw();
      dlg.showModal();
      input.focus();
    };
    const close = () => dlg.open && dlg.close();

    $("#search-btn").addEventListener("click", open);
    input.addEventListener("input", () => { sel = 0; draw(); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(results.length - 1, sel + 1); draw(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, sel - 1); draw(); }
      else if (e.key === "Enter" && results[sel]) { e.preventDefault(); location.hash = results[sel].href; close(); }
    });
    list.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
    dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });

    document.addEventListener("keydown", (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) { e.preventDefault(); dlg.open ? close() : open(); }
      else if (e.key === "/" && !typing && !dlg.open) { e.preventDefault(); open(); }
      else if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- boot ---------- */
  try {
    renderChrome();
    renderSidebar();
    initTheme();
    initMenu();
    initInteractions();
    buildIndex();
    initSearch();
    window.addEventListener("hashchange", route);
    route();
  } catch (err) {
    console.error(err);
  }
})();
