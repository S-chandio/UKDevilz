# UkDevilz Website

Next.js website for saving media from supported public links. The canonical domain is **https://ukdevliz.co.uk**. The homepage heading is **UkDevilz Your Free Online Downloader**.

## Project Status

The site has 15 public pages: the homepage, 11 download tools, Contact, Privacy and Terms. Content uses British English and follows the owner's writing SOP while retaining the page designs.

Tool copy describes the intended features. Backend repairs are separate work; copy does not verify that every source or format currently works. Check completed downloads before release. Privacy and Terms remain drafts awaiting real operator, jurisdiction, provider and retention details.

Historical deployment notes are excluded from this review package because they contain private configuration. Use the package's START_HERE.txt for setup and REVIEW_REPORT.txt for the current checks.

## Local Setup

Requirements:

- Node.js 22.19 or later and npm. The installed Undici package requires this minimum, which is higher than Next.js's own minimum.
- A separately configured Cobalt service for media retrieval.
- `yt-dlp` for the YouTube fallback, on PATH or configured through `YTDLP_PATH`.
- FFmpeg, supplied by the installed `ffmpeg-static` package for audio conversion and merging.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. Copy `.env.example` to `.env.local` and configure the server environment. Pages can render without a working retrieval service; downloads need that service and its dependencies. The example contains no credentials and is allowed through `.gitignore`.

### Server Environment

| Variable | Purpose | Default |
| --- | --- | --- |
| `COBALT_URL` | Direct Cobalt service | `http://127.0.0.1:9000` |
| `COBALT_PROXY_URL` | Optional second Cobalt instance | Unset |
| `YTDLP_PATH` | yt-dlp executable name or path | `yt-dlp` |
| `YTDLP_COOKIES` | Optional cookie file path, resolved from the site directory if relative | Unset |
| `YTDLP_PROXY` | Optional comma separated proxy URLs | Unset |
| `PORT` | Listening port | Next CLI default, or `3100` in `server.js` |

Keep credentials and cookie files outside public assets and source control. Never prefix these server settings with `NEXT_PUBLIC_`. `.gitignore` already excludes environment files. Cobalt has its own environment and dependencies; this project does not start or configure it.

## Build And Deployment

```sh
npm run build
npm start
npm run lint
```

`npm start` serves the production build. The existing `server.js` supports Plesk/Phusion Passenger, starts Next in production mode and binds to loopback on the supplied port. Check the hosting configuration before choosing a startup method.

This application needs a Node server. Its API routes and streaming downloads cannot run as a static HTML export. Configure HTTPS and the canonical hostname at the hosting layer. Proxy timeouts and buffering must suit streaming responses. Domain configuration in the source does not configure DNS, certificates or redirects.

After changes, build the site and check desktop and mobile layouts. Test MP3, silent video, resolution options, carousel downloads and browser saving with permitted public sources. Inspect completed files as well as previews and HTTP responses.

## Source Map

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Homepage hero and sections |
| `app/*-downloader/page.tsx` | Tool page content and layouts |
| `app/contact`, `app/privacy`, `app/terms` | Contact and policy pages |
| `app/grab.tsx` | Shared input, result and download controls |
| `app/api/resolve` | Link normalisation and retrieval |
| `app/api/download` | Media streaming |
| `app/api/audio` | MP3 conversion |
| `app/api/merge` | Joining video and audio streams |
| `lib/cobalt.ts`, `lib/ytdlp.ts` | Retrieval integrations |
| `lib/site.ts` | Site identifier, canonical domain and services |
| `lib/page-seo.ts` | Titles, descriptions, canonicals and editorial focus keywords |
| `lib/platforms.ts` | Homepage platform cards |
| `lib/faq.ts` | Shared homepage answers |
| `components/platform-guidance-data.ts` | Platform guides and FAQs |
| `app/globals.css`, page CSS files | Design and responsive styles |
| `public/images` | Illustrations and guide screenshots |

## Sitemap And Robots

Next generates the public files from these source routes:

| Public URL | Source | Content |
| --- | --- | --- |
| `https://ukdevliz.co.uk/sitemap.xml` | `app/sitemap.ts` | All 15 canonical page URLs from `PAGE_SEO` |
| `https://ukdevliz.co.uk/robots.txt` | `app/robots.ts` | Allows crawling, including `/api/`, and links to the sitemap |

The standard filename is `robots.txt`, with an **s**. Do not create competing copies in `public` while these routes exist.

The sitemap and page canonicals share `SITE.domain`. Add new public page entries to `PAGE_SEO` and use `pageMetadata` in their routes. Only include pages intended for publication. No modification dates are invented; add `lastModified` only when reliable content update dates are available.

Robots rules guide compliant crawlers but do not enforce access control or protect secrets. These rules are for production. Protect staging separately through hosting access controls. After deployment, verify both endpoints on the real domain and submit the sitemap through the site's search engine webmaster accounts.

The owner requested that `/api/` remain allowed. API routes are not included in the sitemap because they are processing endpoints rather than content pages. Crawl rules do not determine whether visitors can submit requests or download files.

## Social Sharing And Recovery Pages

`pageMetadata` supplies Open Graph and X card titles, descriptions, canonical sharing URLs and a shared image for all 15 pages. The locale is `en_GB`, and the card format is `summary_large_image`. No unconfirmed social account handle is included.

`app/opengraph-image.tsx` generates a 1200 by 630 PNG at `/opengraph-image` using the existing mascot, site colours and configured domain. It is generated during the build. Update this source when the brand or sharing message changes.

`app/not-found.tsx` supplies the custom 404 page and noindex metadata. `app/error.tsx` catches page rendering errors and provides a Try Again control using this Next.js version's `retry` callback. Both use `components/RecoveryPanel.tsx` and retain the surrounding site layout. The error boundary does not replace errors from the root layout itself or the API's JSON responses.

## Content Maintenance

- Preserve approved structure and design when editing copy.
- Use British English, plain headings and varied wording without keyword stuffing.
- Keep claims aligned with supported sources. Expired Snapchat stories cannot be retrieved; source quality limits output resolution.
- Distinguish media storage from technical logs and email retention.
- Describe meaningful images accurately. Keep empty alt attributes for decorative images.
- Refresh guide screenshots when their visible controls or copy change.
- Count title and description lengths. Focus keywords are editorial fields, not HTML keyword tags.
- Keep runtime errors useful; an actual failed request must not display a success message.

## Remaining Launch Items

Still required before publication:

- Completed operator, provider, retention and jurisdiction details for Privacy and Terms.
- Successful end-to-end downloads for representative links from every advertised platform. The 16 October 2026 review found failures for the Snapchat, Instagram, SoundCloud, Bilibili and VK samples; sample age, access restrictions and upstream availability can affect these results.

The 16 October 2026 review passed the production build, TypeScript check, ESLint, all 15 page responses, desktop/mobile overflow checks and local media stream/conversion/merge checks. Live checks for six other platforms received initial media bytes; these were not complete-download or format-matrix tests. See the submission's `REVIEW_REPORT.txt` for the evidence and limitations.

Icons already exist at `app/icon.png` and `app/apple-icon.png`. A web app manifest is optional if browser installation is wanted. Search Console verification can use DNS, so it does not always require another site file.
