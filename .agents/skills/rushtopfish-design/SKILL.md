---
name: rushtopfish-design
description: Use this skill to generate well-branded interfaces and assets for RushTopFish (a pilates studio + a sister dance company), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files (`colors_and_type.css`, `assets/`, `preview/`, `ui_kits/pilates/`, `ui_kits/dance/`).

RushTopFish is ONE brand with TWO surfaces:
- **Pilates** — light theme (cream bg, orange CTA), grounded studio voice. `data-theme="pilates"` (default).
- **Dance** — dark theme (ink bg, pink accent), editorial voice. `data-theme="dance"`.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out of `assets/` and reference `colors_and_type.css`. The logotype is always the provided SVG — never retype "RushTopFish" in a live font. Fraunces is a Google Font *substitute* for the display face; flag this when a user asks you to match the logotype exactly.

If working on production code, you can copy assets, the tokens file, and the inline UI-kit components (buttons, class cards, nav, schedule rows, forms) as reference.

If the user invokes this skill without any other guidance, ask them:
- Which surface — Pilates (light) or Dance (dark)?
- What are they building — marketing page, class booking, season announcement, poster, deck?
- Do they have real content, or should you use sample copy in the established voice?

Then act as an expert designer for RushTopFish. Output HTML artifacts or production code, depending on the need. Remember: no emoji, first-person plural voice, one accent color per composition, warm neutrals only.
