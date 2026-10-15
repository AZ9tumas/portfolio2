# AZ9tumas — Portfolio

A zero-build, config-driven portfolio designed for **GitHub Pages**. Pure HTML/CSS/JS — no dependencies, no build step, fully static output.

## Editing content

Everything is controlled from **[config.js](config.js)** — you never need to touch the HTML, CSS or JS.

| What | Where in config.js |
|---|---|
| Name, monogram, tagline, availability | `profile` |
| Header text and stat tiles | `profile.tagline` / `heroHeadline` / `heroSub` / `heroStats` (the header colours follow the featured project's `art`, or set `profile.heroArt`) |
| Discord / email / payment note | `contact` (email is stored split as `emailUser` + `emailDomain`; it is only assembled in the browser when "Reveal email" is clicked and never appears in the rendered DOM before that) |
| Projects | `projects` array — append an object to add a card; set `featured: true` on exactly one to make it the large lead card. Each project gets album-style art from its four `art` colours; add `image: "assets/name.jpg"` to use a real screenshot instead. Clicking a project opens a detail sheet |
| Videos / case studies | `caseStudies` array — append an object; give an entry **two or more `parts`** and it renders as one cohesive unit with a chapter switcher; entries sharing a `category` group together automatically |
| Frameworks & skills | `frameworks` / `skills` |
| Tab title & SEO description | `seo` |

Text tokens usable in any string: `{name}` and `{years}` (auto-computed from `profile.startYear`).

### Credit accuracy

Every project and case study carries a `role` badge stating the exact scope of the contribution ("Core Contributor", "Solo Developer", "Refactoring Engineer", "Front-End Scripter", "Scripter"). Keep these truthful when editing — precise credit scope is a professionalism signal, and the mix of solo, contributor and refactor credits is presented deliberately as range.

### Themes

The layout follows Apple Music (sidebar, artist header, credits track list, mini player, phone tab bar) using a Liquid Glass material and squircle corners. Dark (default) and light appearances; visitors switch in the sidebar or the phone top bar, and the choice is remembered. All colours are tokens at the top of [css/style.css](css/style.css) — `--red` is the accent.

### Icons

The site uses a single inline icon family (Lucide, 2px rounded stroke). Fact entries in `profile.facts` reference icons by name; available names are listed in `ICON_PATHS` at the top of [js/main.js](js/main.js). No emoji anywhere.

## Preview locally

```bash
cd portfolio2
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a repository (name it `<username>.github.io` for a root URL, or anything else for `/<repo>/`).
2. Push these files to the `main` branch.
3. Repo **Settings → Pages → Source**: select `main` branch, `/ (root)` folder, save.
4. The site goes live at `https://<username>.github.io/<repo>/` within a minute or two.

All asset paths are relative, so it works from any repo name or subfolder.
