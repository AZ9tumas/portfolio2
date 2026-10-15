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
  const HOVER = window.matchMedia("(hover: hover)").matches;
  const pad2 = (n) => String(n).padStart(2, "0");

  /* ---------- icon system (Lucide, rounded 2px stroke — close to SF Symbols) */
  const ICON_PATHS = {
    "home": '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    "disc": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2.5"/>',
    "tv": '<path d="M10 7.75a.75.75 0 0 1 1.142-.638l3.664 2.249a.75.75 0 0 1 0 1.278l-3.664 2.25a.75.75 0 0 1-1.142-.64z"/><path d="M7 21h10"/><rect width="20" height="14" x="2" y="3" rx="2"/>',
    "cpu": '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
    "user": '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    "send": '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    "ellipsis": '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    "x": '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    "mail": '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    "message-circle": '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    "copy": '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    "check": '<path d="M20 6 9 17l-5-5"/>',
    "graduation-cap": '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    "calendar": '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    "layers": '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    "credit-card": '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    "eye": '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    "moon": '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  };

  function icon(name, cls) {
    const paths = ICON_PATHS[name];
    if (!paths) throw new Error('[portfolio] unknown icon "' + name + '"');
    return (
      '<svg class="ic' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>"
    );
  }
  const PLAY_SVG =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.6v14.8a1 1 0 0 0 1.5.86l12.2-7.4a1 1 0 0 0 0-1.72L8.5 3.74A1 1 0 0 0 7 4.6z"/></svg>';

  /* ---------- text tokens ---------- */
  const YEARS = Math.max(1, new Date().getFullYear() - C.profile.startYear);
  const fill = (s) =>
    String(s)
      .replace(/\{name\}/g, C.profile.displayName)
      .replace(/\{years\}/g, YEARS);
  const plain = (s) => fill(s).replace(/\*(.+?)\*/g, "$1");

  /* ---------- artwork ----------
     Every project gets album-style art: a four-colour mesh gradient with
     film grain and the title set in heavy type. Colours come from `art`
     in config; these are the fallbacks.                                   */
  const FALLBACK_ART = [
    ["#f4a259", "#e76f51", "#264653", "#2a9d8f"],
    ["#bde0fe", "#4cc9f0", "#3a0ca3", "#4361ee"],
    ["#ffd60a", "#ff7b00", "#d00000", "#ffb703"],
    ["#ff99c8", "#f72585", "#3a0ca3", "#7209b7"],
    ["#95d5b2", "#40916c", "#081c15", "#1b4332"],
    ["#ffcad4", "#f4acb7", "#9d8189", "#d8e2dc"],
  ];
  const SKILL_ART = [
    ["#ff6b6b", "#ee5a24", "#c0392b", "#f8a5c2"],
    ["#74b9ff", "#0984e3", "#2d3436", "#6c5ce7"],
    ["#55efc4", "#00b894", "#006266", "#81ecec"],
    ["#ffeaa7", "#fdcb6e", "#e17055", "#fab1a0"],
    ["#a29bfe", "#6c5ce7", "#2d1b69", "#fd79a8"],
    ["#ff7675", "#d63031", "#2d3436", "#e17055"],
    ["#81ecec", "#00cec9", "#0c2461", "#74b9ff"],
    ["#fd79a8", "#e84393", "#6c5ce7", "#ffeaa7"],
    ["#b8e994", "#78e08f", "#079992", "#38ada9"],
    ["#f6e58d", "#f9ca24", "#30336b", "#686de0"],
  ];

  const paletteFor = (item, i, set) =>
    (Array.isArray(item.art) && item.art.length >= 4) ? item.art : set[i % set.length];

  function setPalette(node, pal) {
    pal.forEach((c, k) => node.style.setProperty("--c" + (k + 1), c));
    return node;
  }

  // opts: { cls, type, label, top }
  function art(pal, opts = {}) {
    const n = setPalette(el("span", "art " + (opts.cls || "") + (opts.top ? " top" : "")), pal);
    n.setAttribute("aria-hidden", "true");
    if (opts.image) {
      n.innerHTML = '<img src="' + esc(opts.image) + '" alt="" loading="lazy">';
      return n;
    }
    let html = "";
    if (opts.label) html += '<span class="art-label">' + esc(opts.label) + "</span>";
    if (opts.type) html += '<span class="art-type">' + esc(opts.type) + "</span>";
    n.innerHTML = html;
    return n;
  }

  const projectArt = (p, i, cls) =>
    art(paletteFor(p, i, FALLBACK_ART), {
      cls, image: p.image, type: p.title, label: C.profile.displayName, top: i % 2 === 1,
    });

  function metricOf(p) {
    const s = p.stats || {};
    if (s.visits) return { value: s.visits, label: "visits" };
    if (s.concurrents) return { value: s.concurrents, label: "peak CCU" };
    return null;
  }

  /* ==========================================================
     RENDER: chrome (sidebar, tab bar, player, header)
     ========================================================== */
  const NAV = {
    top: ["home", "Home"],
    work: ["disc", "Projects"],
    videos: ["tv", "Videos"],
    stack: ["cpu", "Stack"],
    about: ["user", "About"],
    contact: ["send", "Contact"],
  };

  function renderChrome() {
    const name = C.profile.displayName;
    const mono = C.profile.monogram || name.slice(0, 2).toUpperCase();

    document.title = plain(C.seo.title);
    const desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", plain(C.seo.description));

    $("#side-avatar").textContent = mono;
    $("#side-name").textContent = name;
    $("#side-avail").textContent = C.profile.availability;
    $("#topbar-title").textContent = name;
    $("#foot-name").textContent = name;
    $("#foot-tag").textContent = C.profile.tagline;
    $("#foot-year").textContent = new Date().getFullYear();

    $$("[data-spy]").forEach((a) => {
      const [ic, label] = NAV[a.dataset.spy];
      a.innerHTML = icon(ic) + "<span>" + label + "</span>";
    });

    // Player
    $("#player-art").textContent = mono;
    $("#player-title").textContent = C.profile.availability;
    $("#player-sub").textContent = name + " · Discord DM is fastest";
    $("#player-mail").innerHTML = icon("mail");
    $("#player-mail").addEventListener("click", () => setTimeout(revealEmail, 450));
    const d = extLink($("#player-discord"), req(C.contact, "discordUrl", "contact"));
    d.innerHTML = icon("message-circle");
  }

  function renderHero() {
    const feat = C.projects.find((p) => p.featured) || C.projects[0];
    const pal = Array.isArray(C.profile.heroArt) ? C.profile.heroArt
      : paletteFor(feat, C.projects.indexOf(feat), FALLBACK_ART);
    setPalette($("#artist-art"), pal);
    const root = document.documentElement;
    root.style.setProperty("--amb-1", pal[0]);
    root.style.setProperty("--amb-2", pal[3]);
    root.style.setProperty("--amb-3", pal[1]);

    $("#hero-kicker").textContent = C.profile.tagline;
    $("#hero-name").textContent = C.profile.displayName;
    $("#hero-sub").textContent = plain(C.profile.heroHeadline) + " " + plain(C.profile.heroSub);
    $("#play-reel").innerHTML = PLAY_SVG;
    $("#play-reel").addEventListener("click", playReel);

    const stats = $("#stats");
    (C.profile.heroStats || []).forEach((s) => {
      stats.append(el("div", "stat sq",
        '<div class="stat-num">' + esc(s.value) + '</div><div class="stat-label">' + esc(s.label) + "</div>"));
    });
  }

  /* ==========================================================
     RENDER: work — featured "latest release" + credits track list
     ========================================================== */
  function renderWork() {
    const fi = Math.max(0, C.projects.findIndex((p) => p.featured));
    const f = C.projects[fi];

    const feat = el("button", "feature reveal");
    feat.type = "button";
    feat.setAttribute("aria-label", "Open " + f.title);
    const m = metricOf(f);
    feat.append(projectArt(f, fi, "sq"));
    feat.append(el("div", "feature-text",
      '<p class="feature-meta">Featured' + (m ? " · " + esc(m.value) + " " + m.label : "") + "</p>" +
      '<p class="feature-title">' + esc(req(f, "title", "featured project")) + "</p>" +
      '<p class="feature-role">' + esc(req(f, "role", f.title)) + "</p>"));
    feat.addEventListener("click", () => openSheet(fi));
    $("#featured-slot").append(feat);

    $("#credits-meta").textContent = C.projects.length + " titles";
    const list = $("#track-list");
    list.classList.add("reveal");
    const side = $("#side-projects");

    C.projects.forEach((p, i) => {
      req(p, "title", "project");
      req(p, "url", p.title);
      const met = metricOf(p);

      const li = el("li");
      const row = el("button", "track");
      row.type = "button";
      row.setAttribute("aria-label", p.title + ", " + p.role + " — details");
      row.innerHTML =
        '<span class="track-num"><span>' + (i + 1) + "</span>" + PLAY_SVG.replace("<svg", '<svg class="ic"') + "</span>";
      row.append(projectArt(p, i, "squircle"));
      row.append(el("span", "track-text",
        "<b>" + esc(p.title) + "</b><small>" + esc(req(p, "role", p.title)) + "</small>"));
      row.append(el("span", "track-metric", met ? esc(met.value) + " " + met.label : ""));
      row.append(el("span", "track-more", icon("ellipsis")));
      row.addEventListener("click", () => openSheet(i));
      li.append(row);
      list.append(li);

      const s = el("button", "side-proj");
      s.type = "button";
      s.append(projectArt(p, i, "squircle"));
      s.append(el("span", null, esc(p.title)));
      s.addEventListener("click", () => openSheet(i));
      side.append(s);
    });

    const extra = C.additionalContributions;
    if (extra && extra.count) {
      const note = el("div", "more-note reveal");
      note.append(el("span", "more-count squircle", "+" + esc(extra.count).replace(/\+$/, "")));
      note.append(el("span", null, esc(extra.note || "Additional shipped titles.")));
      const a = el("a", null, "Ask");
      a.href = "#contact";
      note.append(a);
      $("#more-note-slot").append(note);
    }
  }

  /* ==========================================================
     PROJECT SHEET (native <dialog>)
     ========================================================== */
  function openSheet(i) {
    const p = C.projects[i];
    const dlg = $("#sheet");
    const body = $("#sheet-body");
    body.className = "sheet-body glass";
    body.innerHTML = "";

    const close = el("button", "sheet-close", icon("x"));
    close.type = "button";
    close.setAttribute("aria-label", "Close");
    close.addEventListener("click", () => dlg.close());
    body.append(close);

    const head = el("div", "sheet-head");
    head.append(projectArt(p, i, "sq"));
    const info = el("div", "sheet-info");
    info.append(el("p", "sheet-kicker", (p.featured ? "Featured · " : "") + "Project " + pad2(i + 1)));
    const h = el("h3", null, esc(p.title));
    h.id = "sheet-title";
    info.append(h);
    info.append(el("p", "sheet-role", esc(p.role)));
    const actions = el("div", "sheet-actions");
    actions.append(extLink(el("a", "pill pill-red", "View on Roblox " + icon("arrow-up-right")), p.url));
    if (p.caseStudyAnchor) {
      const b = el("button", "pill pill-fill", PLAY_SVG.replace("<svg", '<svg class="ic"') + " Footage");
      b.type = "button";
      b.addEventListener("click", () => {
        dlg.close();
        document.getElementById("videos").scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
      });
      actions.append(b);
    }
    info.append(actions);
    head.append(info);
    body.append(head);

    const s = p.stats || {};
    if (s.visits || s.concurrents) {
      const st = el("div", "sheet-stats");
      if (s.visits) st.append(el("div", "sq", "<b>" + esc(s.visits) + "</b><span>Visits</span>"));
      if (s.concurrents) st.append(el("div", "sq", "<b>" + esc(s.concurrents) + "</b><span>Peak concurrent players</span>"));
      body.append(st);
    }
    body.append(el("p", "sheet-desc", esc(req(p, "contribution", p.title))));
    if (p.tags && p.tags.length) {
      body.append(el("div", "sheet-tags", p.tags.map((t) => "<span>" + esc(t) + "</span>").join("")));
    }

    document.documentElement.style.overflow = "hidden";
    dlg.showModal();
    close.focus();
  }

  function initSheet() {
    const dlg = $("#sheet");
    dlg.addEventListener("close", () => { document.documentElement.style.overflow = ""; });
    // Click on the dimmed backdrop (outside the body) closes the sheet.
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  }

  /* ==========================================================
     VIDEOS (lazy YouTube embeds + chapter switcher)
     ========================================================== */
  function iframeHTML(id, title) {
    return (
      '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
      '?autoplay=1&rel=0" title="' + esc(title) +
      '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>'
    );
  }

  // Media frame with thumbnail-first loading. Returns { frame, setPart }.
  function mediaFrame(item, onPlay) {
    const parts = req(item, "parts", item.title);
    const frame = el("div", "media-frame");
    let current = 0;
    let playing = false;

    function render() {
      const v = parts[current];
      frame.innerHTML = "";
      if (playing) {
        frame.innerHTML = iframeHTML(v.id, item.title + " — " + (v.label || ""));
        if (onPlay) onPlay();
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

      btn.append(img, el("span", "play-badge", PLAY_SVG));
      if (parts.length > 1) {
        btn.append(el("span", "part-flag",
          esc(v.label || "Part " + (current + 1)) + " · " + (current + 1) + "/" + parts.length));
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
      const b = el("button", "seg-btn" + (i === 0 ? " active" : ""), esc(v.label || "Part " + (i + 1)));
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

  function renderVideos() {
    const featured = C.caseStudies.find((s) => s.featured);
    if (featured) {
      const card = el("article", "cs-featured sq reveal");
      const panel = el("div", "cs-feat-panel glass");
      const media = mediaFrame(featured, () => { panel.hidden = true; });
      card.id = "reel";
      card.append(media.frame);
      panel.innerHTML =
        '<p class="eyebrow">Featured case study' + (featured.role ? " · " + esc(featured.role) : "") + "</p>" +
        "<h3>" + esc(req(featured, "title", "featured case study")) + "</h3>" +
        "<p>" + esc(req(featured, "summary", featured.title)) + "</p>" +
        ((featured.highlights || []).length
          ? "<ul>" + featured.highlights.map((h) => "<li>" + esc(h) + "</li>").join("") + "</ul>"
          : "");
      card.append(panel);
      $("#cs-featured-slot").append(card);
    }

    // Group the rest by category, preserving config order.
    const groups = new Map();
    C.caseStudies.filter((s) => !s.featured).forEach((s) => {
      const cat = req(s, "category", s.title);
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat).push(s);
    });

    const root = $("#cs-groups");
    groups.forEach((items, cat) => {
      const group = el("div", "cs-group");
      group.append(el("h3", "cs-group-title", esc(cat)));
      const shelf = el("div", "shelf");
      items.forEach((item) => {
        const card = el("article", "vcard reveal");
        const media = mediaFrame(item);
        media.frame.classList.add("sq");
        card.append(media.frame);

        const meta = el("div", "vcard-meta");
        const row = el("div", "vcard-row");
        row.append(el("h4", "vcard-title", esc(req(item, "title", "case study"))));
        if (item.parts.length > 1) row.append(segControl(item.parts, media.setPart));
        meta.append(row);
        if (item.role) meta.append(el("p", "vcard-role", esc(item.role)));
        meta.append(el("p", "vcard-sub", esc(req(item, "summary", item.title))));
        card.append(meta);
        shelf.append(card);
      });
      group.append(shelf);
      root.append(group);
    });
  }

  function playReel() {
    const reel = $("#reel");
    if (!reel) return;
    reel.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" });
    const thumb = $(".media-thumb", reel);
    if (thumb) setTimeout(() => thumb.click(), REDUCED ? 0 : 500);
  }

  /* ==========================================================
     STACK, ABOUT, CONTACT
     ========================================================== */
  function renderStack() {
    const row = $("#fw-row");
    C.frameworks.forEach((f, i) => {
      const a = extLink(el("a", "fw sq reveal"), req(f, "url", f.name));
      a.append(art(paletteFor(f, i + 2, FALLBACK_ART), { cls: "squircle", type: f.name }));
      a.append(el("div", "fw-text",
        "<small>" + esc(f.tagline || "") + "</small>" +
        "<b>" + esc(req(f, "name", "framework")) + "</b>" +
        "<p>" + esc(f.description || "") + "</p>"));
      row.append(a);
    });

    const tiles = $("#skill-tiles");
    C.skills.forEach((s, i) => {
      const t = art(SKILL_ART[i % SKILL_ART.length], { cls: "tile sq reveal", type: s });
      t.removeAttribute("aria-hidden");
      t.setAttribute("role", "listitem");
      tiles.append(t);
    });
    tiles.setAttribute("role", "list");
    tiles.setAttribute("aria-label", "Skills");
  }

  const ROW_COLORS = ["#0a84ff", "#ff9f0a", "#30d158", "#bf5af2", "#ff375f", "#64d2ff"];

  function rowIcon(name, color) {
    return '<span class="row-icon squircle" style="background:' + color + '">' + icon(name) + "</span>";
  }

  function renderAbout() {
    $("#about-title").textContent = "About " + C.profile.displayName;
    const copy = $("#about-copy");
    copy.classList.add("sq", "reveal");
    C.profile.aboutParagraphs.forEach((p, i) =>
      copy.append(el("p", i === 0 ? "lead" : null, esc(fill(p)))));

    const facts = $("#about-facts");
    facts.classList.add("reveal");
    C.profile.facts.forEach((f, i) => {
      facts.append(el("li", "row",
        rowIcon(req(f, "icon", "fact entry"), ROW_COLORS[i % ROW_COLORS.length]) +
        '<span class="row-text"><b>' + esc(fill(req(f, "text", "fact entry"))) + "</b></span>"));
    });
  }

  function renderContact() {
    $("#contact-copy").textContent =
      "Tell me what you're building, the systems you need and your timeline — " +
      "I'll come back with scope and availability.";
    $(".contact-lead").classList.add("reveal");

    const list = $("#contact-list");
    list.classList.add("reveal");

    const discord = extLink(el("a", "row"), req(C.contact, "discordUrl", "contact"));
    discord.innerHTML =
      rowIcon("message-circle", "#5865f2") +
      '<span class="row-text"><b>Discord</b><small>Fastest reply — send a DM</small></span>' +
      '<span class="row-end">Message ' + icon("arrow-up-right") + "</span>";
    const discordLi = el("li");
    discordLi.append(discord);
    list.append(discordLi);

    // Email — assembled only on click; never present in the DOM before that.
    const mailLi = el("li");
    const mailBtn = el("button", "row");
    mailBtn.type = "button";
    mailBtn.id = "email-row";
    mailBtn.innerHTML =
      rowIcon("mail", "#0a84ff") +
      '<span class="row-text"><b>Email</b><small>Hidden from scrapers — tap to reveal</small></span>' +
      '<span class="row-end">Reveal ' + icon("chevron-right") + "</span>";
    mailBtn.addEventListener("click", revealEmail);
    mailLi.append(mailBtn);
    list.append(mailLi);

    list.append(el("li", "row",
      rowIcon("credit-card", "#30d158") +
      '<span class="row-text"><b>Payment</b><small>' + esc(C.contact.paymentNote) + "</small></span>"));
  }

  function revealEmail() {
    const btn = $("#email-row");
    if (!btn) return;
    const addr = req(C.contact, "emailUser", "contact") + "@" + req(C.contact, "emailDomain", "contact");
    const row = el("div", "row");
    row.innerHTML =
      rowIcon("mail", "#0a84ff") +
      '<span class="row-text"><b>Email</b><small><a href="mailto:' + esc(addr) + '">' + esc(addr) + "</a></small></span>";
    const copy = el("button", "row-end copy", "Copy");
    copy.type = "button";
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(addr);
        copy.textContent = "Copied";
      } catch {
        copy.textContent = "Select & copy";
      }
      setTimeout(() => { copy.textContent = "Copy"; }, 1800);
    });
    row.append(copy);
    btn.replaceWith(row);
    copy.focus({ preventScroll: true });
  }

  /* ==========================================================
     BEHAVIOUR: theme, scroll state, spy, reveal, glass light
     ========================================================== */
  function initTheme() {
    const root = document.documentElement;
    const side = $("#theme-toggle");
    const mob = $("#theme-toggle-m");
    const meta = $('meta[name="theme-color"]');

    function apply(theme, save) {
      root.setAttribute("data-theme", theme);
      const dark = theme === "dark";
      side.innerHTML = icon(dark ? "moon" : "sun") + "<span>Dark appearance</span>" + '<span class="theme-switch" aria-hidden="true"></span>';
      side.setAttribute("aria-pressed", String(dark));
      mob.innerHTML = icon(dark ? "sun" : "moon");
      mob.setAttribute("aria-label", "Switch to " + (dark ? "light" : "dark") + " appearance");
      if (meta) meta.setAttribute("content", dark ? "#000000" : "#ffffff");
      if (save) { try { localStorage.setItem("theme", theme); } catch (e) { /* private mode */ } }
    }

    const toggle = () => apply(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
    apply(root.getAttribute("data-theme") === "light" ? "light" : "dark", false);
    side.addEventListener("click", toggle);
    mob.addEventListener("click", toggle);
  }

  function initScroll() {
    const bar = $("#player-bar");
    const topbar = $("#topbar");
    const artist = $(".artist");
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
      topbar.classList.toggle("show", artist.getBoundingClientRect().bottom < 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    // Scroll-spy for the sidebar and the tab bar.
    const targets = [["top", artist]].concat(
      ["work", "videos", "stack", "about", "contact"].map((id) => [id, document.getElementById(id)]));
    const byEl = new Map(targets.map(([id, node]) => [node, id]));
    const setActive = (id) =>
      $$("[data-spy]").forEach((a) => a.classList.toggle("active", a.dataset.spy === id));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(byEl.get(en.target)); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    targets.forEach(([, node]) => spy.observe(node));
    setActive("top");
  }

  function initReveal() {
    const els = $$(".reveal");
    if (REDUCED || !("IntersectionObserver" in window)) {
      els.forEach((n) => n.classList.add("in"));
      return;
    }
    const perParent = new Map();
    els.forEach((n) => {
      const i = perParent.get(n.parentElement) || 0;
      perParent.set(n.parentElement, i + 1);
      n.style.transitionDelay = Math.min(i * 50, 300) + "ms";
    });
    const ob = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); ob.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    els.forEach((n) => ob.observe(n));
  }

  // The specular highlight on glass follows the pointer.
  function initGlassLight() {
    if (!HOVER || REDUCED) return;
    document.addEventListener("pointermove", (e) => {
      const g = e.target.closest && e.target.closest(".glass");
      if (!g) return;
      const r = g.getBoundingClientRect();
      g.style.setProperty("--gx", e.clientX - r.left + "px");
      g.style.setProperty("--gy", e.clientY - r.top + "px");
    }, { passive: true });
  }

  /* ---------- boot ---------- */
  try {
    renderChrome();
    renderHero();
    initTheme();
    renderWork();
    initSheet();
    renderVideos();
    renderStack();
    renderAbout();
    renderContact();
    initScroll();
    initReveal();
    initGlassLight();
  } catch (err) {
    console.error(err);
  }
})();
