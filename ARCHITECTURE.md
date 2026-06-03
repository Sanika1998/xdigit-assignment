## Architecture overview

### Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + React Router v7 (SPA, `ssr: false`) |
| Build | Vite 8 + `@react-router/dev` |
| Forms | React Hook Form (`onTouched` + `onChange` revalidation) |
| UI | MUI 9 + Emotion (RTL cache for Arabic) |
| i18n | i18next + react-i18next (EN / AR) |
| Data | REST Countries API (countries + dial codes) |
| Persistence | `localStorage` (form progress + locale + theme) |

### Request flow (high level)

```
Browser
  -> app/entry.client.tsx (HydratedRouter)
  -> app/root.tsx (Layout, LocaleProvider, global CSS)
  -> app/routes.ts (route map)
       /                    -> Landing
       /application/:step   -> Personal | Family | Situation
       /application/success -> Confirmation
```

### Key folders

| Path | Role |
|------|------|
| `app/` | Route modules, root layout, client entry |
| `src/components/` | UI (form steps, landing, header) |
| `src/context/` | `ApplicationFormProvider` (wizard + submit + autosave) |
| `src/validation/` | Field rules, step validity, date/phone validators |
| `src/api/` | OpenAI client, mock submit handler |
| `src/i18n/` | Translations and locale bootstrap |
| `src/theme/` | MUI theme, dark mode, RTL Emotion cache |
| `src/routing/steps.ts` | Step slugs and URL helpers |

### Form wizard

- Three steps map to URLs: `/application/personal`, `/family`, `/situation`.
- `ApplicationFormContext` owns react-hook-form state, step navigation, per-step validation, and submit.
- Progress is saved to `localStorage` on change and on `pagehide` / `beforeunload`.
- Invalid step URLs redirect to `personal`.

### Styling

- MUI theme (`AppTheme.tsx`) handles palette, dark mode, `CssBaseline`, component overrides, and RTL direction.
- Shared `sx` modules (`landingSx.ts`, `formSx.ts`, `phoneFieldSx.ts`) style the shell, landing, form card, and phone row.

### Lazy loading

Route pages and step panels are loaded with `React.lazy` + `Suspense` to keep the initial bundle smaller.

## Design decisions

1. URL-driven steps. Deep links and browser back/forward work because the step index is derived from the route param.
2. Client-only SPA. There is no server render, which keeps deploys simple: static files after `npm run build`.
3. Locale on `document.documentElement`. `dir` / `lang` are set early (inline script in `root.tsx` plus i18n) to reduce the RTL flash on refresh.
4. Phone country sync. Selecting an address country can auto-fill the dial code when it is empty, and validation re-runs so errors clear.
5. Separate validation modules. `formRules`, `stepFields`, and the numeric/date validators keep the rules testable without mounting the full UI.
6. MUI plus CSS. MUI covers form controls and density; custom CSS covers the marketing layout and the trickier phone/grid cases.

## Possible improvements

- Server-side rendering. Enabling React Router SSR (`ssr: true` in `react-router.config.ts`) would give a faster first paint, better SEO on the landing page, and locale/`dir` set on the server to cut the RTL flash. This needs the `localStorage`-only features (autosave, theme) handled on the client after hydration.
- A backend API for submit and OpenAI so the API key can be hidden.
- More route-level code splitting, plus route `clientLoader` prefetch where it helps.
- E2E tests (Playwright) for the full wizard and RTL.
- One shared `tokens.css` for design tokens used by both MUI and custom CSS.
- A PWA / offline hint for when the countries API fails.
