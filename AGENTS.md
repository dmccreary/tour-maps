# Repository Guidelines

## Project Structure & Module Organization
Site configuration lives in `mkdocs.yml`, which defines navigation, theming, and Markdown extensions. Authored pages sit inside `docs/`, with topical walkthroughs under `docs/sims/`, shared assets in `docs/img/`, and custom behavior in `docs/css/` and `docs/js/extra.js`. Treat the generated `site/` directory as build output; refresh it through `mkdocs build` so it stays aligned with the source markdown.

## Build, Test, and Development Commands
Install the tooling once with `python3 -m pip install "mkdocs-material>=9"` to match the configured theme. From the repository root:
- `mkdocs serve`: local preview with live reload at `http://127.0.0.1:8000`.
- `mkdocs build --strict`: compile the static site under `site/` and fail on broken links or warnings.
- `mkdocs gh-deploy --force`: publish to GitHub Pages after confirming the strict build is clean.

## Coding Style & Naming Conventions
Author content in Markdown using descriptive H2/H3 headings that mirror the navigation titles. Keep lines under ~100 characters and favor lists or tables for procedural guidance. File names should be lowercase with hyphens (for example, `docs/sims/tour-map/index.md`). Store new media in `docs/img/` with concise alt text, and follow the existing four-space indentation in CSS and JS helpers so diffs stay readable.

## Testing Guidelines
Run `mkdocs build --strict` before every pull request and resolve all warnings. Use `mkdocs serve` to manually spot-check navigation paths, glossary anchors, and embedded iframes on both desktop and mobile viewports. Update example screenshots or data in `docs/sims/` when guided tours change to keep instructions synchronized with the rendered site.

## Commit & Pull Request Guidelines
Commits in this repository stay short and present-tense. Prefer imperative summaries such as `Refine sims glossary entry` and group related markdown edits together. Pull requests should outline the user-facing impact, list any new assets, and link supporting issues. Include a screenshot or local preview URL for visual changes, and request review before running `mkdocs gh-deploy`.
