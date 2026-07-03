/* ==========================================================================
   PORTFOLIO CONFIG — the ONLY file you need to edit.
   ==========================================================================
   Everything on the site (name, links, games, videos, skills, contact)
   is rendered from this file. Save, refresh, done.

   Handy tokens you can use inside any text string:
     {name}    -> your developer name
     {years}   -> years of experience (auto-computed from startYear)
     {visits}  -> combined visits across all games (auto-summed)
     {titles}  -> total titles worked on (your games + additionalTitles)
   ========================================================================== */

window.PORTFOLIO_CONFIG = {

  /* ------------------------------------------------------------------
     1. IDENTITY
     ------------------------------------------------------------------ */
  developer: {
    name: "AZ9tumas",
    monogram: "A9",                       // small logo badge in the navbar
    role: "Roblox Game Developer",
    startYear: 2021,                      // {years} is computed from this
    additionalTitles: 5,                  // titles you contributed to beyond the games listed below
    availability: "Open for commissions", // hero status badge

    // Wrap a word in **double asterisks** to give it the gradient highlight.
    heroTitle: "I build Roblox worlds that **millions** come back to.",
    heroSub:
      "Game programmer with {years}+ years in production and {visits} combined visits " +
      "across shipped titles — specializing in gameplay systems, combat, VFX and UI.",

    aboutParagraphs: [
      "I'm {name} — a Roblox game developer who has been shipping production titles since 2021. " +
      "My flagship project, Yellowstone Unleashed, has crossed 80 million visits, and my own " +
      "releases like My Pooping Pigeons have peaked at over 1,000 concurrent players.",

      "Beyond my own games, I've helped develop 5+ titles for studios and clients — everything " +
      "from combat frameworks and inventories to VFX and full game loops. I'm currently pursuing " +
      "a Computer Science & Engineering degree, and I bring that engineering rigor to every " +
      "commission: Knit for architecture, ProfileService for bulletproof data, and clean, " +
      "optimized Luau throughout.",
    ],

    facts: [
      "🎓 Computer Science undergrad",
      "🕹️ Shipping games since 2021",
      "🌍 {visits} combined visits",
      "✅ 18+ · Commission-ready",
      "💳 PayPal & Robux accepted",
    ],
  },

  /* ------------------------------------------------------------------
     2. CONTACT
     ------------------------------------------------------------------
     The email is stored split in two parts so scrapers can't harvest it.
     It is only assembled in the browser when the "Reveal email" button
     is clicked.
     ------------------------------------------------------------------ */
  contact: {
    discordUrl: "https://discord.com/users/409297983734284288",
    emailUser: "rounakdas2025",   // part before the @
    emailDomain: "gmail.com",     // part after the @
    payments: ["PayPal", "Robux"],
  },

  /* ------------------------------------------------------------------
     3. GAMES — add a new block to add a new game card.
     ------------------------------------------------------------------
     Fields:
       title         (required) game name
       url           (required) Roblox game link
       description   (required) 1–2 punchy sentences
       icon          emoji used on the generated cover art
       colors        [from, to] hex colors for the cover gradient
       role          small label shown next to the title
       visits        raw number (auto-formatted, auto-summed into {visits})
       peakCcu       raw number, shows a "peak CCU" badge
       tags          short keywords
       featured      true = renders as the big flagship card (use on ONE game)
       showcaseAnchor true = adds a "Watch showcase" link that jumps to the videos
     ------------------------------------------------------------------ */
  games: [
    {
      title: "Yellowstone Unleashed",
      url: "https://www.roblox.com/games/12054551325/Yellowstone-Unleashed",
      description:
        "My flagship project and highest achievement to date — an experience that has grown " +
        "past 80 million visits and is still climbing.",
      icon: "🦖",
      colors: ["#ff9a3d", "#d9481e"],
      role: "Developer",
      visits: 80000000,
      tags: ["Open World", "Survival", "Dinosaurs"],
      featured: true,
    },
    {
      title: "My Pooping Pigeons",
      url: "https://www.roblox.com/games/140327715500229/My-Pooping-Pigeons",
      description:
        "A viral hit that peaked at 1,000+ concurrent players — proof I build games that scale.",
      icon: "🕊️",
      colors: ["#38bdf8", "#6366f1"],
      role: "Developer",
      visits: 12200000,
      peakCcu: 1000,
      tags: ["Simulator", "Viral Hit"],
    },
    {
      title: "Catch Lucky Blocks",
      url: "https://www.roblox.com/games/134074745511140/Catch-Lucky-Blocks",
      description:
        "Fast, satisfying and endlessly replayable — an arcade catch game built around lucky drops.",
      icon: "🍀",
      colors: ["#34d399", "#0ea5e9"],
      role: "Developer",
      tags: ["Arcade", "Casual"],
    },
    {
      title: "My Mutant Anime",
      url: "https://www.roblox.com/games/87137064532509/My-Mutant-Anime",
      description:
        "My anime mutant-collector — every system built end to end. See it running in the showcase below.",
      icon: "🧬",
      colors: ["#a855f7", "#ec4899"],
      role: "Developer",
      tags: ["Anime", "Collector"],
      showcaseAnchor: true,
    },

    /* TEMPLATE — copy, un-comment and fill in to add a game:
    {
      title: "Game Name",
      url: "https://www.roblox.com/games/XXXXXXXX/Game-Name",
      description: "One or two punchy sentences.",
      icon: "🎮",
      colors: ["#ffb224", "#ff6b3d"],
      role: "Developer",
      visits: 1000000,        // optional
      peakCcu: 500,           // optional
      tags: ["Tag A", "Tag B"],
    },
    */
  ],

  // Text on the "+N more titles" card (N comes from additionalTitles above).
  collabNote:
    "Hired developer on 5+ additional titles — systems, features and full builds " +
    "delivered for studios and clients.",

  /* ------------------------------------------------------------------
     4. VIDEO SHOWCASE — add a new block to add a new video card.
     ------------------------------------------------------------------
     Fields:
       title       (required) card title
       category    (required) used to build the filter chips automatically
       description (required) what the viewer is looking at
       videos      (required) list of { label, id } — the id is the part
                   after "watch?v=" or "youtu.be/" in the YouTube URL.
                   Give MORE THAN ONE video to get the series toggle
                   (great for showing v1 → v2 evolution of a project).
       note        small caption shown under series cards
     ------------------------------------------------------------------ */
  showcase: [
    {
      title: "My Mutant Anime — Full Game",
      category: "Full Game",
      description:
        "Complete gameplay systems from My Mutant Anime — progression, collection mechanics, " +
        "UI and the entire game loop, all shipped to production.",
      note: "Two milestones of the same game — flip between them to see how far it evolved.",
      videos: [
        { label: "Milestone 1", id: "xc1r7EwBPww" },
        { label: "Milestone 2", id: "v4KJQhiVFMY" },
      ],
    },
    {
      title: "Gun System",
      category: "Combat",
      description:
        "A production-ready gun framework — responsive equip, fire and reload flow " +
        "with crisp feedback and effects.",
      videos: [{ label: "Watch", id: "RCdd1NCaIw4" }],
    },
    {
      title: "Dinosaur Survival",
      category: "Survival",
      description:
        "Survival systems in a prehistoric world — threats, resources and the " +
        "moment-to-moment gameplay loop.",
      note: "Part 1 and Part 2 — toggle to watch the project grow.",
      videos: [
        { label: "Part 1", id: "i0Be3nKqocI" },
        { label: "Part 2", id: "wFRHT9GDBCo" },
      ],
    },
    {
      title: "Race Through Time — VFX",
      category: "VFX",
      description:
        "Cinematic visual effects built for Race Through Time — timed sequences, " +
        "screen feedback and the polish that sells the fantasy.",
      videos: [{ label: "Watch", id: "OZkQ9dOZD88" }],
    },
    {
      title: "Minecraft-Style Inventory",
      category: "UI & Systems",
      description:
        "A Minecraft-style inventory rebuilt in Roblox — grid slots, stacking, " +
        "drag-and-drop and hotbar with clean client-server sync.",
      videos: [{ label: "Watch", id: "Rr014rk_zFA" }],
    },

    /* TEMPLATE — copy, un-comment and fill in to add a video:
    {
      title: "Project Name",
      category: "Combat",                       // reuse a category or create a new one
      description: "What this video demonstrates.",
      videos: [{ label: "Watch", id: "VIDEO_ID" }],
    },
    */
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
        "My backbone for structured, maintainable codebases — Services on the server, " +
        "Controllers on the client, and clean networking in between.",
    },
    {
      name: "ProfileService",
      tagline: "Data persistence",
      url: "https://madstudioroblox.github.io/ProfileService/",
      description:
        "The industry standard for safe player data — session-locked profiles that " +
        "prevent dupes and data loss, even at scale.",
    },
  ],

  skills: [
    "Luau",
    "Roblox Studio",
    "Client-Server Networking",
    "DataStore Architecture",
    "Combat & Weapon Systems",
    "UI / UX Implementation",
    "VFX & Particle Effects",
    "NPC & AI Behavior",
    "Performance Optimization",
    "Game Design",
  ],

  /* ------------------------------------------------------------------
     6. SEO — browser tab title & search-engine description
     ------------------------------------------------------------------ */
  seo: {
    title: "AZ9tumas — Roblox Game Developer",
    description:
      "Roblox game developer since 2021 with {visits} combined visits across shipped titles, " +
      "including Yellowstone Unleashed (80M+). Open for commissions — systems, combat, VFX, UI.",
  },
};
