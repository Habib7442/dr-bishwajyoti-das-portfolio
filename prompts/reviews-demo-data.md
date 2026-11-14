# Prompt: Demo reviews (development only)

## Goal
Let you see the Reviews carousel while `npm run dev` is running, without any invented review ever reaching a production build or the live site.

## Docs read / code inspected
`AGENTS.md` §4 (never invent reviews), your Step 7 spec ("No placeholder or fake reviews anywhere, in dev or production"), `data/reviews.ts` (`reviews`, `reviewSummary`, `reviewsState()`), `components/sections/Reviews.tsx`, `app/page.tsx`.

## Decisions (⚠️ = please check)
1. ⚠️ **This relaxes one line of your Step 7 spec** ("no fake reviews … in dev"). It's for development only, and on your request. Production stays exactly as it is now: hidden until real reviews or URLs exist.
2. **Separate file:** `data/reviews.demo.ts` with 5 demo reviews.
   - Names are clearly not real people: "Demo Patient A" … "Demo Patient E".
   - Text is plain, generic ENT-visit wording (no cure/"painless" claims, no specific results), so the layout looks realistic.
   - One review is long enough to show "Read more".
   - Tags cover Ear / Nose / Throat / Allergy / General.
   - Source "Other", date "Demo".
3. **Dev-only switch:** in `data/reviews.ts`, `displayReviews()` returns the real `reviews` if there are any. Otherwise it returns the demo list **only when** `process.env.NODE_ENV === "development"` **and** `NEXT_PUBLIC_DEMO_REVIEWS === "1"`.
   - `next build` always sets `NODE_ENV=production`, so the demos are dropped from production bundles.
   - Even if someone set the env var on Vercel, the production check blocks it.
   - Real reviews always win: once you paste real ones, the demos never show.
4. **Visible label:** while demos are shown, a rust banner sits above the cards: "Demo reviews — development preview only, not real patient reviews". Each card's "via" line reads "via Demo". You can't mistake them for real reviews in a screenshot.
5. **Turning it on:** add `NEXT_PUBLIC_DEMO_REVIEWS=1` to a new `.env.local`. That file is already git-ignored by Next's default `.gitignore` (`.env*`), so I'll check that. Then restart `npm run dev`. To turn it off, delete the line.
6. **Commit or not:** `data/reviews.demo.ts` and the switch can be committed safely (they can't render in production). Say if you'd rather keep the demo file uncommitted too.

## Files likely to change
- `data/reviews.demo.ts`: new.
- `data/reviews.ts`: `displayReviews()`, `isDemoReviews()`; `reviewsState()` uses `displayReviews()`.
- `components/sections/Reviews.tsx`: read from `displayReviews()`; demo banner.
- `.env.local`: new (local only).

## Acceptance criteria
- [ ] `npm run dev` with the env var: the full carousel shows the 5 demo reviews under the demo banner; "Reviews" is in the nav.
- [ ] `npm run build && next start` (env var still set): no Reviews section, no "Reviews" nav link, and no "Demo Patient" text in the built HTML or JS (`grep -r "Demo Patient" .next/server .next/static` → nothing).
- [ ] `tsc`, `lint`, `build` pass.

## Manual test
1. Create `.env.local` with `NEXT_PUBLIC_DEMO_REVIEWS=1` (I'll do this), restart `npm run dev`, and open `http://localhost:3000/#reviews`.
2. Delete that line and restart: the section disappears again.
