# Bayhaqy Kids 🧒🧑‍🎓

> Bilingual (English & Indonesian) learning platform for kids from Kindergarten to Grade 9.
> 100% free · 100% kid-safe · 100% browser-based.

🌐 **Live site**: <https://bayhaqy.my.id/kids/>

## What's inside

Six subjects, each with interactive lessons, simulations, and games:

| Subject | Topics | Grade range |
|---------|--------|-------------|
| 🧮 **Math** | Counting, addition, multiplication table, fractions (pizza), shapes, algebra | K – G9 |
| 📚 **Language** | Alphabet, sight words, rhyming, parts of speech, synonyms, essay structure | K – G9 |
| 🔬 **Science** | Five senses, water cycle (sim), solar system (sim), plants, states of matter, food chains, photosynthesis, Newton's laws | K – G9 |
| 💻 **Tech** | What is a computer, typing, first HTML page, binary numbers, internet safety, loops & patterns, AI basics | K – G9 |
| 🏛️ **History** | Indonesian flag, Independence Day (1945), National Heroes, ancient civilizations, World War II, Indonesia timeline | K – G9 |
| 🎮 **Games** | Math Rush (60s timed), Word Match, Memory Cards, Color Hunt, Capital Quiz, Shape Sorter | K – G9 |

## Why it's different

- **Bilingual** — Toggle between English and Bahasa Indonesia on any page. Same content, two languages.
- **Grade-aware** — Each lesson is tagged with a grade level. Filter by grade to see what fits your learner.
- **Interactive** — Drag, draw, type, click, listen (Web Speech API). Simulations make abstract ideas visible.
- **Self-paced** — No timers in lessons (only in the optional Math Rush game). Kids learn at their own speed.
- **Safe** — No ads, no sign-ups, no tracking, no chat. Everything runs in the browser.
- **Offline-ready** — Installable as a PWA. After first load, kids can keep learning without internet.
- **Open source** — Every line is here on GitHub.

## Tech stack

- **Vanilla HTML/CSS/JS** — no build step, no framework, runs anywhere.
- **CSS custom properties** for theming (light/dark + per-subject accent colors).
- **Web Speech API** for pronunciation in alphabet and counting lessons.
- **Canvas 2D** for simulations (water cycle, solar system).
- **localStorage** for theme + language persistence.
- **PWA** — manifest.json + service worker (coming soon) for offline use.

## File structure

```
kids/
├── index.html              Landing page (hero + subject grid + features + grade bands)
├── manifest.json           PWA manifest
├── robots.txt              Allow all + sitemap
├── sitemap.xml             All pages
├── README.md               This file
├── .nojekyll               Bypass Jekyll on GitHub Pages
├── assets/
│   ├── theme.css           Shared theme (red-black-white + subject accents)
│   ├── app-shell.js        Header + footer + theme + i18n + helpers
│   ├── i18n.js             English + Indonesian strings
│   └── lessons.js          Lesson registry (subject → lesson list)
├── icons/
│   └── logo.png            Logo (TODO: design a kid-friendly logo)
├── math/
│   ├── index.html          Subject landing
│   ├── counting-1-10/
│   ├── addition-basics/
│   ├── multiplication-table/
│   ├── fractions-pizza/    (planned)
│   ├── math-quiz/          (planned)
│   └── ...
├── language/
│   ├── index.html
│   ├── alphabet/
│   └── ...
├── science/
│   ├── index.html
│   ├── water-cycle/        Simulation
│   ├── solar-system/       Simulation
│   └── ...
├── tech/
│   ├── index.html
│   ├── internet-safety/
│   └── ...
├── history/
│   ├── index.html
│   ├── independence-day/
│   ├── indonesian-heroes/
│   └── ...
└── games/
    ├── index.html
    ├── math-rush/          60-second timed math
    ├── memory-cards/       Flip-and-match
    └── ...
```

## Pedagogy notes

Lessons follow **best practices for K-9 instruction**:

1. **Concrete → pictorial → abstract** — start with manipulatives (fruit, dots), then pictures, then symbols.
2. **Immediate feedback** — kids see "Correct!" or "Try again" instantly, with the right answer revealed.
3. **Multiple modalities** — visual (canvas), auditory (speech), kinesthetic (drag, tap).
4. **Spiral curriculum** — topics return at higher grade levels with more depth.
5. **Positive reinforcement** — celebrations (pop animation, stars, speech) for every win; never punish wrong answers.
6. **Bilingual bridge** — same concept in two languages helps transfer (especially for Indonesian kids learning English).
7. **Aligned with Kurikulum Merdeka** themes (Indonesia's national curriculum) and international K-8 standards.

## Browser support

Tested on:
- Chrome / Edge 110+ (Windows, macOS, Android, ChromeOS)
- Safari 16+ (macOS, iOS)
- Firefox 110+

Features used: CSS custom properties, Grid, Canvas 2D, Web Speech API, localStorage, Intersection Observer, matchMedia.

## Roadmap

- [ ] Add 20+ more lessons (target: 5 per subject)
- [ ] Service worker for full offline use
- [ ] Progress tracking (localStorage, no account)
- [ ] Audio narration for every lesson
- [ ] Translations for more languages (Arabic, Mandarin, Spanish)
- [ ] Teacher dashboard for classroom use
- [ ] Printable worksheets (PDF)

## Contributing

Found a bug? Want to add a lesson? Open an issue or pull request.

Lesson format: a single `index.html` in a folder under the subject. Include the standard `<head>` (preconnect, theme flash script, theme.css) and `<body data-app-name="..." data-subject="..." class="subject-page">`. Then add a lesson entry to `assets/lessons.js`.

## License

MIT — free for any educational use.

## Author

**Achmad Bayhaqy** — IT leader, parent, education advocate.
- 🌐 <https://bayhaqy.my.id/>
- 📧 bayhaqy@bayhaqy.my.id
- 🐙 <https://github.com/bayhaqy>
