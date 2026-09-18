# Kalashi assets

Artist imagery and release details were sourced from the artist's [official Spotify profile](https://open.spotify.com/artist/6DIbARWmXOeQr5vo23NZFC) on September 15, 2026. Images are artist/release artwork, not generated portraits. Ownership remains with the respective rights holders.

| Local asset | Source |
| --- | --- |
| `music/portrait.jpg` | https://i.scdn.co/image/ab6761610000e5ebc24d12c3096c8ce8edb5dfd7 |
| `music/come-thru.jpg` | https://i.scdn.co/image/ab67616d0000b2736b77e45239f92c8501ecbaff |
| `music/missery.jpg` | https://i.scdn.co/image/ab67616d0000b273de521dd3aaa065eec331fa62 |
| `music/passenger-princess.jpg` | https://i.scdn.co/image/ab67616d0000b273e05e6e4489cb9dc3a51cbe97 |

The web copies live in `public/media/music/`. Keep both copies in sync when replacing artwork.

Anton and Space Grotesk come from [Google Fonts](https://github.com/google/fonts/tree/main/ofl). Their SIL Open Font License files are included in `fonts/`. Fonts are bundled locally for web and native; no runtime font CDN is required.

The official mark combines the original K letterform with a static audio orbit, using the site's lime (`#b1f750`), red (`#e84939`), and charcoal (`#090a09`) palette. The K paths remain unchanged.

- `brand/orbit-mark.svg` is the transparent vector master, matching the reusable web `OrbitBrandMark` component in `src/components/Icons.web.tsx`. The centered K is scaled to 2.8× its original 40-unit drawing, with the inner orbit rings spaced to clear its corners.
- `brand/icon.svg` uses the same transparent orbit mark; `brand/icon.png` is its transparent 1024×1024 raster export used by the Expo app icon and splash configuration. The operating system applies its own app-icon corner mask.
- `public/favicon.svg` is the small-size variant, with the same enlarged K and fewer, heavier orbit rays so it remains legible in browser tabs. `public/favicon.png` is its transparent 64×64 raster export, used by Expo to generate the browser favicon.

Raster exports are rendered directly from their corresponding SVG masters. Keep the matching SVG, PNG, and React vector paths in sync when updating the mark. The animated header uses the same original K with a live audio orbit.
