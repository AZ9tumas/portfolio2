# AZ9tumas — Portfolio

A zero-build, one-page portfolio for **GitHub Pages**. It reads top to bottom in the order a client cares about: who I am, games I've worked on, systems in action (videos), how I build (principles + code), about, contact. Pure HTML/CSS/JS — no dependencies, no build step.

## Editing content

Everything is rendered from **[config.js](config.js)** — you never need to touch the HTML, CSS or JS.

| What | Where in config.js |
|---|---|
| Name, tagline, intro paragraph, stat cards, about text, facts list | `profile` |
| Discord, email, payment note | `contact` — the email is stored split as `emailUser` + `emailDomain` and only assembled in the browser when "Show" is clicked |
| Games (one card each) | `projects` — needs a unique `slug`; optional `stats`, `status`, `tags` |
| Showcase videos | `caseStudies` — shown in config order; two or more `parts` give chapter tabs; set `project` to a game's slug to show the video on that game's card instead |
| "How I build": principles and code tabs | `engineering` — snippets take `title`, `description`, `file`, `lang` (`"luau"` or `"text"`) and `code` |
| Frameworks & skills | `frameworks` / `skills` |
| Tab title & SEO description | `seo` |

Text tokens usable in any string: `{name}` and `{years}` (auto-computed from `profile.startYear`). Wrap words in backticks for inline code.

### Credit accuracy

Every project carries a `role` stating the exact scope of the contribution ("Core Contributor", "Solo Developer — Full Stack", "Refactoring Engineer", "Front-End Scripter", "Scripter"). Keep these truthful.

### Code snippets

The snippets under "How I build" are representative examples of the patterns used (Knit services and controllers, ProfileService player data), and the page says so. Swap in real excerpts from your own projects whenever you can.

### Theme

Light and dark themes follow the visitor's system setting; the toggle in the header overrides it and is remembered. Colours are tokens at the top of [css/style.css](css/style.css).

## Preview locally

```bash
cd portfolio2
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Push to the `main` branch.
2. Repo **Settings → Pages → Source**: `main` branch, `/ (root)` folder.
3. The site goes live at `https://<username>.github.io/<repo>/` within a minute or two.

All asset paths are relative, so it works from any repo name or subfolder.
