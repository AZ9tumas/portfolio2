/* ==========================================================================
   PORTFOLIO CONFIG — the ONLY file you need to edit.
   ==========================================================================
   Everything on the site is rendered from this file. Save, refresh, done.

   Adding a project  -> append an object to `projects`.
   Adding a video    -> append an object to `caseStudies`.
   No HTML/CSS/JS changes are ever required.

   Available text tokens (usable in any string):
     {name}   -> profile.displayName
     {years}  -> years since profile.startYear (auto-computed)

   CREDIT ACCURACY — read before editing roles:
   Every project carries a `role` badge that states the exact scope of the
   contribution ("Core Contributor", "Solo Developer", "Refactoring
   Engineer", "Front-End Scripter", "Contributor"). Keep these truthful —
   precise credit scope is a professionalism signal, not a limitation.
   ========================================================================== */

window.PORTFOLIO_CONFIG = {

  /* ------------------------------------------------------------------
     1. IDENTITY
     ------------------------------------------------------------------ */
  profile: {
    displayName: "AZ9tumas",
    monogram: "A9",                 // small mark in the navbar + favicon
    tagline: "Roblox Gameplay & Systems Programmer",
    startYear: 2021,                // {years} is computed from this
    availability: "Open for commissions",

    heroHeadline: "Gameplay systems for Roblox titles that ship.",
    heroSub:
      "{years} years of production work across nine shipped titles — from the " +
      "movement system behind Yellowstone Unleashed (80M+ visits) to " +
      "full-stack solo builds like Race Through Time.",

    // Shown as a quiet stat band under the hero. Values are plain strings —
    // keep the labels honest about credit scope.
    heroStats: [
      { value: "80M+",   label: "Visits — Yellowstone Unleashed" },
      { value: "1,000+", label: "Peak concurrent players" },
      { value: "9+",     label: "Shipped titles" },
    ],

    aboutParagraphs: [
      "I'm {name} — a Roblox game programmer working professionally since 2021. " +
      "My credits span the full range of production roles: core contributor on " +
      "Yellowstone Unleashed (80M+ visits), where I built the player movement " +
      "system; solo developer on Race Through Time, which I scripted end to " +
      "end; and refactoring engineer on live titles like Catch Lucky Blocks, " +
      "where I restructured an existing codebase across the front and back end.",

      "I'm currently completing a Computer Science & Engineering degree " +
      "alongside client work, and I bring that engineering foundation to every " +
      "project — Knit for architecture, ProfileService for data integrity, and " +
      "clean, profiled Luau throughout.",
    ],

    // Icon names come from the built-in set: graduation-cap, calendar,
    // layers, message-circle, credit-card, check, mail.
    facts: [
      { icon: "graduation-cap", text: "Computer Science & Engineering undergraduate" },
      { icon: "calendar",       text: "Professional game development since 2021" },
      { icon: "layers",         text: "9+ shipped titles across contributor, solo and refactor roles" },
      { icon: "message-circle", text: "Fastest response via Discord DM" },
    ],
  },

  /* ------------------------------------------------------------------
     2. CONTACT
     ------------------------------------------------------------------
     The email address is stored split in two parts and is only assembled
     in the browser when the "Reveal email" button is clicked — it never
     appears in the page source or rendered DOM before that.
     ------------------------------------------------------------------ */
  contact: {
    discordUrl: "https://discord.com/users/409297983734284288",
    emailUser: "rounakdas2025",     // part before the @
    emailDomain: "gmail.com",       // part after the @
    paymentNote: "Payment accepted via PayPal or Robux.",
  },

  /* ------------------------------------------------------------------
     3. PROJECTS — append an object to add a project card.
     ------------------------------------------------------------------
     Fields:
       title        (required) game name
       url          (required) Roblox game link
       role         (required) exact credit-scope badge text
       contribution (required) 1–3 sentences stating precisely what you did
       stats        optional  { visits: "80M+", concurrents: "1,000+" }
       tags         optional  short keywords
       featured     true on ONE project = renders as the large lead card
       caseStudyAnchor true = adds a "Development footage" link that jumps
                    to the case-studies section
     ------------------------------------------------------------------ */
  projects: [
    {
      title: "Yellowstone Unleashed",
      url: "https://www.roblox.com/games/12054551325/Yellowstone-Unleashed",
      role: "Core Contributor",
      contribution:
        "Contributed core gameplay systems to this open-world dinosaur " +
        "survival title — primarily the player movement system that every " +
        "session runs on. The game has passed 80 million visits and is " +
        "still climbing.",
      stats: { visits: "80M+" },
      tags: ["Open world", "Survival", "Movement systems"],
      featured: true,
    },
    {
      title: "Catch Lucky Blocks",
      url: "https://www.roblox.com/games/134074745511140/Catch-Lucky-Blocks",
      role: "Refactoring Engineer",
      contribution:
        "Brought in on an existing codebase — not the original scripter — to " +
        "carry out a major refactor across both the front end and back end, " +
        "improving structure, reliability and maintainability of a live game.",
      tags: ["Systems refactor", "Live codebase"],
    },
    {
      title: "My Mutant Anime",
      url: "https://www.roblox.com/games/87137064532509/My-Mutant-Anime",
      role: "Front-End Scripter",
      contribution:
        "Scripted the front end of this anime collector title — client-side " +
        "gameplay flow, UI and presentation.",
      tags: ["Collector", "UI & client systems"],
      caseStudyAnchor: true,
    },
  ],

  // Quiet footnote row under the project grid.
  additionalContributions: {
    count: "5+",
    note:
      "Beyond the credits above, contributed systems and features to " +
      "five-plus additional shipped titles for studios and clients.",
  },

  /* ------------------------------------------------------------------
     4. CASE STUDIES & FOOTAGE — append an object to add a video.
     ------------------------------------------------------------------
     Fields:
       title     (required) card title
       category  (required) group heading; entries with the same category
                 render together under one label (order follows this file)
       summary   (required) what the viewer is looking at
       parts     (required) list of { label, id } — id is the part after
                 "watch?v=" or "youtu.be/" in the YouTube URL.
                 TWO OR MORE parts = the card renders as one cohesive unit
                 with a chapter switcher (never two separate tiles).
       role      optional credit-scope badge (only where credit is defined)
       note      optional small caption under multi-part cards
       featured  true on ONE entry = large flagship case-study treatment
       highlights optional bullet list, shown on the featured entry
     ------------------------------------------------------------------ */
  caseStudies: [
    {
      title: "Race Through Time",
      category: "Featured case study",
      role: "Solo Developer — Full Stack",
      summary:
        "The strongest end-to-end credit in this portfolio. I scripted the " +
        "entire game — every front-end and back-end system, from the " +
        "gameplay loop and data layer up to the cinematic VFX shown in " +
        "this reel.",
      highlights: [
        "Full gameplay loop — front end and back end, solo",
        "Server architecture and data persistence",
        "Cinematic VFX, timed sequences and screen feedback",
      ],
      parts: [{ label: "VFX & cinematics reel", id: "OZkQ9dOZD88" }],
      featured: true,
    },
    {
      title: "My Mutant Anime",
      category: "Title showcases",
      role: "Front-End Scripter",
      summary:
        "Two development milestones of the shipped front end I scripted — " +
        "switch chapters to see the UI and client-side flow evolve " +
        "between builds.",
      note: "One title, two builds — the chapters show the same front end at different stages.",
      parts: [
        { label: "Chapter 1", id: "xc1r7EwBPww" },
        { label: "Chapter 2", id: "v4KJQhiVFMY" },
      ],
    },
    {
      title: "Dinosaur Survival",
      category: "Title showcases",
      summary:
        "A survival project shown at two stages of development — threats, " +
        "resources and the moment-to-moment loop, with Part 2 building " +
        "directly on the systems from Part 1.",
      note: "Part 2 extends Part 1 — switch between them to see the build grow.",
      parts: [
        { label: "Part 1", id: "i0Be3nKqocI" },
        { label: "Part 2", id: "wFRHT9GDBCo" },
      ],
    },
    {
      title: "Minecraft-Style Inventory",
      category: "Systems deep-dives",
      summary:
        "A Minecraft-style inventory rebuilt in Roblox — grid slots, " +
        "stacking, drag-and-drop and hotbar, with clean client–server " +
        "synchronisation.",
      parts: [{ label: "Watch", id: "Rr014rk_zFA" }],
    },
    {
      title: "Gun System",
      category: "Systems deep-dives",
      summary:
        "A production-ready gun framework — equip, fire and reload flow " +
        "with recoil, effects and responsive feedback.",
      parts: [{ label: "Watch", id: "RCdd1NCaIw4" }],
    },
  ],

  /* ------------------------------------------------------------------
     5. FRAMEWORKS & SKILLS
     ------------------------------------------------------------------ */
  frameworks: [
    {
      name: "Knit",
      tagline: "Game architecture",
      url: "https://sleitnick.github.io/Knit/",
      description:
        "Backbone for structured, maintainable codebases — Services on the " +
        "server, Controllers on the client, and clean networking in between.",
    },
    {
      name: "ProfileService",
      tagline: "Data persistence",
      url: "https://madstudioroblox.github.io/ProfileService/",
      description:
        "Session-locked player profiles that prevent duplication and data " +
        "loss at scale — the standard for safe player data on Roblox.",
    },
  ],

  skills: [
    "Luau",
    "Roblox Studio",
    "Client–Server Networking",
    "DataStore Architecture",
    "Movement & Character Systems",
    "Combat & Weapon Systems",
    "UI / UX Implementation",
    "VFX & Particle Effects",
    "NPC & AI Behavior",
    "Performance Optimization",
  ],

  /* ------------------------------------------------------------------
     6. SEO — browser tab title & search-engine description
     ------------------------------------------------------------------ */
  seo: {
    title: "AZ9tumas — Roblox Gameplay & Systems Programmer",
    description:
      "Roblox game programmer working professionally since 2021. Core " +
      "contributor on Yellowstone Unleashed (80M+ visits), solo developer " +
      "on Race Through Time, and systems engineer across nine shipped " +
      "titles. Open for commissions.",
  },
};
