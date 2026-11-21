---
name: no-invented-code
description: Use ONLY when working in this repo to prevent invented code, guessed APIs/paths, or unverified claims. Trigger on code changes, bug fixes, UI/layout work, Wix/API work, or when the user asks for proof/screenshots.
---

# No Invented Code

## Rules

- **Read before write.** Never edit code you haven't read in this session. Inspect the real files, types, and call sites first.
- **No guessing.** Do not invent URLs, file paths, API endpoints, request bodies, field names, CSS classes, or library behavior. Confirm from code, docs/skills, or tool output.
- **Smallest real fix.** Change only what the issue requires; follow existing patterns and conventions.
- **Verify, don't claim.** After edits run the relevant check (`npx astro check` for Astro/TS; tests when logic changes). Report actual results.
- **UI proof required.** For any visual/layout change: start dev server (`npm run dev:fg`), capture focused screenshots in `.screenshots/`, verify browser console has no errors/warnings caused by the change, then stop the dev server. Never report screenshots you didn't just verify.
- **Runtime honesty.** If dev server/build fails or screenshot is blank/broken, say so and fix or report the blocker; do not present it as success.
- **Wix/API work.** Use installed Wix skills/docs and real schemas; never fabricate Wix endpoints or payloads.
