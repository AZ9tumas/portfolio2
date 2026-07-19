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

  /* ---------- icon system (Lucide, stroke 1.75, 24px grid) ----------
     One consistent family for every glyph on the site. Referenced by
     name from config (facts) and from the renderer below.            */
  const ICON_PATHS = {
    "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
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

  /* ==========================================================
     RENDER: meta, nav, hero
     ========================================================== */
  function renderMeta() {
    document.title = fill(C.seo.title);
    const desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", fill(C.seo.description));

    $("#brand-name").textContent = C.profile.displayName;
    $("#brand-mark").textContent =
      C.profile.monogram || C.profile.displayName.slice(0, 2).toUpperCase();

    $("#foot-name").textContent = C.profile.displayName;
    $("#foot-name-2").textContent = C.profile.displayName;
    $("#foot-tag").textContent = C.profile.tagline;
    $("#foot-year").textContent = new Date().getFullYear();
  }

  function renderHero() {
    $("#avail-text").textContent = C.profile.availability;
    $("#hero-title").textContent = fill(C.profile.heroHeadline);
    $("#hero-sub").textContent = fill(C.profile.heroSub);

    const band = $("#stats-band");
    (C.profile.heroStats || []).forEach((s) => {
      const box = el("div", "stat");
      box.append(el("div", "stat-num", esc(s.value)));
      box.append(el("div", "stat-label", esc(s.label)));
      band.append(box);
    });
  }

  /* ==========================================================
     RENDER: shipped work
     ========================================================== */
  function statRow(stats) {
    const wrap = el("div", "proj-stats");
    if (stats.visits) {
      wrap.append(el("div", "proj-stat",
        "<b>" + esc(stats.visits) + "</b><span>visits</span>"));
    }
    if (stats.concurrents) {
      wrap.append(el("div", "proj-stat",
        "<b>" + esc(stats.concurrents) + "</b><span>peak CCU</span>"));
    }
    return wrap;
  }

  function renderFeaturedProject() {
    const f = C.projects.find((p) => p.featured);
    if (!f) return;

    const card = el("article", "featured-card reveal");

    const main = el("div", "feat-main");
    const head = el("div", "feat-head");
    head.append(el("span", "role-badge", esc(req(f, "role", f.title))));
    main.append(head);
    main.append(el("h3", null, esc(req(f, "title", "featured project"))));
    main.append(el("p", "proj-desc", esc(req(f, "contribution", f.title))));

    if (f.tags && f.tags.length) {
      const tags = el("div", "tag-row");
      f.tags.forEach((t) => tags.append(el("span", "tag", esc(t))));
      main.append(tags);
    }

    const cta = el("div", "feat-cta-row");
    cta.append(extLink(
      el("a", "btn btn-primary", "View on Roblox " + icon("arrow-up-right")),
      req(f, "url", f.title)));
    main.append(cta);

    const aside = el("div", "feat-aside");
    if (f.stats && f.stats.visits) {
      aside.append(el("div", "feat-stat-num", esc(f.stats.visits)));
      aside.append(el("div", "feat-stat-label", "Visits and climbing"));
    }
    if (f.stats && f.stats.concurrents) {
      aside.append(el("div", "feat-stat-label", esc(f.stats.concurrents) + " peak CCU"));
    }

    card.append(main, aside);
    $("#featured-slot").append(card);
  }

  function renderProjects() {
    const grid = $("#work-grid");

    C.projects.filter((p) => !p.featured).forEach((p) => {
      const card = el("article", "proj-card reveal");

      const head = el("div", "proj-head");
      head.append(el("h3", null, esc(req(p, "title", "project"))));
      head.append(el("span", "role-badge", esc(req(p, "role", p.title))));
      card.append(head);

      card.append(el("p", "proj-desc", esc(req(p, "contribution", p.title))));

      if (p.stats && (p.stats.visits || p.stats.concurrents)) {
        card.append(statRow(p.stats));
      }
      if (p.tags && p.tags.length) {
        const tags = el("div", "tag-row");
        p.tags.forEach((t) => tags.append(el("span", "tag", esc(t))));
        card.append(tags);
      }

      const foot = el("div", "proj-foot");
      foot.append(extLink(
        el("a", "text-link", "View on Roblox " + icon("arrow-up-right")),
        req(p, "url", p.title)));
      if (p.caseStudyAnchor) {
        const a = el("a", "text-link quiet", "Development footage " + icon("play"));
        a.href = "#case-studies";
        foot.append(a);
      }
      card.append(foot);
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
    const card = el("article", "cs-card reveal");
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
    const grid = $("#fw-grid");
    C.frameworks.forEach((f) => {
      const a = extLink(el("a", "fw-card reveal"), req(f, "url", f.name));
      a.append(el("div", "fw-top",
        '<span class="fw-name">' + esc(req(f, "name", "framework")) + "</span>" +
        '<span class="cat-badge">' + esc(f.tagline || "") + "</span>"));
      a.append(el("p", "fw-desc", esc(f.description || "")));
      a.append(el("span", "fw-link", "Documentation " + icon("arrow-up-right")));
      grid.append(a);
    });

    const skills = $("#skills");
    C.skills.forEach((s) => skills.append(el("li", "skill-item", esc(s))));
  }

  function renderAbout() {
    const copy = $("#about-copy");
    C.profile.aboutParagraphs.forEach((p) => copy.append(el("p", null, esc(fill(p)))));

    const facts = $("#about-facts");
    C.profile.facts.forEach((f) => {
      facts.append(el("li", "fact",
        icon(req(f, "icon", "fact entry")) + "<span>" + esc(fill(req(f, "text", "fact entry"))) + "</span>"));
    });
  }

  function renderContact() {
    const copy = $("#contact-copy");
    copy.append(el("p", null,
      "The fastest way to reach me is a Discord DM — I reply to serious " +
      "commission and collaboration enquiries first. Email works too if " +
      "you prefer a paper trail."));
    copy.append(el("p", null,
      "Tell me what you're building, the systems you need, and your " +
      "timeline — I'll come back with scope and availability."));
    copy.append(el("div", "pay-line",
      icon("credit-card") + "<span>" + esc(C.contact.paymentNote) + "</span>"));

    const card = $("#contact-card");

    const d = extLink(
      el("a", "btn btn-primary", icon("message-circle") + " Message on Discord"),
      req(C.contact, "discordUrl", "contact"));
    card.append(d);

    // Email — assembled only on click; never present in the DOM before that.
    const zone = el("div", "email-zone");
    const btn = el("button", "btn btn-ghost", icon("eye") + " Reveal email");
    btn.type = "button";
    btn.addEventListener("click", () => {
      const addr = req(C.contact, "emailUser", "contact") + "@" +
                   req(C.contact, "emailDomain", "contact");
      zone.innerHTML = "";
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
    });
    zone.append(btn);
    card.append(zone);

    card.append(el("p", "contact-hint",
      "The address is kept out of the page source to avoid scraping — it only appears when you reveal it."));
  }

  /* ==========================================================
     FX: reveal-on-scroll, nav
     ========================================================== */
  function initReveal() {
    const els = $$(".reveal");
    const perParent = new Map();
    els.forEach((n) => {
      const i = perParent.get(n.parentElement) || 0;
      perParent.set(n.parentElement, i + 1);
      n.style.transitionDelay = Math.min(i * 60, 300) + "ms";
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
      { threshold: 0.1 }
    );
    els.forEach((n) => ob.observe(n));
  }

  function initNav() {
    const nav = $("#nav");
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const burger = $("#burger");
    const links = $("#nav-links");
    const close = () => {
      links.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    };
    burger.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });

    // scroll-spy
    const map = new Map();
    $$('.nav-links a[href^="#"]').forEach((a) => {
      if (a.classList.contains("nav-cta")) return;
      map.set(a.getAttribute("href").slice(1), a);
    });
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

  /* ---------- boot ---------- */
  try {
    renderMeta();
    renderHero();
    renderFeaturedProject();
    renderProjects();
    renderCaseStudies();
    renderStack();
    renderAbout();
    renderContact();
    initReveal();
    initNav();
  } catch (err) {
    console.error(err);
  }
})();
