# Tour Maps

[![Docs Status](https://img.shields.io/badge/docs-live-blue?style=flat-square)](https://dmccreary.github.io/tour-maps/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-222?style=flat-square&logo=github)](https://dmccreary.github.io/tour-maps/)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/license-CC%20BY--NC%204.0-lightgrey?style=flat-square)](license.txt)
[![Made with MkDocs Material](https://img.shields.io/badge/MkDocs-Material-1f77b4?style=flat-square)](https://squidfunk.github.io/mkdocs-material/)

Tour Maps is a MkDocs Material site that curates interactive tour simulations and reference material for mentors and learners. The repository contains the authored Markdown source, theme overrides, and deployment scripts used to publish the live site.

## Quick Links
- Live site: https://dmccreary.github.io/tour-maps/
- Contributor guide: `AGENTS.md`
- MkDocs config: `mkdocs.yml`

## Getting Started
### Prerequisites
- Python 3.9+ and `pip`, or an equivalent Conda environment (`conda activate mkdocs`)

### Installation
```bash
git clone https://github.com/dmccreary/tour-maps.git
cd tour-maps
python3 -m pip install "mkdocs-material>=9"
```
If you use Conda, install dependencies once with `conda install -n mkdocs mkdocs-material` and run commands via `conda run -n mkdocs ...`.

## Local Development
- `mkdocs serve` — start a live-reloading preview at http://127.0.0.1:8000.
- `mkdocs build --strict` — generate `site/` and fail fast on broken links, warnings, or configuration drift.
- `mkdocs gh-deploy --force` — push the latest strict build to GitHub Pages after review.

## Project Structure
```text
mkdocs.yml        # Navigation, theme, and Markdown extensions
docs/
  index.md        # Landing page
  sims/           # Microsimulation guides and templates
  css/            # Custom styles (e.g., extra.css)
  js/             # Front-end helpers (extra.js)
site/             # Generated output (do not edit manually)
AGENTS.md         # Contributor workflow and coding guidelines
```

## Content & Contribution Guidelines
- Follow the authoring standards captured in `AGENTS.md`, including file naming, heading hierarchy, and media placement.
- Keep documentation focused and versioned: group related edits in a single branch, use present-tense commit messages (for example, `Refine sims glossary entry`), and open pull requests with a short summary, screenshots for visual changes, and links to related issues.
- Run `mkdocs build --strict` before submitting any pull request to ensure warnings are resolved and the navigation matches `mkdocs.yml`.

## Acknowledgements
We are grateful to the [p5.js](https://p5js.org/) community and core team for their creative coding toolkit, which powers several of the tour simulations hosted in this project.

## License
Content is provided under the Creative Commons Attribution-NonCommercial 4.0 International License. See `license.txt` and `docs/license.md` for full terms.
