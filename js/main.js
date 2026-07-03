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

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- derived numbers ---------- */
  const YEARS = Math.max(1, new Date().getFullYear() - C.developer.startYear);
  const TOTAL_VISITS = C.games.reduce((a, g) => a + (g.visits || 0), 0);
  const TITLES = C.games.length + (C.developer.additionalTitles || 0);
  const PEAK_CCU = Math.max(0, ...C.games.map((g) => g.peakCcu || 0));

  function fmt(n) {
    if (!n) return "0";
    if (n >= 1e6) {
      const v = n / 1e6;
      return (v >= 100 ? Math.round(v) : +v.toFixed(1)) + "M+";
    }
    if (n >= 1e3) return Math.round(n / 1e3) + "K+";
    return String(n);
  }

  const fill = (s) =>
    String(s)
      .replace(/\{name\}/g, C.developer.name)
      .replace(/\{years\}/g, YEARS)
      .replace(/\{visits\}/g, fmt(TOTAL_VISITS))
      .replace(/\{titles\}/g, TITLES + "+");

  /* ==========================================================
     RENDER: meta, nav, hero
     ========================================================== */
  function renderMeta() {
    document.title = fill(C.seo.title);
    const desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", fill(C.seo.description));

    $("#brand-name").textContent = C.developer.name;
    $("#brand-mark").textContent =
      C.developer.monogram || C.developer.name.slice(0, 2).toUpperCase();

    $("#foot-name").textContent = C.developer.name;
    $("#foot-name-2").textContent = C.developer.name;
    $("#foot-tag").textContent = C.developer.role;
    $("#foot-year").textContent = new Date().getFullYear();
  }

  function renderHero() {
    $("#avail-text").textContent = C.developer.availability;

    $("#hero-title").innerHTML = esc(fill(C.developer.heroTitle))
      .replace(/\*\*(.+?)\*\*/g, '<span class="grad-text">$1</span>');
    $("#hero-sub").textContent = fill(C.developer.heroSub);

    const stats = [
      { num: fmt(TOTAL_VISITS), label: "Combined Visits" },
      { num: YEARS + "+", label: "Years Shipping" },
      { num: TITLES + "+", label: "Titles Worked On" },
      { num: fmt(PEAK_CCU), label: "Peak Concurrent" },
    ];
    const row = $("#stats-row");
    stats.forEach((s) => {
      const box = el("div", "stat reveal");
      const num = el("div", "stat-num", "0");
      num.dataset.final = s.num;
      box.append(num, el("div", "stat-label", esc(s.label)));
      row.append(box);
    });
  }

  /* ==========================================================
     RENDER: games
     ========================================================== */
  function coverEl(game, extraCls) {
    const c = el("div", "cover" + (extraCls ? " " + extraCls : ""));
    c.style.setProperty("--c1", (game.colors && game.colors[0]) || "#ffb224");
    c.style.setProperty("--c2", (game.colors && game.colors[1]) || "#ff6b3d");
    c.append(el("span", "cover-icon", esc(game.icon || "🎮")));
    if (game.visits) {
      c.append(el("span", "cover-visits", fmt(game.visits) + " <small>visits</small>"));
    }
    return c;
  }

  function renderFeatured() {
    const f = C.games.find((g) => g.featured);
    if (!f) return;

    const wrap = el("article", "featured reveal");
    const cov = coverEl(f, "feat-cover");
    cov.append(el("span", "feat-flag", "★ Flagship"));

    const body = el("div", "feat-body");
    body.append(el("span", "eyebrow", "Flagship Title"));
    body.append(el("h3", null, esc(f.title)));
    body.append(el("p", "g-desc", esc(f.description)));

    if (f.tags && f.tags.length) {
      const tags = el("div", "tag-row");
      f.tags.forEach((t) => tags.append(el("span", "tag", esc(t))));
      body.append(tags);
    }

    const mini = el("div", "feat-stats");
    const miniStat = (v, label) =>
      el("div", "mini-stat", "<b>" + v + "</b><span>" + esc(label) + "</span>");
    if (f.visits) mini.append(miniStat(fmt(f.visits), "Visits"));
    if (f.peakCcu) mini.append(miniStat(fmt(f.peakCcu), "Peak CCU"));
    if (f.role) mini.append(miniStat(esc(f.role), "Role"));
    body.append(mini);

    const cta = el("div", "feat-cta-row");
    cta.append(extLink(el("a", "btn btn-primary", "Play on Roblox ↗"), f.url));
    body.append(cta);

    wrap.append(cov, body);
    $("#featured-slot").append(wrap);
  }

  function renderGames() {
    const grid = $("#games-grid");

    C.games.filter((g) => !g.featured).forEach((g) => {
      const card = el("article", "game-card reveal");
      card.append(coverEl(g));

      const body = el("div", "g-body");
      const top = el("div", "g-title-row");
      top.append(el("h3", null, esc(g.title)));
      if (g.role) top.append(el("span", "g-role", esc(g.role)));
      body.append(top);
      body.append(el("p", "g-desc", esc(g.description)));

      const badges = el("div", "badge-row");
      if (g.visits) badges.append(el("span", "badge badge-accent", fmt(g.visits) + " visits"));
      if (g.peakCcu) badges.append(el("span", "badge badge-accent", fmt(g.peakCcu) + " peak CCU"));
      (g.tags || []).forEach((t) => badges.append(el("span", "badge", esc(t))));
      body.append(badges);
      card.append(body);

      const foot = el("div", "g-foot");
      foot.append(extLink(el("a", "g-link", 'Play on Roblox <span aria-hidden="true">↗</span>'), g.url));
      if (g.showcaseAnchor) {
        const w = el("a", "g-link alt", "▶ Watch showcase");
        w.href = "#showcase";
        foot.append(w);
      }
      card.append(foot);
      grid.append(card);
    });

    if (C.developer.additionalTitles) {
      const card = el("article", "game-card more-card reveal");
      card.append(el("div", "more-num", "+" + C.developer.additionalTitles));
      card.append(el("p", "g-desc", esc(C.collabNote || "More client titles shipped.")));
      const foot = el("div", "g-foot");
      const a = el("a", "g-link", "Ask about client work →");
      a.href = "#contact";
      foot.append(a);
      card.append(foot);
      grid.append(card);
    }
  }

  /* ==========================================================
     RENDER: video showcase (lite YouTube embeds + series toggle)
     ========================================================== */
  const PLAY_SVG =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72L19 12 8 5.14z"/></svg>';

  function iframeHTML(id, title) {
    return (
      '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
      '?autoplay=1&rel=0" title="' + esc(title) +
      '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'
    );
  }

  function videoCard(item) {
    const card = el("article", "vid-card reveal");
    card.dataset.cat = item.category;

    const frame = el("div", "vid-frame");
    let current = 0;
    let playing = false;

    function renderFrame() {
      const v = item.videos[current];
      frame.innerHTML = "";
      if (playing) {
        frame.innerHTML = iframeHTML(v.id, item.title + " — " + (v.label || ""));
        return;
      }
      const btn = el("button", "vid-thumb");
      btn.type = "button";
      btn.setAttribute("aria-label", "Play video: " + item.title);

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
      if (item.videos.length > 1) {
        btn.append(el("span", "frame-flag", item.videos.length + "-part series"));
      }
      btn.addEventListener("click", () => { playing = true; renderFrame(); });
      frame.append(btn);
    }

    const meta = el("div", "vid-meta");
    const head = el("div", "vid-head");
    head.append(el("span", "vid-cat", esc(item.category)));

    if (item.videos.length > 1) {
      const seg = el("div", "seg");
      seg.setAttribute("role", "group");
      seg.setAttribute("aria-label", "Switch between videos");
      item.videos.forEach((v, i) => {
        const b = el("button", "seg-btn" + (i === 0 ? " active" : ""),
          esc(v.label || "Part " + (i + 1)));
        b.type = "button";
        b.addEventListener("click", () => {
          if (current === i) return;
          current = i;
          $$(".seg-btn", seg).forEach((x, xi) => x.classList.toggle("active", xi === i));
          renderFrame();
        });
        seg.append(b);
      });
      head.append(seg);
    }

    meta.append(head);
    meta.append(el("h3", "vid-title", esc(item.title)));
    meta.append(el("p", "vid-desc", esc(item.description)));
    if (item.note) meta.append(el("p", "series-note", "↻ " + esc(item.note)));

    renderFrame();
    card.append(frame, meta);
    return card;
  }

  function renderShowcase() {
    const cats = [...new Set(C.showcase.map((s) => s.category))];
    const filters = $("#filters");

    const allBtn = el("button", "chip active", "All");
    allBtn.type = "button";
    allBtn.dataset.cat = "*";
    filters.append(allBtn);
    cats.forEach((c) => {
      const b = el("button", "chip", esc(c));
      b.type = "button";
      b.dataset.cat = c;
      filters.append(b);
    });

    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      $$(".chip", filters).forEach((x) => x.classList.toggle("active", x === btn));
      $$("#showcase-grid .vid-card").forEach((card) => {
        card.classList.toggle(
          "hidden",
          btn.dataset.cat !== "*" && card.dataset.cat !== btn.dataset.cat
        );
      });
    });

    const grid = $("#showcase-grid");
    C.showcase.forEach((s) => grid.append(videoCard(s)));
  }

  /* ==========================================================
     RENDER: tech, about, contact
     ========================================================== */
  function renderTech() {
    const grid = $("#fw-grid");
    C.frameworks.forEach((f) => {
      const a = extLink(el("a", "fw-card reveal"), f.url);
      a.append(el("div", "fw-top",
        '<span class="fw-name">' + esc(f.name) + '</span>' +
        '<span class="fw-tag">' + esc(f.tagline || "") + "</span>"));
      a.append(el("p", "fw-desc", esc(f.description)));
      a.append(el("span", "fw-link", "View docs ↗"));
      grid.append(a);
    });

    const skills = $("#skills");
    C.skills.forEach((s) => skills.append(el("span", "skill-chip", esc(s))));
  }

  function renderAbout() {
    const copy = $("#about-copy");
    C.developer.aboutParagraphs.forEach((p) => copy.append(el("p", null, esc(fill(p)))));
    const facts = $("#about-facts");
    C.developer.facts.forEach((f) => facts.append(el("li", "fact", esc(fill(f)))));
  }

  function renderContact() {
    const grid = $("#contact-grid");

    // Discord
    const d = el("div", "c-card reveal");
    d.append(el("div", "c-ico", "💬"));
    d.append(el("h3", null, "Discord"));
    d.append(el("p", null, "Fastest way to reach me — DMs are open."));
    d.append(extLink(el("a", "btn btn-primary", "Message on Discord ↗"), C.contact.discordUrl));
    grid.append(d);

    // Email — assembled only on click so bots can't scrape it.
    const em = el("div", "c-card reveal");
    em.append(el("div", "c-ico", "✉️"));
    em.append(el("h3", null, "Email"));
    em.append(el("p", null, "Kept hidden from bots — click to reveal."));
    const zone = el("div", "email-zone");
    const btn = el("button", "btn btn-ghost", "Reveal email");
    btn.type = "button";
    btn.addEventListener("click", () => {
      const addr = C.contact.emailUser + "@" + C.contact.emailDomain;
      zone.innerHTML = "";
      const link = el("a", "email-link", esc(addr));
      link.href = "mailto:" + addr;
      const copy = el("button", "copy-btn", "Copy");
      copy.type = "button";
      copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(addr);
          copy.textContent = "Copied ✓";
        } catch {
          copy.textContent = "Select & copy";
        }
        setTimeout(() => { copy.textContent = "Copy"; }, 1800);
      });
      zone.append(link, copy);
    });
    zone.append(btn);
    em.append(zone);
    grid.append(em);

    // Payments
    const p = el("div", "c-card reveal");
    p.append(el("div", "c-ico", "💳"));
    p.append(el("h3", null, "Payments"));
    p.append(el("p", null, "Flexible options for commissions."));
    const row = el("div", "pay-row");
    (C.contact.payments || []).forEach((x) => row.append(el("span", "pay-chip", "✓ " + esc(x))));
    p.append(row);
    grid.append(p);
  }

  /* ==========================================================
     FX: reveal-on-scroll, counters, nav, particles
     ========================================================== */
  function initReveal() {
    const els = $$(".reveal");
    const perParent = new Map();
    els.forEach((n) => {
      const i = perParent.get(n.parentElement) || 0;
      perParent.set(n.parentElement, i + 1);
      n.style.transitionDelay = Math.min(i * 70, 350) + "ms";
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
      { threshold: 0.12 }
    );
    els.forEach((n) => ob.observe(n));
  }

  function initCounters() {
    const row = $("#stats-row");
    if (!row) return;
    const nums = $$(".stat-num", row);
    const setFinal = () => nums.forEach((n) => { n.textContent = n.dataset.final; });
    if (REDUCED) { setFinal(); return; }

    const ob = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        ob.disconnect();
        nums.forEach((n) => {
          const final = n.dataset.final || "0";
          const m = final.match(/^(\d+(?:\.\d+)?)(.*)$/);
          if (!m) { n.textContent = final; return; }
          const target = parseFloat(m[1]);
          const suffix = m[2];
          const dec = (m[1].split(".")[1] || "").length;
          const t0 = performance.now();
          const dur = 1500;
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            n.textContent = (target * eased).toFixed(dec) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );
    ob.observe(row);
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

  function initParticles() {
    const canvas = $("#fx");
    if (!canvas) return;
    if (REDUCED) { canvas.remove(); return; }

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;

    function resize() {
      w = canvas.width = canvas.offsetWidth * dpr;
      h = canvas.height = canvas.offsetHeight * dpr;
    }
    window.addEventListener("resize", resize, { passive: true });
    resize();

    const COLORS = ["#ffb224", "#ffb224", "#ff8a5c", "#9db8ff", "#ffffff"];
    const ps = Array.from({ length: 64 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.5 + 0.5) * dpr,
      s: (Math.random() * 0.32 + 0.06) * dpr,
      o: Math.random() * 0.45 + 0.12,
      p: Math.random() * Math.PI * 2,
      c: COLORS[(Math.random() * COLORS.length) | 0],
    }));

    (function loop() {
      ctx.clearRect(0, 0, w, h);
      for (const pt of ps) {
        pt.y -= pt.s;
        pt.p += 0.012;
        if (pt.y < -12) { pt.y = h + 12; pt.x = Math.random() * w; }
        ctx.globalAlpha = pt.o * (0.62 + 0.38 * Math.sin(pt.p));
        ctx.fillStyle = pt.c;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, 7);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- boot ---------- */
  renderMeta();
  renderHero();
  renderFeatured();
  renderGames();
  renderShowcase();
  renderTech();
  renderAbout();
  renderContact();
  initReveal();
  initCounters();
  initNav();
  initParticles();
})();
