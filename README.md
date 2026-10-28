# AZ9tumas — Portfolio

A zero-build portfolio for **GitHub Pages**, laid out like product documentation: a sidebar of pages, an "On this page" rail, ⌘K / Ctrl K search, code blocks and video embeds. Pure HTML/CSS/JS — no dependencies, no build step.

## Editing content

Everything is rendered from **[config.js](config.js)** — you never need to touch the HTML, CSS or JS.

| What | Where in config.js |
|---|---|
| Name, tagline, intro paragraph, stat cards, about text, profile table | `profile` |
| Discord, email, payment note | `contact` — the email is stored split as `emailUser` + `emailDomain` and only assembled in the browser when "Reveal" is clicked |
| Shipped titles (one page each, under **Shipped titles**) | `projects` — needs a unique `slug`; optional `stats`, `status`, `tags`, `highlights` |
| Systems & videos (one page each, under **Systems & footage**) | `caseStudies` — give an entry two or more `parts` for chapter tabs; set `project` to a title's slug to show the footage on that title's page instead |
| Architecture page: principles, project layout, code snippets | `engineering` — snippets take `title`, `description`, `file`, `lang` (`"luau"` or `"text"`) and `code` |
| Frameworks & skills | `frameworks` / `skills` |
| Tab title & SEO description | `seo` |

Text tokens usable in any string: `{name}` and `{years}` (auto-computed from `profile.startYear`). Wrap words in backticks for inline code.

Pages, the sidebar, search and the previous/next links all update automatically when you add entries.

### Credit accuracy

Every project carries a `role` stating the exact scope of the contribution ("Core Contributor", "Solo Developer — Full Stack", "Refactoring Engineer", "Front-End Scripter", "Scripter"). The Credits page explains what each role means. Keep these truthful.

### Code snippets

The snippets on the Architecture page are representative examples of the patterns used (Knit services and controllers, ProfileService player data), and the page says so. Swap in real excerpts from your own projects whenever you can.

### Theme

Light and dark themes follow the visitor's system setting; the toggle in the header overrides it and is remembered. Colours are tokens at the top of [css/style.css](css/style.css).

## URLs

Pages use hash routes, so they work on GitHub Pages without a server: `#/credits`, `#/projects/build-an-igloo`, `#/engineering/architecture`. A section link adds `:section-id`, e.g. `#/engineering/architecture:player-data`.

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
