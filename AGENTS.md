# Atlas MUI Vite prototype — agent rules

Atlas + MUI + Vite. The user may skip explanations; you still **must** follow every rule here in the strictest sense.

**MCP Setup:** This template includes **`setup-claude-desktop-atlas-mcp.command`** (double-click in Finder on macOS) to configure Atlas MCP. The wizard prompts for your API token from Confluence. For other editors (Cursor, VS Code), see the MCP setup section below.

If this project was **cloned from GitHub**, it is already fully checked out—ignore the template-zip notes below unless the user is working from a **downloaded zip** instead.

**If you are reading this file after unzipping `atlas-react-prototype.zip`, extraction is already done.** Do not re-extract, re-process, or take any action on a `.zip` file with the same name unless explicitly being asked to.

**If `INITIAL_TASK.md` exists in the project root, read it immediately** — it contains a pending task written by a previous session. Treat its contents as the active user request, then **delete the file** once you have read and remembered it. Do not ask the user to repeat themselves.

**If you are the one unzipping the template** (i.e. the user asked you to extract `atlas-react-prototype.zip` during this session): after extraction, this `AGENTS.md` and the MCP configs inside it are new and will not take effect until the agent is restarted. Before doing anything else, write any pending or not-yet-executed user requests verbatim into **`INITIAL_TASK.md`** in the project root, then end your reply with exactly: *The template has been extracted. Please restart the agent so the new MCP configuration and rules take effect — your task has been saved to `INITIAL_TASK.md` and will be picked up automatically.*

---

## Ensure correct MCP setup (do not skip or reorder)

1. Before **any** new prototype UI (screens, routes, Atlas/MUI composition, or new design-system imports), complete **Steps A–C** and comply with every applicable rule below; do not skip because the user said "build X".
2. **Step A — Probe:** Invoke a **real** Atlas MCP tool (e.g. **`get_atlas_components`**). **ToolSearch** / discovery returning **no** Atlas tools = **probe failed**, not "MCP unavailable in this client."
3. **Step B — Probe failed:** Stop Atlas-dependent UI and guide the user through MCP setup:
   - **Claude Desktop (macOS):** Highlight **`setup-claude-desktop-atlas-mcp.command`** in Finder with `open -R ./setup-claude-desktop-atlas-mcp.command`, then ask user to double-click it. Alternative: `sh scripts/setup-claude-desktop-atlas-mcp.sh`. After wizard completes, user must **quit and reopen Claude Desktop** for MCP to load.
   - **Cursor / VS Code:** User adds **`Authorization: Bearer <atlas_sk_…>`** token from Confluence into their local `.cursor/mcp.json` or `.vscode/mcp.json`, enables Atlas server, then reloads MCP.
   - **Token source:** User gets token from **[Confluence Atlas MCP docs](https://diligentbrands.atlassian.net/wiki/spaces/ATLAS/pages/5813207384/Using+the+Atlas+MCP+server)** (Diligent SSO required). Valid tokens start with `atlas_sk_`. Never invent, commit, or share tokens. No need to mention this initially as the config wizard will do so.
   - After setup completes, re-probe from **Step A**—do **not** proceed until Step A succeeds.
4. **Step C — Gate:** Only after **Step A** succeeds may you ship UI that depends on Atlas **names**, **docs**, **tokens**, or **icons**.
5. **`does not provide an export named …`** on **`@diligentcorp/atlas-react-bundle`** → almost always **wrong import** (e.g. MUI from bundle): move primitives to **`@mui/material``, fix Atlas names via MCP—**not** an MCP auth problem.
6. **`does not provide an export named 'Grid2'`** → this project uses **MUI v7**, which renamed `Grid2` to `Grid` and removed the old v1 `Grid` entirely. Always use **`import { Grid } from "@mui/material"`**; `Grid2` does not exist in v7.
7. MCP drops mid-task → **stop** design-system work and repeat **Steps A–C** until **Step A** passes.

---

## Fast prototyping

8. **Speed is not a waiver:** Going fast never means skipping **Steps A–C**, tool schemas, MCP-backed names, token verification, imports, or any other rule here—all rules apply regardless of time pressure.
9. **Pre-load context with grouped MCP calls** before writing code—one grouped call beats several individual lookups: **`get_atlas_top_icons`** (curated high-usage icon **names** in rank order — best first call for most UIs); **`get_atlas_components_by_group`** with a **`level`** (`atomic` | `complex` | `pattern`) or a **`category`** (valid values in tool schema) to fetch a targeted component subset in one shot; **`get_atlas_tokens_by_group`** with `spacing` | `color` | `typography` | `shadow` | `breakpoints` to front-load an entire token category; **`atlas_icons`** resource (`atlas://icons`) for the full icon catalog when needed. For targeted follow-up lookups: **`get_atlas_component_docs`**, **`search_atlas_tokens_by_path`**, **`search_atlas_tokens_by_value`**.

---

## Prototyping flexibility

10. **Scope components by complexity:** Atlas MCP can give you exactly the right slice of the design system—use **`get_atlas_components_by_group`** with **`level: atomic`** for basic building blocks, **`level: complex`** for richer widgets, **`level: pattern`** for full layout patterns, or any **`category`** from the schema. Follow up with **`get_atlas_component_docs`** on only that subset. Match the level to the UI you are actually building.
11. **Custom styling — token hierarchy:** When Atlas components alone don't cover a layout need, follow this order: prefer **semantic tokens** first (e.g. `semantic.color.*`, `semantic.font.*` via `search_atlas_tokens_by_path` or `get_atlas_tokens_by_group`); fall back to **core tokens** when no semantic token fits (e.g. `core.spacing.*`, `core.shadow.*`); use raw hex, arbitrary px, or ad-hoc literals **only** if the user **explicitly** requests it—never as a default or speed shortcut.

---

## Imports and packages

12. MUI primitives (`Button`, `Box`, `Grid`, `Typography`, `TextField`, `Stack`, `Paper`, `Dialog`, …) from **`@mui/material`** or **`@mui/x-…`**, **never** from **`@diligentcorp/atlas-react-bundle`** root.
13. Atlas shell and Atlas-only components (**named** imports, set **release-dependent**—e.g. **`AtlasThemeProvider`**, **`AppLayout`**, **`Card`**, **`PageHeader`**, **`FilterToolbar`**, AI chat pieces) from **`@diligentcorp/atlas-react-bundle`**.
14. Icons: **default** import **`@diligentcorp/atlas-react-bundle/icons/[IconName]`** (no barrel).
15. Global nav: **`@diligentcorp/atlas-react-bundle/global-nav`**.
16. **`get_atlas_components`** / MCP docs for **exact** Atlas exports before importing—do not assume Atlas names equal MUI names.
17. No **`@diligentcorp/atlas-*`** workspace path imports unless the user explicitly keeps that layout.

---

## Stack and runtime

18. Themed **MUI + Atlas**; theme augmented in TypeScript.
19. **MUI X Pro** via **`<AppLayout>`** from the bundle—**do not remove** **`AppLayout`**; **`useTheme()`** presets/tokens assume it.
20. Prefer **Atlas** when MCP shows a fit; keep prototypes small.
21. No **shadcn/ui**, **Tailwind**, or parallel UI stacks unless there is **no** reasonable Atlas/MUI path (e.g. some charts).

---

## Run and verify (after MCP gate)

22. The default home page shows a `<Placeholder>Hello, World!</Placeholder>` — replace it with the app's actual content, do not remove the `PageHeader` or `PageLayout` wrappers.
23. Start the **dev server**, open a **browser** on the **printed local URL**.
24. With **`chrome-devtools`** enabled in the client, prefer **Chrome DevTools MCP**: load that URL, check **console**, **failed network**, **Vite/React overlay**, obvious blank shell.
25. If DevTools MCP is off, run the same checks with whatever **browser automation** exists.
26. **`chrome-devtools`**: stdio **`npx`** + **`chrome-devtools-mcp`**, needs **Node 20+** and **Chrome**; **no** Atlas token—still enable **Atlas** MCP for design-system work.
27. **Building your app:** replace `<Placeholder>Hello, World!</Placeholder>` in `src/pages/IndexPage.tsx` with your actual content; keep **`PageHeader`** / **`PageLayout`** wrappers in place.

---

## Atlas MCP usage (connected)

28. Lists, docs, **token paths**, and **icon names** from **MCP**, not memory—an Atlas name in MCP does **not** allow importing MUI primitives from the bundle.
29. First tool use in a session: read the **tool schema** (wrong args → **`Input validation error`**).
30. Before **`sx`** / **`useTheme()`** token paths: **`search_atlas_tokens_by_path`** (or current equivalent)—**never invent** paths.
31. Confirm icon names via MCP or **`node_modules/@diligentcorp/atlas-react-bundle/dist/icons/`**.
32. Selection order: Atlas default → Atlas variants → Atlas + **`sx`** + tokens → plain MUI **only** if MCP shows **no** Atlas option—do **not** skip MCP for that choice.
33. **Read docs before coding — every Atlas component, every time it first appears:** call **`get_atlas_component_docs`** for that component, then **read the full output before writing a single line of code**. If the MCP response was persisted to a file (Claude Code saves large responses as files), use the **Read tool** on that file — calling the MCP tool is not the same as reading the docs. Relying on general MUI knowledge as a substitute is not permitted. Atlas-specific variants, presets, token usage, and import paths are only in those docs.
34. **MUI components with no Atlas MCP coverage:** before writing code, call the **MUI MCP** (e.g. `mcp__mui__*`) to retrieve the official v7 API for that component — do not rely on training-data knowledge of MUI APIs, which may be stale or version-mismatched.
35. **Pre-submit component checklist** — before finalising any component, verify each of these Atlas-specific patterns: (a) **Status/state display** → did you use `StatusIndicator`, not `Chip`? Ask "can the user remove this label?" — No = `StatusIndicator`, Yes = `Chip`. (b) **Grid layout** → did you use `size={{}}` props, not the v5 `item`/`xs`/`md`/`lg` props? (c) **Form fields** → did you use `slotProps`, not the deprecated `InputProps`? Fix any violation before moving to the next component.

---

## Code quality

36. One primary export per file; group by **feature/page**; avoid one giant **`src/components/`**; **`App.tsx`** = routes + **`AppLayout`** only.
37. Domain-specific names (`MeetingAgendaCard`); avoid **`Card2`**, vague **`Section`/`Content`/`Item`/`Data`**; filename = default export; meaningful **`id`** on **`Box`** for DevTools (except list items).
38. Mock data in **`src/data/*.json`**; realistic **B2B** strings, not lorem.

---

## Styling and layout

39. **`sx`** for routine UI; **`useTheme()`** + **MCP-verified** token paths — never invent token paths, always verify via MCP first. Token shape example: `<Typography sx={({ tokens }) => ({ color: tokens.semantic.color.type.muted.value })}>…</Typography>`.
40. **`Container`** / **`PageLayout`** for width/center; compose with **`Stack`** / **`Box`**.
41. **`GridLegacy`**: **sm 4**, **md+lg 8**, **xl 12**; page grid **`presets.GridPresets.page`** from **`useTheme()`**.

---

## Copy

42. **Enterprise B2B** voice; **`AppLayout`** org name/logo match the story.
43. **Microsoft-style:** sentence case, active **you/we**, concise, action-oriented controls, a11y + i18n aware; no blame, jargon walls, or culture-specific jokes.

---

## Deployment (VibeSharing / Vercel)

44. This repo is wired for **git-push deploy** (Vercel auto-builds Vite). To ship changes: `git add`, `git commit`, `git push origin main`. Do **not** use the Vercel CLI, zip upload, or deploy APIs—only push to the remote. If you cannot push (e.g. sandbox), leave a clean commit for the user to push.

---

## Dependency

45. **Never** commit real **`atlas_sk_`**, fabricate secrets, or paste live tokens in git/chat—advise **rotation** if leaked.
46. **`package.json`** installs the bundle over **https**; lockfiles may drift; the bundle is **not** a full MUI mirror (see imports). Lockfiles are **gitignored**—use forced install methods freely (`npm install --force` / `pnpm install --no-frozen-lockfile`) when integrity errors occur; no need to ask permission.
