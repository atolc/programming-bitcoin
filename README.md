# Programming Bitcoin — Interactive Notes

> An interactive, bilingual (ES / EN) companion to Jimmy Song's [*Programming Bitcoin*](https://programmingbitcoin.com/) book. Read the chapter notes, run Python examples live in the browser, and solve exercises — all without installing anything.

**Live site →** <https://caeher.github.io/programming-bitcoin/>

---

## ✨ Features

| Feature | Details |
|---|---|
| 📖 Chapter notes | Markdown notes for all 14 chapters, available in Spanish and English |
| 🐍 Live Python sandbox | Run code snippets directly in the browser powered by [Pyodide](https://pyodide.org/) |
| 🧩 Interactive exercises | Solve chapter exercises and check your answers with automated tests |
| 🌐 i18n | Full Spanish / English support with per-locale routing |
| 🌙 Dark / Light mode | Theme toggle included |
| ➕ Math rendering | LaTeX equations rendered via [KaTeX](https://katex.org/) |

---

## 🖼️ Screenshots

_Coming soon — contributions welcome!_

---

## 🚀 Quickstart

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- [pnpm](https://pnpm.io/) ≥ 10 — install with `npm i -g pnpm`

### Run locally

```bash
# Clone the repository
git clone https://github.com/caeher/programming-bitcoin.git
cd programming-bitcoin

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The app will be available at <http://localhost:5173>.

### Build for production

```bash
pnpm build
```

The output goes to `dist/`.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Bundler | [Vite](https://vitejs.dev/) |
| UI library | [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Code editor | [Monaco Editor](https://microsoft.github.io/monaco-editor/) |
| Python runtime | [Pyodide](https://pyodide.org/) (WASM) |
| Math | [KaTeX](https://katex.org/) via `remark-math` + `rehype-katex` |
| Routing | [React Router v7](https://reactrouter.com/) |
| i18n | [i18next](https://www.i18next.com/) + `react-i18next` |
| Markdown | `react-markdown` + custom remark/rehype plugins |

---

## 📁 Project Structure

```
programming-bitcoin/
├── docs/
│   ├── es/          # Spanish chapter notes (Markdown)
│   └── en/          # English chapter notes (Markdown)
├── src/
│   ├── components/  # Reusable React components
│   ├── context/     # React contexts (locale, theme, …)
│   ├── data/        # Chapter & exercise manifests
│   ├── hooks/       # Custom hooks
│   ├── i18n/        # i18next configuration
│   ├── lib/         # Utility functions & types
│   ├── locales/     # UI translation strings (JSON)
│   └── pages/       # Route-level page components
├── scripts/         # Build & validation scripts (Node.js)
└── pdfs/            # Source PDFs (not tracked in Git)
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for a detailed guide on how to add new chapters, fix notes, or improve the codebase.

---

## 📄 License

The **source code** of this project is released under the [MIT License](./LICENSE).

Chapter notes and exercises are educational summaries of the book *Programming Bitcoin* by Jimmy Song, published by O'Reilly Media. All rights to the original book content belong to the respective copyright holders. This project is intended for personal study and educational use only.
