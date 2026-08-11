# Bayhaqy Kids

Bilingual (English & Indonesian) learning platform for kids from Kindergarten to Grade 9. Interactive lessons, simulations, and games across Math, Language, Science, Tech, and History. Aligned with Singapore Primary (SPC), Cambridge Primary, IB PYP/MYP, IPC, Montessori, and Indonesia's Kurikulum Merdeka.

## What's inside

- **6 subjects**: Math, Language, Science, Tech, History, Games
- **40+ lessons** across K–9 grade bands
- **2 languages**: English & Bahasa Indonesia (toggle anytime)
- **Natural text-to-speech** in both languages — pick the best available voice automatically
- **Curriculum-aligned**: every lesson is tagged with one or more curricula
- **100% kid-safe**: no ads, no sign-ups, no tracking, no chat
- **Works offline** as a PWA — installable on any device

## Tech stack

- Vanilla HTML/CSS/JS (no build step, no frameworks)
- Shared `theme.css` + `app-shell.js` for consistent header/footer/theme across all pages
- `lessons.js` registry drives the lesson list on each subject page
- `i18n.js` provides bilingual strings via `data-i18n` attributes
- Web Speech API for natural text-to-speech (browser-native, no API)
- GitHub Pages + Cloudflare for hosting at `bayhaqy.my.id/kids/`

## Repo structure

```
kids/
├── index.html              # Landing page
├── manifest.json           # PWA manifest
├── robots.txt
├── sitemap.xml
├── README.md
├── assets/
│   ├── theme.css           # Shared styles (palette, header, footer, components)
│   ├── app-shell.js        # Header/footer/theme/i18n/TTS injection
│   ├── i18n.js             # Bilingual strings (EN/ID)
│   └── lessons.js          # Lesson registry (subject + grade + curriculum)
├── icons/
│   ├── logo.png            # Bayhaqy logo
│   ├── icon-192.png        # PWA icon
│   ├── icon-512.png        # PWA icon
│   └── og-image.png        # Open Graph image
├── math/                   # Subject folder
│   ├── index.html          # Subject landing (grade + curriculum filters)
│   ├── counting-1-10/
│   ├── addition-basics/
│   ├── multiplication-table/
│   └── ... (see lessons.js for full list)
├── language/
├── science/
├── tech/
├── history/
└── games/
```

## Curriculum alignment

Each lesson is tagged with one or more curricula:

| Code | Curriculum | Notes |
|------|------------|-------|
| SPC | Singapore Primary | Concrete-Pictorial-Abstract, bar modeling |
| Cambridge | Cambridge Primary | Stage 1–9 framework |
| IB | IB PYP / MYP | Inquiry-driven, concept-based |
| IPC | International Primary Curriculum | Thematic, cross-curricular |
| Montessori | Montessori | Hands-on, sensory, self-paced |
| ID | Kurikulum Merdeka | Fase A–D (Indonesia national) |

## Adding a new lesson

1. Add an entry to `assets/lessons.js` under the appropriate subject.
2. Create a folder at `<subject>/<slug>/index.html` with the lesson content.
3. Add the lesson URL to `sitemap.xml`.

Lesson HTML should include:
- `<script src="/kids/assets/i18n.js"></script>` and `<script src="/kids/assets/app-shell.js"></script>` in `<body>`
- `data-app-name` and `data-subject` attributes on `<body>`
- `[data-speak]` attributes on text blocks to enable TTS
- `[data-i18n]` attributes on translatable strings

## License

MIT — free to use, fork, and adapt for educational use.

## Author

**Achmad Bayhaqy** — [bayhaqy.my.id](https://bayhaqy.my.id/)
