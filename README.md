# AZ9tumas — Portfolio

A zero-build, config-driven portfolio designed for **GitHub Pages**. Pure HTML/CSS/JS — no dependencies, no build step.

## Editing content

Everything is controlled from **[config.js](config.js)** — you never need to touch the HTML, CSS or JS.

| What | Where in config.js |
|---|---|
| Name, monogram, role, availability | `developer` |
| Hero headline & subline | `developer.heroTitle` / `heroSub` (wrap a word in `**stars**` for the gradient highlight) |
| Discord / email / payments | `contact` (email is stored split as `emailUser` + `emailDomain` so bots can't scrape it — it only assembles on button click) |
| Games | `games` array — copy the commented TEMPLATE block to add one |
| Videos | `showcase` array — copy the TEMPLATE block; give an entry **two or more videos** and it automatically renders a series toggle |
| Frameworks & skills | `frameworks` / `skills` |
| Tab title & SEO description | `seo` |

Auto-computed for you (usable as `{tokens}` in any text): years of experience from `startYear`, combined visits summed from every game's `visits`, and total titles.

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
