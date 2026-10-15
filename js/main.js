/* ==========================================================================
   AZ9tumas Portfolio — renderer
   Reads window.PORTFOLIO_CONFIG (config.js) and builds the whole page.
   You should not need to edit this file to update content — use config.js.
   ========================================================================== */

(() => {
  "use strict";

  const C = window.PORTFOLIO_CONFIG;
  if (!C) {
    console.error("[portfolio] config.js failed to load — nothing to render.");
    return;
  }

  /* ---------- tiny helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function extLink(node, url) {
    node.href = url;
    node.target = "_blank";
    node.rel = "noopener noreferrer";
    return node;
  }

  // Required-field guard: fail loudly in the console instead of rendering
  // half-empty cards when a config entry is missing something.
  function req(obj, key, ctx) {
    if (obj[key] == null || obj[key] === "" ||
        (Array.isArray(obj[key]) && obj[key].length === 0)) {
      throw new Error('[portfolio] config error: missing "' + key + '" in ' + ctx);
    }
    return obj[key];
  }

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad2 = (n) => String(n).padStart(2, "0");

  /* ---------- icon system (Lucide, stroke 1.75, 24px grid) ----------
     One consistent family for every glyph on the site. Referenced by
     name from config (facts) and from the renderer below.            */
  const ICON_PATHS = {
    "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "arrow-up": '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    "play": '<polygon points="6 3 20 12 6 21 6 3"/>',
    "mail": '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    "message-circle": '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    "copy": '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    "check": '<path d="M20 6 9 17l-5-5"/>',
    "graduation-cap": '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    "calendar": '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    "layers": '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    "credit-card": '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    "eye": '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    "clock": '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    "moon": '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  };

  function icon(name, cls) {
    const paths = ICON_PATHS[name];
    if (!paths) throw new Error('[portfolio] unknown icon "' + name + '"');
    return (
      '<svg class="ic' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.75" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>"
    );
  }

  /* ---------- text tokens ---------- */
  const YEARS = Math.max(1, new Date().getFullYear() - C.profile.startYear);
  const fill = (s) =>
    String(s)
      .replace(/\{name\}/g, C.profile.displayName)
      .replace(/\{years\}/g, YEARS);

  // Escaped text with *word* turned into the serif-italic accent.
  const rich = (s) => esc(fill(s)).replace(/\*(.+?)\*/g, "<em>$1</em>");
  const plain = (s) => fill(s).replace(/\*(.+?)\*/g, "$1");

  // Cover hues cycle through a fixed, tuned palette; `hue` in config overrides.
  const HUES = [78, 195, 265, 22, 330, 150];
  const hueFor = (p, i) => (typeof p.hue === "number" ? p.hue : HUES[i % HUES.length]);

  /* ==========================================================
     RENDER: meta, nav, hero
     ========================================================== */
  function renderMeta() {
    document.title = plain(C.seo.title);
    const desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", plain(C.seo.description));

    const name = C.profile.displayName;
    $("#brand-name").textContent = name;
    $("#brand-mark").textContent = C.profile.monogram || name.slice(0, 2).toUpperCase();

    $("#foot-name").textContent = name;
    $("#foot-name-2").textContent = name;
    $("#wordmark").textContent = name;
    $("#foot-tag").textContent = C.profile.tagline;
    $("#foot-year").textContent = new Date().getFullYear();
    $("#to-top").innerHTML = "Back to top " + icon("arrow-up");
  }

  function renderHero() {
    $("#avail-text").textContent = C.profile.availability;
    $("#hero-title").innerHTML = rich(C.profile.heroHeadline);
    $("#hero-sub").textContent = plain(C.profile.heroSub);

    $("#hero-cta-work").innerHTML = "View shipped work " + icon("arrow-right", "ic-shift");
    const d = extLink($("#hero-cta-discord"), req(C.contact, "discordUrl", "contact"));
    d.innerHTML = icon("message-circle") + " Message on Discord";

    const stats = $("#stats");
    (C.profile.heroStats || []).forEach((s) => {
      const box = el("div", "stat");
      box.append(el("div", "stat-num", esc(s.value)));
      box.lastChild.dataset.count = s.value;
      box.append(el("div", "stat-label", esc(s.label)));
      stats.append(box);
    });

    // Floating chips around the editor: the two frameworks from config.
    const fw = C.frameworks || [];
    ["#chip-a", "#chip-b"].forEach((sel, i) => {
      const f = fw[i];
      if (!f) return;
      $(sel).innerHTML =
        '<span class="chip-icon">' + esc(f.name.charAt(0)) + "</span>" +
        '<span class="chip-text"><b>' + esc(f.name) + "</b><span>" +
        esc(f.tagline || "") + "</span></span>";
    });

    const marquee = $("#marquee");
    const items = C.skills || [];
    // Two identical halves so the -50% translate loops seamlessly.
    for (let k = 0; k < 2; k++) {
      items.forEach((s) => marquee.append(el("span", "marquee-item", esc(s))));
    }
  }

  /* ==========================================================
     HERO EDITOR: a Luau snippet that types itself out
     ========================================================== */
  const EDITOR_FILE = "MovementController.lua";
  const EDITOR_CODE = [
    "-- Client movement, built on Knit",
    "local Knit = require(Packages.Knit)",
    "",
    "local Movement = Knit.CreateController({",
    '  Name = "Movement",',
    "  SprintMultiplier = 1.6,",
    "})",
    "",
    "function Movement:KnitStart()",
    '  local stamina = Knit.GetController("Stamina")',
    "",
    "  RunService.Heartbeat:Connect(function(dt)",
    "    local goal = self:TargetSpeed(stamina)",
    "    local hum = self.Humanoid",
    "    hum.WalkSpeed += (goal - hum.WalkSpeed) * dt * 12",
    "  end)",
    "end",
    "",
    "return Movement",
  ];

  const KW = new Set(("local function end return if then else elseif for in do " +
    "while repeat until not and or break continue").split(" "));
  const LIT = new Set(["nil", "true", "false", "self"]);
  const TOKEN_RE =
    /(--.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+)|(.)/g;

  function tokenize(line) {
    const out = [];
    TOKEN_RE.lastIndex = 0;
    let m;
    while ((m = TOKEN_RE.exec(line))) {
      if (m[1]) out.push(["cm", m[1]]);
      else if (m[2]) out.push(["st", m[2]]);
      else if (m[3]) out.push(["nu", m[3]]);
      else if (m[4]) {
        const w = m[4];
        const callNext = /^\s*[({"]/.test(line.slice(TOKEN_RE.lastIndex));
        const cls = KW.has(w) ? "kw" : LIT.has(w) ? "li" : callNext ? "fn" :
          /^[A-Z]/.test(w) ? "ty" : "";
        out.push([cls, w]);
      } else out.push(["", m[5] || m[6]]);
    }
    return out;
  }

  function initEditor() {
    const code = $("#editor-code");
    const body = $("#editor-body");
    if (!code) return;
    $("#editor-tab").textContent = EDITOR_FILE;
    body.style.setProperty("--lines", EDITOR_CODE.length);

    const lines = EDITOR_CODE.map(tokenize);
    const total = EDITOR_CODE.reduce((n, l) => n + l.length, 0) + EDITOR_CODE.length - 1;

    function render(budget) {
      let left = budget;
      const out = [];
      for (let i = 0; i < lines.length; i++) {
        if (i > 0) { left -= 1; if (left < 0) break; } // the newline
        let html = "";
        for (const [cls, text] of lines[i]) {
          if (left <= 0) break;
          const part = text.slice(0, left);
          left -= part.length;
          html += cls ? '<span class="t-' + cls + '">' + esc(part) + "</span>" : esc(part);
        }
        out.push(html);
      }
      out[out.length - 1] += '<span class="caret"></span>';
      code.innerHTML = out.map((h) => '<span class="line">' + h + "</span>").join("");
    }

    if (REDUCED) { render(total); return; }

    const flat = EDITOR_CODE.join("\n");
    let typed = 0;
    render(0);
    const tick = () => {
      // Type in small bursts; pause briefly at line ends like a person would.
      typed = Math.min(total, typed + 1 + Math.floor(Math.random() * 3));
      render(typed);
      if (typed >= total) return;
      const atBreak = flat.charAt(typed) === "\n";
      setTimeout(tick, atBreak ? 140 : 22 + Math.random() * 30);
    };
    setTimeout(tick, 900);
  }

  /* ==========================================================
     RENDER: shipped work
     ========================================================== */
  function coverHTML(p, titleCls) {
    if (p.image) {
      return '<img src="' + esc(p.image) + '" alt="" loading="lazy">';
    }
    return '<span class="cover-title ' + (titleCls || "") + '">' + esc(p.title) + "</span>";
  }

  function renderFeaturedProject() {
    const f = C.projects.find((p) => p.featured);
    if (!f) return;
    const fi = C.projects.indexOf(f);

    const card = el("article", "feat spot reveal");

    const body = el("div", "feat-body");
    const top = el("div", "feat-top");
    top.append(el("span", "role-badge", esc(req(f, "role", f.title))));
    top.append(el("span", "feat-flag", "Featured · " + pad2(fi + 1)));
    body.append(top);
    body.append(el("h3", null, esc(req(f, "title", "featured project"))));
    body.append(el("p", "proj-desc", esc(req(f, "contribution", f.title))));

    if (f.tags && f.tags.length) {
      const tags = el("div", "tag-row");
      f.tags.forEach((t) => tags.append(el("span", "tag", esc(t))));
      body.append(tags);
    }
    body.append(extLink(
      el("a", "btn btn-primary", "View on Roblox " + icon("arrow-up-right", "ic-diag")),
      req(f, "url", f.title)));

    const visual = el("div", "feat-visual cover");
    visual.style.setProperty("--h", hueFor(f, fi));
    visual.innerHTML = coverHTML(f);
    const s = f.stats || {};
    const main = s.visits || s.concurrents;
    if (main) {
      const num = el("div", "feat-num", esc(main));
      num.dataset.count = main;
      visual.append(num);
      visual.append(el("div", "feat-label", s.visits ? "Visits and climbing" : "Peak concurrent players"));
      if (s.visits && s.concurrents) {
        visual.append(el("div", "feat-sub", esc(s.concurrents) + " peak concurrent players"));
      }
    }

    card.append(body, visual);
    $("#featured-slot").append(card);
  }

  function renderProjects() {
    const grid = $("#work-grid");

    C.projects.forEach((p, i) => {
      if (p.featured) return;
      const url = req(p, "url", p.title);
      const card = el("article", "proj spot reveal");

      const cover = extLink(el("a", "proj-cover cover"), url);
      cover.setAttribute("aria-label", "View " + p.title + " on Roblox");
      cover.style.setProperty("--h", hueFor(p, i));
      cover.innerHTML =
        coverHTML(p) +
        '<span class="proj-idx">' + pad2(i + 1) + "</span>" +
        '<span class="cover-arrow">' + icon("arrow-up-right") + "</span>";
      const s = p.stats || {};
      if (s.visits || s.concurrents) {
        cover.append(el("span", "cover-stat", s.visits
          ? "<b>" + esc(s.visits) + "</b><span>visits</span>"
          : "<b>" + esc(s.concurrents) + "</b><span>peak CCU</span>"));
      }
      card.append(cover);

      const body = el("div", "proj-body");
      body.append(el("span", "role-badge", esc(req(p, "role", p.title))));
      body.append(el("h3", null, esc(req(p, "title", "project"))));
      body.append(el("p", "proj-desc", esc(req(p, "contribution", p.title))));
      if (p.tags && p.tags.length) {
        const tags = el("div", "tag-row");
        p.tags.forEach((t) => tags.append(el("span", "tag", esc(t))));
        body.append(tags);
      }

      const foot = el("div", "proj-foot");
      foot.append(extLink(el("a", "text-link", "View on Roblox " + icon("arrow-up-right")), url));
      if (p.caseStudyAnchor) {
        const a = el("a", "text-link quiet", "Footage " + icon("play"));
        a.href = "#case-studies";
        foot.append(a);
      }
      body.append(foot);
      card.append(body);
      grid.append(card);
    });

    const extra = C.additionalContributions;
    if (extra && extra.count) {
      const note = el("div", "more-note reveal");
      note.append(el("span", "more-count", "+" + esc(extra.count).replace(/\+$/, "")));
      note.append(el("p", null, esc(extra.note || "Additional shipped titles.")));
      const a = el("a", "text-link", "Ask about client work " + icon("arrow-up-right"));
      a.href = "#contact";
      note.append(a);
      $("#more-note-slot").append(note);
    }
  }

  /* ==========================================================
     RENDER: case studies (lazy YouTube embeds + chapter switcher)
     ========================================================== */
  function iframeHTML(id, title) {
    return (
      '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
      '?autoplay=1&rel=0" title="' + esc(title) +
      '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>'
    );
  }

  // Media frame with thumbnail-first loading. Returns { frame, setPart }.
  function mediaFrame(item) {
    const parts = req(item, "parts", item.title);
    const frame = el("div", "media-frame");
    let current = 0;
    let playing = false;

    function render() {
      const v = parts[current];
      frame.innerHTML = "";
      if (playing) {
        frame.innerHTML = iframeHTML(v.id, item.title + " — " + (v.label || ""));
        return;
      }
      const btn = el("button", "media-thumb");
      btn.type = "button";
      btn.setAttribute("aria-label", "Play video: " + item.title + " — " + (v.label || ""));

      const img = el("img");
      img.alt = "";
      img.loading = "lazy";
      img.src = "https://i.ytimg.com/vi/" + v.id + "/maxresdefault.jpg";
      const fallback = () => {
        if (img.dataset.fb) return;
        img.dataset.fb = "1";
        img.src = "https://i.ytimg.com/vi/" + v.id + "/hqdefault.jpg";
      };
      img.addEventListener("load", () => { if (img.naturalWidth <= 120) fallback(); });
      img.addEventListener("error", fallback);

      const play = el("span", "play-badge");
      play.innerHTML =
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72L19 12 8 5.14z"/></svg>';
      btn.append(img, play);

      if (parts.length > 1) {
        btn.append(el("span", "part-flag",
          esc(v.label || "Part " + (current + 1)) + " · " +
          (current + 1) + "/" + parts.length));
      }
      btn.addEventListener("click", () => { playing = true; render(); });
      frame.append(btn);
    }

    render();
    return {
      frame,
      setPart(i) {
        if (current === i) return;
        current = i;
        render(); // keeps playing state: if the viewer was watching, the next part plays
      },
    };
  }

  function segControl(parts, onSwitch) {
    const seg = el("div", "seg");
    seg.setAttribute("role", "group");
    seg.setAttribute("aria-label", "Switch between parts");
    parts.forEach((v, i) => {
      const b = el("button", "seg-btn" + (i === 0 ? " active" : ""),
        esc(v.label || "Part " + (i + 1)));
      b.type = "button";
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      b.addEventListener("click", () => {
        $$(".seg-btn", seg).forEach((x, xi) => {
          x.classList.toggle("active", xi === i);
          x.setAttribute("aria-pressed", xi === i ? "true" : "false");
        });
        onSwitch(i);
      });
      seg.append(b);
    });
    return seg;
  }

  function renderFeaturedCaseStudy(item) {
    const card = el("article", "cs-featured reveal");
    const media = mediaFrame(item);
    card.append(media.frame);

    const body = el("div", "cs-feat-body");
    body.append(el("span", "eyebrow", "Featured case study"));
    if (item.role) body.append(el("span", "role-badge", esc(item.role)));
    body.append(el("h3", null, esc(req(item, "title", "featured case study"))));
    body.append(el("p", "cs-summary", esc(req(item, "summary", item.title))));

    if (item.highlights && item.highlights.length) {
      const ul = el("ul", "cs-highlights");
      item.highlights.forEach((h) =>
        ul.append(el("li", null, icon("check") + "<span>" + esc(h) + "</span>")));
      body.append(ul);
    }

    card.append(body);
    $("#cs-featured-slot").append(card);
  }

  function caseStudyCard(item) {
    const card = el("article", "cs-card spot reveal");
    const media = mediaFrame(item);
    card.append(media.frame);

    const meta = el("div", "cs-meta");
    // The group header above the grid already names the category, so the
    // head row only renders when it adds information: a credit-scope badge
    // and/or a part switcher.
    if (item.role || item.parts.length > 1) {
      const head = el("div", "cs-head-row");
      if (item.role) head.append(el("span", "role-badge", esc(item.role)));
      if (item.parts.length > 1) head.append(segControl(item.parts, media.setPart));
      meta.append(head);
    }

    meta.append(el("h3", "cs-title", esc(req(item, "title", "case study"))));
    meta.append(el("p", "cs-summary", esc(req(item, "summary", item.title))));
    if (item.note) {
      meta.append(el("p", "cs-note", icon("layers") + "<span>" + esc(item.note) + "</span>"));
    }

    card.append(meta);
    return card;
  }

  function renderCaseStudies() {
    const featured = C.caseStudies.find((s) => s.featured);
    if (featured) renderFeaturedCaseStudy(featured);

    // Group the rest by category, preserving config order.
    const rest = C.caseStudies.filter((s) => !s.featured);
    const groups = new Map();
    rest.forEach((s) => {
      const cat = req(s, "category", s.title);
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat).push(s);
    });

    const root = $("#cs-groups");
    groups.forEach((items, cat) => {
      const section = el("div", "cs-group");
      const head = el("div", "group-head reveal");
      head.append(el("span", "eyebrow", esc(cat)));
      head.append(el("span", "group-count", pad2(items.length)));
      section.append(head);

      const grid = el("div", "cs-grid");
      items.forEach((s) => grid.append(caseStudyCard(s)));
      section.append(grid);
      root.append(section);
    });
  }

  /* ==========================================================
     RENDER: stack, about, contact
     ========================================================== */
  function renderStack() {
    const bento = $("#bento");
    C.frameworks.forEach((f) => {
      const a = extLink(el("a", "bento-card spot reveal"), req(f, "url", f.name));
      a.append(el("div", "fw-top",
        '<span class="fw-glyph">' + esc(f.name.charAt(0)) + "</span>" +
        '<span class="fw-tagline">' + esc(f.tagline || "") + "</span>"));
      a.append(el("h3", "fw-name", esc(req(f, "name", "framework"))));
      a.append(el("p", "fw-desc", esc(f.description || "")));
      a.append(el("span", "text-link fw-link", "Documentation " + icon("arrow-up-right")));
      bento.append(a);
    });

    const card = el("div", "bento-card bento-wide spot reveal");
    card.append(el("div", "skills-head",
      "<h3>Toolkit</h3>" +
      '<span class="eyebrow">' + pad2(C.skills.length) + " disciplines</span>"));
    const cloud = el("ul", "skill-cloud");
    cloud.setAttribute("aria-label", "Skills");
    C.skills.forEach((s) => cloud.append(el("li", "skill", esc(s))));
    card.append(cloud);
    bento.append(card);
  }

  function renderAbout() {
    const copy = $("#about-copy");
    C.profile.aboutParagraphs.forEach((p, i) =>
      copy.append(el("p", i === 0 ? "about-lead" : null, esc(fill(p)))));

    const facts = $("#about-facts");
    C.profile.facts.forEach((f) => {
      facts.append(el("li", "fact",
        '<span class="fact-icon">' + icon(req(f, "icon", "fact entry")) + "</span>" +
        "<span>" + esc(fill(req(f, "text", "fact entry"))) + "</span>"));
    });
  }

  function renderContact() {
    $("#contact-copy").textContent =
      "Tell me what you're building, the systems you need and your timeline — " +
      "I'll come back with scope and availability. Discord DM is the fastest way to reach me.";

    const actions = $("#contact-actions");
    actions.append(extLink(
      el("a", "btn btn-primary btn-lg", icon("message-circle") + " Message on Discord"),
      req(C.contact, "discordUrl", "contact")));

    // Email — assembled only on click; never present in the DOM before that.
    const zone = $("#email-zone");
    const btn = el("button", "btn btn-ghost btn-lg", icon("mail") + " Reveal email");
    btn.type = "button";
    btn.addEventListener("click", () => {
      const addr = req(C.contact, "emailUser", "contact") + "@" +
                   req(C.contact, "emailDomain", "contact");
      btn.remove();
      const row = el("div", "email-row");
      const link = el("a", "email-addr", esc(addr));
      link.href = "mailto:" + addr;
      const copyBtn = el("button", "copy-btn", icon("copy") + " Copy");
      copyBtn.type = "button";
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(addr);
          copyBtn.innerHTML = icon("check") + " Copied";
        } catch {
          copyBtn.innerHTML = "Select & copy";
        }
        setTimeout(() => { copyBtn.innerHTML = icon("copy") + " Copy"; }, 1800);
      });
      row.append(link, copyBtn);
      zone.append(row);
      link.focus();
    });
    actions.append(btn);

    $("#contact-foot").innerHTML =
      "<span>" + icon("credit-card") + esc(C.contact.paymentNote) + "</span>" +
      "<span>" + icon("eye") + "Email is kept out of the page source to avoid scrapers</span>";
  }

  /* ==========================================================
     FX: theme, nav, progress, reveal, count-up, spotlight
     ========================================================== */
  const themeListeners = [];

  function initTheme() {
    const root = document.documentElement;
    const btn = $("#theme-toggle");
    const meta = $('meta[name="theme-color"]');

    function apply(theme, save) {
      root.setAttribute("data-theme", theme);
      const next = theme === "dark" ? "light" : "dark";
      btn.innerHTML = icon(theme === "dark" ? "sun" : "moon");
      btn.setAttribute("aria-label", "Switch to " + next + " theme");
      if (meta) meta.setAttribute("content", theme === "dark" ? "#08090a" : "#f6f5f1");
      if (save) { try { localStorage.setItem("theme", theme); } catch (e) { /* private mode */ } }
      themeListeners.forEach((fn) => fn());
    }

    apply(root.getAttribute("data-theme") === "light" ? "light" : "dark", false);
    btn.addEventListener("click", () =>
      apply(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true));
  }

  function initNav() {
    const nav = $("#nav");
    const bar = $("#progress");
    const onScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 12);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    const burger = $("#burger");
    const links = $("#nav-links");
    const setOpen = (open) => {
      links.classList.toggle("open", open);
      burger.classList.toggle("open", open);
      nav.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", String(open));
    };
    burger.addEventListener("click", () => setOpen(!links.classList.contains("open")));
    links.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });

    // scroll-spy
    const map = new Map();
    $$('.nav-links a[href^="#"]').forEach((a) => map.set(a.getAttribute("href").slice(1), a));
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          map.forEach((a) => a.classList.remove("active"));
          const a = map.get(en.target.id);
          if (a) a.classList.add("active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    $$("main section[id]").forEach((s) => spy.observe(s));
  }

  function initReveal() {
    const els = $$(".reveal");
    const perParent = new Map();
    els.forEach((n) => {
      const i = perParent.get(n.parentElement) || 0;
      perParent.set(n.parentElement, i + 1);
      n.style.transitionDelay = Math.min(i * 80, 320) + "ms";
    });
    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            ob.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((n) => ob.observe(n));
  }

  // "80M+" -> { pre: "", num: 80, dec: 0, suf: "M+" }; "~2.5K" -> pre "~", 2.5, dec 1, "K".
  function parseCount(s) {
    const m = String(s).match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
    if (!m) return null;
    return {
      pre: m[1],
      num: parseFloat(m[2].replace(/,/g, "")),
      dec: (m[2].split(".")[1] || "").length,
      comma: m[2].includes(","),
      suf: m[3],
    };
  }

  function initCountUp() {
    if (REDUCED) return;
    const els = $$("[data-count]");
    const ob = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        ob.unobserve(en.target);
        const node = en.target;
        const c = parseCount(node.dataset.count);
        if (!c) return;
        const fmt = (v) => c.pre + (c.comma
          ? v.toLocaleString("en-US", { minimumFractionDigits: c.dec, maximumFractionDigits: c.dec })
          : v.toFixed(c.dec)) + c.suf;
        const start = performance.now();
        const dur = 1600;
        const step = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const e = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // easeOutExpo
          node.textContent = fmt(c.num * e);
          if (t < 1) requestAnimationFrame(step);
        };
        node.textContent = fmt(0);
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    els.forEach((n) => ob.observe(n));
  }

  function initSpotlight() {
    if (!window.matchMedia("(hover: hover)").matches) return;
    $$(".spot").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }

  /* ==========================================================
     FX: hero "baseplate" — a perspective field of Roblox studs
     that drifts toward the viewer and lights up near the cursor.
     ========================================================== */
  function initStudField() {
    const canvas = $("#stud-field");
    const hero = $("#hero");
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");

    let w = 0, h = 0, colors = readColors();
    let visible = true, raf = 0;
    const t0 = performance.now();
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    function readColors() {
      const cs = getComputedStyle(document.documentElement);
      return {
        stud: cs.getPropertyValue("--stud-rgb").trim() || "255,255,255",
        accent: cs.getPropertyValue("--accent-rgb").trim() || "200,240,74",
        light: document.documentElement.getAttribute("data-theme") === "light",
      };
    }

    function resize() {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const ROWS = 40, SPACING = 0.45, CAM_H = 1.1, TAU = Math.PI * 2;

    function draw(now) {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.1;
      mouse.y += (mouse.ty - mouse.y) * 0.1;

      const f = Math.max(w, 640) * 0.5;      // focal length
      const horizon = h * 0.46;
      const cx = w * 0.5;
      const drift = REDUCED ? 0 : (t * 0.28) % 1;
      const base = colors.light ? 0.26 : 0.24;

      for (let zi = 0; zi < ROWS; zi++) {
        const z = (zi + 1 - drift) * SPACING;
        if (z < 0.3) continue;
        const depth = zi / ROWS;
        const fade = Math.pow(1 - depth, 1.6) * Math.min(1, (zi + 1 - drift) / 2);
        const span = Math.ceil(((cx + 40) / f) * z / SPACING);
        const r = Math.min(4.5, Math.max(0.6, (0.014 * f) / z));

        for (let xi = -span; xi <= span; xi++) {
          const wx = xi * SPACING;
          const wave = REDUCED ? 0 : Math.sin(wx * 0.9 + z * 0.8 - t * 1.1) * 0.05;
          const sx = cx + (wx * f) / z;
          const sy = horizon + ((CAM_H + wave) * f) / z;
          if (sy > h + 20 || sx < -20 || sx > w + 20) continue;

          const dx = sx - mouse.x, dy = sy - mouse.y;
          const glow = Math.exp(-(dx * dx + dy * dy) / 26000);
          const a = fade * (base + glow * 0.9);
          if (a < 0.01) continue;
          ctx.fillStyle = "rgba(" + (glow > 0.08 ? colors.accent : colors.stud) + "," + a.toFixed(3) + ")";
          ctx.beginPath();
          ctx.arc(sx, sy, r * (1 + glow * 0.5), 0, TAU);
          ctx.fill();
        }
      }
    }

    function loop(now) {
      draw(now);
      raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    }
    const start = () => { if (!raf && !REDUCED) raf = requestAnimationFrame(loop); };

    resize();
    draw(performance.now());

    window.addEventListener("resize", () => { resize(); draw(performance.now()); });
    themeListeners.push(() => { colors = readColors(); draw(performance.now()); });

    if (REDUCED) return;

    hero.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
    });
    hero.addEventListener("pointerleave", () => { mouse.tx = -9999; mouse.ty = -9999; });

    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start();
    }).observe(hero);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) start(); });
    start();
  }

  // Scale the footer wordmark so it spans the container exactly.
  function fitWordmark() {
    const wm = $("#wordmark");
    const fit = () => {
      wm.style.fontSize = "100px";
      const range = document.createRange();
      range.selectNodeContents(wm);
      const textW = range.getBoundingClientRect().width;
      if (textW) wm.style.fontSize = Math.floor((100 * wm.clientWidth / textW) * 0.98) + "px";
    };
    fit();
    window.addEventListener("resize", fit);
    if (document.fonts) document.fonts.ready.then(fit);
  }

  /* ---------- boot ---------- */
  try {
    renderMeta();
    initTheme();
    renderHero();
    initEditor();
    renderFeaturedProject();
    renderProjects();
    renderCaseStudies();
    renderStack();
    renderAbout();
    renderContact();
    initReveal();
    initCountUp();
    initSpotlight();
    initNav();
    initStudField();
    fitWordmark();
  } catch (err) {
    console.error(err);
  }
})();
