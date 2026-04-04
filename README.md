# ketanningaale.github.io

Personal portfolio website for **Ketann Ingaale** — Analytics Engineer at Healf, MSc Data Science (University of Southampton), and AI/ML researcher.

Live at: [ketanningaale.github.io](https://ketanningaale.github.io)

---

## About

Dark, cinematic portfolio inspired by [kprverse.com](https://kprverse.com). Built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies, deploys directly via GitHub Pages.

---

## Structure

```
├── index.html              # Main entry point
├── css/
│   ├── main.css            # Full design system & layout
│   └── animations.css      # Keyframes & animation utilities
├── js/
│   ├── main.js             # ES module entry point
│   ├── preloader.js        # Loading screen with progress counter
│   ├── cursor.js           # Custom cursor + magnetic effect
│   ├── hero.js             # Canvas starfield, parallax, role typewriter
│   ├── scroll.js           # Scroll progress, reveal observer, counters
│   └── interactions.js     # Menu, card tilt, spotlight, toast, back-to-top
└── scripts/
    └── content.py          # Python content helper (generates JSON)
```

---

## Features

- **Frame overlay** — thin border system with corner marks at all four edges
- **Custom cursor** — outer ring + inner dot with magnetic button effect
- **Hero canvas** — animated starfield with shooting stars and mouse parallax
- **Parallax depth layers** — three layered orbs and a dot grid that respond to mouse and scroll
- **Hamburger menu** — full-screen overlay with large display typography (clip-path reveal)
- **Side navigation** — fixed left panel with active section dot indicators
- **Scroll reveals** — IntersectionObserver-driven fade-up on every section
- **3D card tilt** — perspective transform + radial spotlight on project cards
- **Preloader** — percentage counter with cycling filename list
- **Grain overlay** — subtle film grain texture
- **Mobile responsive** — adapts for desktop, tablet, and mobile

---

## Content

| Section | Details |
|---|---|
| **Experience** | Healf (Analytics Engineer), The Boots Group, Infosys, Leap Info Systems |
| **Projects** | LiDAR Localisation (MSc dissertation, 77/100), Blockchain Grievance System (Springer paper + Patent), HMM Stock Prediction, GDP Analysis, Forest Fire Simulation, UAV Quadcopter |
| **Education** | MSc Data Science — University of Southampton (2023–2024) · MBA Finance — PUMBA (2020–2022) · B.E. Computer Engineering — SPPU (2016–2020) |
| **Publications** | Blockchain-Based Grievance Management System — Springer / FICTA 2020 · DOI: 10.1007/978-981-15-5788-0_20 |
| **Patent** | Grievance Redressal System — Publication No. 38/2019 |
| **Scholarship** | Southampton Presidential International Scholarship |

---

## Updating Content

All portfolio content is defined in `scripts/content.py` for easy updates:

```bash
python3 scripts/content.py --output content.json
```

---

## Deployment

Pushes to `main` deploy automatically via GitHub Pages.

```bash
git push origin main
```

---

## Contact

- Email: ketann.ingaale@gmail.com
- LinkedIn: [linkedin.com/in/ketanningaale](https://linkedin.com/in/ketanningaale)
- GitHub: [github.com/ketanningaale](https://github.com/ketanningaale)
