# Kalashi frontend readiness

## Scope

Branch: `feat/kalashi-frontend-readiness`, based on main `d525f68`.
Source-only changes, no production deployment, cloud provisioning, credentials, sign-in, billing, ads or database connections. Tests, builds, lint, type checks and browser/native validation were not run, per AGENTS.md. The user should review and validate before merging.

## Pages

- `/sign-in`, `/sign-up`, `/forgot-password`: disabled credential controls, Google identity, reciprocal navigation, no credential capture or fake success.
- `/profile`: themed avatar placeholder, local display-name/bio editing; disabled real identity/email/avatar editing, guest/account status, local library count, settings links.
- `/library`: existing catalog only, search, album/single/favorite filtering, local favorites and removal, external Spotify opening and user-initiated public release sharing. Albums do not fabricate track listings.
- `/collections`: browser-local create/rename/delete lists and toggle existing release membership; online sharing remains disconnected with no fake private links.
- `/settings`: local data disclosure, explicit confirmation before clearing favorites or local collections/display profile, unavailable real account deletion.
- `/connections`: disconnected identity and service status, no key entry.
- `/dashboard`, `/analytics`, `/users`, `/feedback`, `/features`: locked account boundary, with an explicit `/preview/dashboard` design-preview link. The preview contains Overview, Analytics, Releases, Users, Feedback, Features and Health tabs. No real records, role grant, metric data or administration operations exist.
- `/about`, `/contact`, `/support`, `/privacy`, `/terms`: original factual help/artist content and pre-launch policy disclosures. Policy drafts are not claimed to be reviewed legal documents.

## Design sources

Preserved the existing Anton/SpaceGrotesk typography and black/green/red palette, public artist/release content, Spotify player and sound laboratory. Browser navigation collapse state is saved separately in guest-local storage, with visible session-only fallback on errors. The collapsed control remains accessible on mobile. The account shell follows the Domains-Database profile/metadata and account-navigation patterns, translated to React Native for both web and native.
Reference: Domains-Database `c08500922be6a78a305e9e00d71195c3d1b2e6a1`, Admin layout reference and ProfileSkeleton source. The generic `AGENTS.md` and complete licensed `ai/` pack came from BengaliBlush `7c26b2427ae7abeba3068a31661f4c18fbb20086` with the shared disconnected-account-frontend additions. Requested `reverse-engineer-anything` skill source was unavailable; ordinary source inspection was used, not a claimed skill invocation.

## Local data boundaries

Browser favorites store only the known public release URLs in `kalashi:favorites:v1`. They do not upload data, save to Spotify, identify a user, or sync. Invalid stored entries are ignored. Storage errors surface as session-only notices. `kalashi:local-workspace:v1` stores up to 100 local collections (80-character titles, known catalog membership) and optional display name/bio (80/500 characters). Input is bounded and rendered as text. Corrupt/invalid stored records are ignored; storage exceptions surface session-only notices. No email, password or trusted role is stored. Native uses in-memory favorites/lists/profile until a separately approved persistence adapter exists. Clearing browser storage can lose the library. Shared public release links contain no private favorite data. Future import into an account must be explicit, not silent.

## Future backend contract

The unconnected types in `src/shared/account/contract.ts` describe identity and scoped subscriptions. Implement Firebase in a separate adapter only after setup is approved:

1. Confirm isolated Firebase project, billing, region and app identity. Never reuse reference-project credentials.
2. Enable Google and email/password providers, authorized domains, email verification and reset flows. Create owner privilege through trusted server administration, never matching a client email or local state.
3. Model private user profile/favorites/collections, public verified artist catalog, and owner-only reporting. Use app-owned document IDs and named external Spotify IDs as required by shared guidance. Allocate sequence IDs atomically server-side; avoid client counters.
4. Enforce identity/ownership/schema validation with Firestore rules and trusted server role checks. Catalog writes require owner rights. Shared collections need explicit visibility, revocation and audience policy, not just a guessed URL.
5. Attach scoped realtime listeners only after verified sign-in. Unsubscribe and clear prior account data on user change/logout; handle loading/errors/offline and explicit local-library import.
6. Restrict avatar type/size, Storage owner paths and abuse limits. Implement deletion/export across Auth, profile, favorites, collections and media with required confirmation.
7. Add owner-authenticated server reporting endpoints for Vercel data; never ship provider tokens to the client. Empty charts are unavailable, not zero traffic. The pre-existing public-home Analytics collector is retained; newly added account/preview pages do not mount it.

## Launch gates

Review operator identity/contact, music/artwork rights and final privacy/terms disclosures. Confirm actual canonical origin before emitting absolute sitemap/canonical URLs; no owned domain is assumed connected. Account/library/admin/preview pages are noindex; robots directives are not authorization. These routes are public disconnected layouts, not secured live accounts. The actual owner page remains locked and its explicit layout preview contains no private data.

For app stores: native build/device QA, icon/splash, identifier/signing, music licensing, platform sign-in requirements, privacy declarations and working account deletion (when accounts launch) remain unverified. For AdSense: useful original public content, reviewed policy/contact pages, consent and rights review, custom-domain verification and actual approval are separate work. No monetization eligibility or approval is implied by this branch.
