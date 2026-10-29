/* ==========================================================================
   PORTFOLIO CONFIG — the only file you need to edit.
   ==========================================================================
   The site is one page, read top to bottom: intro, games, showcases,
   "How I build" (code), about, contact. Everything is built from here.

   Adding a game           -> append an object to `projects`.
   Adding a showcase video -> append an object to `caseStudies`.
   Code examples           -> edit `engineering.snippets`.

   Text tokens usable in any string:
     {name}   -> profile.displayName
     {years}  -> years since profile.startYear (auto-computed)

   CREDIT ACCURACY
   Every project carries a `role` that states the exact scope of the work
   ("Core Contributor", "Solo Developer", "Refactoring Engineer",
   "Front-End Scripter", "Scripter"). Keep these truthful — precise credit
   scope is a professionalism signal, not a limitation.
   ========================================================================== */

window.PORTFOLIO_CONFIG = {

  // Featured images appear directly below the hero stats.
  featuredGallery: {
    title: "Stygian — Basement",
    description: "A quiet arrival into an underground parking complex, connected by a multi-level spiral ramp.",
    note: "Blender environment renders · Development study",
    images: [
      {
        src: "assets/stygian/arrival.jpg",
        alt: "View from the lift into Stygian's concrete basement garage, with parked vintage cars and fluorescent lighting.",
        caption: "01 / Lift arrival",
      },
      {
        src: "assets/stygian/spiral-court.jpg",
        alt: "A curved vehicle ramp winding around the central concrete column of the multi-level spiral court.",
        caption: "02 / Spiral court",
      },
      {
        src: "assets/stygian/complex-overview.jpg",
        alt: "Cutaway overview of the modular garage, showing parking decks, connecting routes and the central spiral ramp.",
        caption: "03 / Complex overview",
      },
    ],
  },

  /* ------------------------------------------------------------------
     1. IDENTITY
     ------------------------------------------------------------------ */
  profile: {
    displayName: "AZ9tumas",
    monogram: "A9",
    tagline: "Roblox Gameplay & Systems Programmer",
    startYear: 2021,
    availability: "Open for commissions",

    // Paragraph under your name at the top of the page.
    intro:
      "Gameplay and systems programmer for Roblox. {years} years of production " +
      "work across nine shipped titles — from the movement system behind " +
      "Yellowstone Unleashed (80M+ visits) to full-stack solo builds like " +
      "Race Through Time.",

    // Stat cards at the top of the page. Keep labels honest about scope.
    stats: [
      { value: "80M+",  label: "Visits", note: "Yellowstone Unleashed" },
      { value: "~2.5K", label: "Peak concurrent players", note: "Build an Igloo" },
      { value: "9+",    label: "Shipped titles", note: "Since 2021" },
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

    // Shown as a list next to the About text.
    facts: [
      { key: "Focus",      value: "Gameplay systems, client–server architecture, player data" },
      { key: "Experience", value: "Professional Roblox development since 2021" },
      { key: "Credits",    value: "9+ shipped titles — contributor, solo and refactor roles" },
      { key: "Education",  value: "Computer Science & Engineering (undergraduate)" },
      { key: "Contact",    value: "Discord DM is fastest" },
    ],
  },

  /* ------------------------------------------------------------------
     2. CONTACT
     ------------------------------------------------------------------
     The email address is stored split in two parts and is only assembled
     in the browser when "Reveal email" is clicked — it never appears in
     the page source or the rendered page before that.
     ------------------------------------------------------------------ */
  contact: {
    discordUrl: "https://discord.com/users/409297983734284288",
    emailUser: "az9tumas2025",   // part before the @
    emailDomain: "gmail.com",    // part after the @
    paymentNote: "PayPal or Robux",
  },

  /* ------------------------------------------------------------------
     3. GAMES — one card each in "Games I've worked on"
     ------------------------------------------------------------------
     slug         (required) unique id; footage can point at it
     title, url, role, summary (required)
     stats        optional { visits: "80M+", concurrents: "~2.5K" }
     status       optional e.g. "Live", "Sold"
     tags         optional short keywords
     highlights   optional bullet points about what you built
     ------------------------------------------------------------------ */
  projects: [
    {
      slug: "yellowstone-unleashed",
      title: "Yellowstone Unleashed",
      url: "https://www.roblox.com/games/12054551325/Yellowstone-Unleashed",
      role: "Core Contributor",
      status: "Live",
      summary:
        "Contributed core gameplay systems to this open-world dinosaur " +
        "survival title — primarily the player movement system that every " +
        "session runs on. The game has passed 80 million visits and is " +
        "still climbing.",
      stats: { visits: "80M+" },
      tags: ["Open world", "Survival", "Movement systems"],
    },
    {
      slug: "build-an-igloo",
      title: "Build an Igloo",
      url: "https://www.roblox.com/games/131921967019798/Build-an-Igloo",
      role: "Scripter",
      status: "Sold",
      summary:
        "Scripter on this title before it was sold to new owners. The game " +
        "peaked at around 2,500 concurrent players.",
      stats: { concurrents: "~2.5K" },
      tags: ["Building"],
    },
    {
      slug: "catch-lucky-blocks",
      title: "Catch Lucky Blocks",
      url: "https://www.roblox.com/games/134074745511140/Catch-Lucky-Blocks",
      role: "Refactoring Engineer",
      status: "Live",
      summary:
        "Brought in on an existing codebase — not the original scripter — to " +
        "carry out a major refactor across both the front end and back end, " +
        "improving structure, reliability and maintainability of a live game.",
      tags: ["Systems refactor", "Live codebase"],
    },
    {
      slug: "my-mutant-anime",
      title: "My Mutant Anime",
      url: "https://www.roblox.com/games/87137064532509/My-Mutant-Anime",
      role: "Front-End Scripter",
      summary:
        "Scripted the front end of this anime collector title — client-side " +
        "gameplay flow, UI and presentation.",
      tags: ["Collector", "UI & client systems"],
    },
  ],

  // Shown under the games list.
  additionalContributions:
    "Beyond the games above, I've also built systems and features for " +
    "five-plus other shipped titles for studios and clients.",

  /* ------------------------------------------------------------------
     4. SHOWCASES — "Systems in action" videos, in this order
     ------------------------------------------------------------------
     slug, title, summary, parts (required)
     parts     list of { label, id } — id is the part after "watch?v=" or
               "youtu.be/" in the YouTube URL. Two or more parts render
               as one player with chapter tabs.
     project   optional slug of a game: the video is shown on that game's
               card instead of under "Systems in action".
     role, highlights, note   optional
     Order here is the order on the page.
     ------------------------------------------------------------------ */
  caseStudies: [
    {
      slug: "gun-system",
      title: "Gun System",
      summary:
        "A production-ready gun framework inspired by the Roblox game " +
        "Rivals. Equip, fire and reload flow with recoil, effects and " +
        "responsive feedback.",
      parts: [{ label: "Watch", id: "j3AZ4PPkTJM" }],
    },
    {
      slug: "race-through-time",
      title: "Race Through Time",
      role: "Solo Developer — Full Stack",
      summary:
        "My strongest end-to-end credit. I scripted the entire game — every " +
        "front-end and back-end system, from the gameplay loop and data " +
        "layer up to the cinematic VFX shown in this reel.",
      highlights: [
        "Full gameplay loop — front end and back end, solo",
        "Server architecture and data persistence",
        "Cinematic VFX, timed sequences and screen feedback",
      ],
      parts: [{ label: "VFX & cinematics reel", id: "OZkQ9dOZD88" }],
    },
    {
      slug: "my-mutant-anime-footage",
      project: "my-mutant-anime",
      title: "My Mutant Anime",
      role: "Front-End Scripter",
      summary:
        "Two development milestones of the shipped front end — switch " +
        "chapters to see the UI and client-side flow evolve between builds.",
      parts: [
        { label: "Chapter 1", id: "xc1r7EwBPww" },
        { label: "Chapter 2", id: "v4KJQhiVFMY" },
      ],
    },
    {
      slug: "dinosaur-survival",
      title: "Dinosaur Survival",
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
      slug: "inventory-system",
      title: "Minecraft-Style Inventory",
      summary:
        "A Minecraft-style inventory rebuilt in Roblox — grid slots, " +
        "stacking, drag-and-drop and hotbar, with clean client–server " +
        "synchronisation.",
      parts: [{ label: "Watch", id: "Rr014rk_zFA" }],
    },
  ],

  /* ------------------------------------------------------------------
     5. HOW I BUILD — principles and the tabbed code viewer
     ------------------------------------------------------------------
     These snippets are representative examples of the patterns used, not
     code lifted from a client project. Replace them with your own
     excerpts whenever you like — `lang` is "luau" or "text".
     ------------------------------------------------------------------ */
  engineering: {
    intro:
      "How I structure Roblox codebases: a small number of conventions, " +
      "applied consistently, so systems stay easy to extend and safe to " +
      "ship to a live game.",

    principles: [
      {
        title: "Server-authoritative",
        body: "Clients request; the server validates and decides. Currency, " +
              "inventory and progression never trust client input.",
      },
      {
        title: "One owner per system",
        body: "Each system is a single Knit service (server) or controller " +
              "(client) with a clear public surface — no shared global state.",
      },
      {
        title: "Data integrity first",
        body: "Player data goes through session-locked ProfileService " +
              "profiles with a versioned template, so it can't duplicate or roll back.",
      },
      {
        title: "Profiled, not guessed",
        body: "Hot paths are measured with the MicroProfiler before and after " +
              "changes; per-frame work stays off the server where possible.",
      },
    ],

    layout: {
      title: "Project layout",
      file: "place structure",
      lang: "text",
      code: [
        "ReplicatedStorage/",
        "├─ Packages/            -- Knit, Promise, Signal",
        "└─ Shared/              -- types, constants, pure modules",
        "ServerScriptService/",
        "├─ Services/            -- Knit services (server-authoritative)",
        "└─ Runtime.server.lua   -- adds services, starts Knit",
        "StarterPlayer/StarterPlayerScripts/",
        "├─ Controllers/         -- Knit controllers (input, UI, camera)",
        "└─ Runtime.client.lua   -- adds controllers, starts Knit",
      ].join("\n"),
    },

    snippets: [
      {
        id: "services",
        title: "Services",
        description:
          "A service owns one system on the server. The client can only call " +
          "what's exposed under `Client`, and every change is validated server-side.",
        file: "ServerScriptService/Services/CurrencyService.lua",
        lang: "luau",
        code: [
          'local ReplicatedStorage = game:GetService("ReplicatedStorage")',
          'local Knit = require(ReplicatedStorage.Packages.Knit)',
          "",
          "local CurrencyService = Knit.CreateService({",
          '\tName = "CurrencyService",',
          "\tClient = {",
          "\t\tBalanceChanged = Knit.CreateSignal(),",
          "\t},",
          "})",
          "",
          "function CurrencyService:KnitStart()",
          '\tself.DataService = Knit.GetService("DataService")',
          "end",
          "",
          "-- Server-only: the client can never call this directly.",
          "function CurrencyService:Grant(player: Player, amount: number)",
          '\tassert(amount > 0, "amount must be positive")',
          "\tlocal profile = self.DataService:GetProfile(player)",
          "\tif not profile then",
          "\t\treturn",
          "\tend",
          "",
          "\tprofile.Data.Coins += amount",
          "\tself.Client.BalanceChanged:Fire(player, profile.Data.Coins)",
          "end",
          "",
          "function CurrencyService.Client:GetBalance(player: Player): number",
          "\tlocal profile = self.Server.DataService:GetProfile(player)",
          "\treturn if profile then profile.Data.Coins else 0",
          "end",
          "",
          "return CurrencyService",
        ].join("\n"),
      },
      {
        id: "player-data",
        title: "Player data",
        description:
          "Profiles are session-locked, reconciled against a template on load, " +
          "and released when the player leaves — so data can't duplicate across servers.",
        file: "ServerScriptService/Services/DataService.lua",
        lang: "luau",
        code: [
          'local Players = game:GetService("Players")',
          'local ServerStorage = game:GetService("ServerStorage")',
          'local Knit = require(game:GetService("ReplicatedStorage").Packages.Knit)',
          'local ProfileService = require(ServerStorage.Packages.ProfileService)',
          "",
          "local TEMPLATE = {",
          "\tCoins = 0,",
          "\tInventory = {},",
          "\tVersion = 1,",
          "}",
          "",
          "local DataService = Knit.CreateService({ Name = \"DataService\" })",
          'local store = ProfileService.GetProfileStore("PlayerData", TEMPLATE)',
          "local profiles = {}",
          "",
          "local function onPlayerAdded(player: Player)",
          '\tlocal profile = store:LoadProfileAsync("Player_" .. player.UserId)',
          "\tif not profile then",
          '\t\tplayer:Kick("Your data failed to load. Please rejoin.")',
          "\t\treturn",
          "\tend",
          "",
          "\tprofile:AddUserId(player.UserId)",
          "\tprofile:Reconcile()",
          "\tprofile:ListenToRelease(function()",
          "\t\tprofiles[player] = nil",
          '\t\tplayer:Kick("Your data was loaded on another server.")',
          "\tend)",
          "",
          "\tif player:IsDescendantOf(Players) then",
          "\t\tprofiles[player] = profile",
          "\telse",
          "\t\tprofile:Release()",
          "\tend",
          "end",
          "",
          "function DataService:GetProfile(player: Player)",
          "\treturn profiles[player]",
          "end",
          "",
          "function DataService:KnitInit()",
          "\tfor _, player in Players:GetPlayers() do",
          "\t\ttask.spawn(onPlayerAdded, player)",
          "\tend",
          "\tPlayers.PlayerAdded:Connect(onPlayerAdded)",
          "\tPlayers.PlayerRemoving:Connect(function(player)",
          "\t\tlocal profile = profiles[player]",
          "\t\tif profile then",
          "\t\t\tprofile:Release()",
          "\t\tend",
          "\tend)",
          "end",
          "",
          "return DataService",
        ].join("\n"),
      },
      {
        id: "controllers",
        title: "Controllers",
        description:
          "Controllers own client behaviour. They talk to services through " +
          "Knit's networking, which returns promises — no raw RemoteEvents to manage.",
        file: "StarterPlayerScripts/Controllers/HudController.lua",
        lang: "luau",
        code: [
          'local ReplicatedStorage = game:GetService("ReplicatedStorage")',
          'local Knit = require(ReplicatedStorage.Packages.Knit)',
          "",
          'local HudController = Knit.CreateController({ Name = "HudController" })',
          "",
          "function HudController:KnitStart()",
          '\tlocal CurrencyService = Knit.GetService("CurrencyService")',
          "",
          "\tCurrencyService:GetBalance():andThen(function(coins)",
          "\t\tself:SetCoins(coins)",
          "\tend)",
          "",
          "\tCurrencyService.BalanceChanged:Connect(function(coins)",
          "\t\tself:SetCoins(coins)",
          "\tend)",
          "end",
          "",
          "function HudController:SetCoins(coins: number)",
          "\t-- update the HUD label, play a count-up tween, etc.",
          "end",
          "",
          "return HudController",
        ].join("\n"),
      },
    ],
  },

  /* ------------------------------------------------------------------
     6. TOOLKIT
     ------------------------------------------------------------------ */
  frameworks: [
    {
      name: "Knit",
      tagline: "Game architecture",
      url: "https://sleitnick.github.io/Knit/",
      description:
        "Services on the server, controllers on the client, and clean " +
        "networking in between.",
    },
    {
      name: "ProfileService",
      tagline: "Data persistence",
      url: "https://madstudioroblox.github.io/ProfileService/",
      description:
        "Session-locked player profiles that prevent duplication and data " +
        "loss at scale.",
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
     7. SEO — browser tab title & search-engine description
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
