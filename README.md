# AZ9tumas — Portfolio

A zero-build, config-driven portfolio designed for **GitHub Pages**. Pure HTML/CSS/JS — no dependencies, no build step, fully static output.

## Editing content

Everything is controlled from **[config.js](config.js)** — you never need to touch the HTML, CSS or JS.

| What | Where in config.js |
|---|---|
| Name, monogram, tagline, availability | `profile` |
| Hero headline, subline, stat band | `profile.heroHeadline` / `heroSub` / `heroStats` |
| Discord / email / payment note | `contact` (email is stored split as `emailUser` + `emailDomain`; it is only assembled in the browser when "Reveal email" is clicked and never appears in the rendered DOM before that) |
| Projects | `projects` array — append an object to add a card; set `featured: true` on exactly one to make it the large lead card |
| Videos / case studies | `caseStudies` array — append an object; give an entry **two or more `parts`** and it renders as one cohesive unit with a chapter switcher; entries sharing a `category` group together automatically |
| Frameworks & skills | `frameworks` / `skills` |
| Tab title & SEO description | `seo` |

Text tokens usable in any string: `{name}` and `{years}` (auto-computed from `profile.startYear`).

### Credit accuracy

Every project and case study carries a `role` badge stating the exact scope of the contribution ("Core Contributor", "Solo Developer", "Refactoring Engineer", "Front-End Scripter", "Contributor"). Keep these truthful when editing — precise credit scope is a professionalism signal, and the mix of solo, contributor and refactor credits is presented deliberately as range.

### Icons

The site uses a single inline icon family (Lucide, 1.75px stroke). Fact entries in `profile.facts` reference icons by name; available names are listed in `ICON_PATHS` at the top of [js/main.js](js/main.js). No emoji anywhere.

## Preview locally

```bash
cd Portfolio
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a repository (name it `<username>.github.io` for a root URL, or anything else for `/<repo>/`).
2. Push these files to the `main` branch.
3. Repo **Settings → Pages → Source**: select `main` branch, `/ (root)` folder, save.
4. The site goes live at `https://<username>.github.io/<repo>/` within a minute or two.

All asset paths are relative, so it works from any repo name or subfolder.
