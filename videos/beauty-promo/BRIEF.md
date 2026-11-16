# Beauty Enhance — promo film (motion-ui)

- **Type:** looping app demo (feature highlight), 12 s, 60 fps, 1080×1080, muted, hold loop.
- **Product:** Beauty Enhance (this repo, `index.html`). No live URL is used in the lockup yet.
- **Device:** a generic phone (no brand frame).

## Screens (rebuilt from `ref/`)
| Screen | From | Simplified |
|---|---|---|
| upload | `ref/01-upload.png` | subtitle, drop-zone hint and feature labels became bars; title size enlarged slightly for legibility; gradients became the flat brand colour |
| editor | `ref/03-editor-full.png` | photo is a drawn landscape (no real person); "صورة قديمة" shortened to "قديمة" and "وضوح HD" to "HD" to fit 24 px text; resolution segment and settings sections removed; privacy line became bars |

## Script
choose photo → editor opens → before/after slider dragged → "تجميل" mode tapped → scroll → «حفظ الصورة» → toast «تم حفظ الصورة» → lockup.

## Callouts (all from the app's own copy, `index.html` / `js/app.js`)
| Callout | Source |
|---|---|
| بلمسة واحدة | hero title |
| تحسين تلقائي ذكي | feature f1 |
| تجميل البورتريه | feature f2 |
| صورك لا تغادر جهازك | privacy line |

Lockup: icon, "Beauty Enhance", «اجعل صورك أوضح وأجمل» (hero title).

## Engine notes
The template draws text glyph by glyph, which breaks Arabic joining. This film's copy of the engine draws any Arabic line as one shaped RTL run (`measureRun`/`layoutText` in `src/film.html`), and measures its cap height on the alef.
Fonts: Tajawal 700 (Arabic subset) and Inter 700 (Latin), both SIL OFL, embedded.
