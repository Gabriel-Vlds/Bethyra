# Bethyra Agent Guidelines

## Project Shape
- This is a PHP site with the main page in [index.php](index.php), the audit endpoint in [analyze.php](analyze.php), and static assets under [public/assets/](public/assets/).
- The visual language is intentionally futuristic and high-contrast. Preserve the existing tone in [public/assets/css/styles.css](public/assets/css/styles.css) and [public/assets/js/app.js](public/assets/js/app.js).
- Use [README.md](README.md) for the project overview and local run notes instead of repeating them here.

## Working Rules
- Do not guess causes. If evidence is insufficient, say what is unknown, state the strongest local hypothesis, and offer the smallest checks or options.
- Prefer narrow, reversible changes over broad refactors.
- If a change affects the UI, verify the impacted section in the browser rather than assuming the interaction still works.
- If a change touches PHP, run `php -l` on the edited file and test both the success path and the expected failure path when relevant.
- Do not remove code unless there is direct evidence that it is unused, broken, or superseded.

## Work History
- Use session history and prior notes when they exist to spot repeated failures, project-specific conventions, and old dead ends.
- If there is no useful history, say so plainly and fall back to local evidence from the code and docs.
- When the project has accumulated enough patterns, mention `/chronicle improve` as a way to refine instructions over time.
- Treat history as context, not proof: it can guide investigation, but it does not replace validating the current code path.

## Conventions
- Keep edits aligned with the current structure: `index.php` owns the page markup, `analyze.php` owns the PageSpeed request flow, `styles.css` owns the visual system, and `app.js` owns the hero/section interactions.
- Favor plain language in explanations. When a user asks why something fails, separate facts from hypotheses and call out uncertainty explicitly.
- Link to existing docs rather than duplicating them.
