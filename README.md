# Tejaswani Yadav — Cinematic Portfolio

A responsive, dark editorial portfolio built with React + Vite. Includes scroll reveals, CSS-rendered abstract 3D-style hero art, interactive project filters and detail dialogs, responsive navigation, and live GitHub public profile/repository/event data.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints in the terminal.

## Build for production

```bash
npm run build
npm run preview
```

The production build is generated in `dist/` and can be deployed to Vercel, Netlify, or another static host.

## Personalize before publishing

Edit `src/data.js`:

- Set `profile.github` to your exact GitHub username. The GitHub section then fetches public profile stats, repositories, and recent public events from GitHub's public API.
- Replace `profile.email`, `profile.linkedin`, and `profile.resume` with your real details. Put your PDF resume at `public/resume.pdf` (create the `public` folder first).
- Confirm every project description, stack, and milestone. Replace each `repo` and `demo` empty string with the real URL. The supplied project descriptions are editable starting points, not claims of a complete implementation.
- Add or remove projects in the `projects` array. Supported categories are `AI / ML` and `Web development`; update `filters` in `src/main.jsx` if you add categories.

## Notes

- GitHub API requests are made in the visitor's browser. Unauthenticated public API limits apply, so the UI includes loading and error states.
- GitHub events are recent public events, not a complete activity history. A full contribution heatmap would need a separate supported data source.
- The hero visual is drawn with CSS gradients, lighting, orbital rings, and pointer-responsive perspective. This avoids a heavy 3D dependency while preserving the abstract glowing form direction.
- Animations respect `prefers-reduced-motion` and the layout adapts to desktop, tablet, and mobile widths.
