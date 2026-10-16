# Open Eyes website

Static site for both apps (Android and iPhone), in English (root) and German (`de/`): landing page with an interactive editor demo, guide, FAQ, how photos
are labelled, privacy policy, GDPR data protection page, imprint, support and a 404 page. Plain HTML, one stylesheet
(`assets/site.css`) and one script (`assets/site.js`); no build step, no dependencies.

The site makes **no third-party requests**: system fonts, no analytics, no cookies, no embeds. The privacy and data
protection pages say so, so keep it that way (or update those pages).

## Languages

Every English page has a German twin with the same file name in `de/`. Change both when you change one; the
placeholders are the same in both. The demo wording lives in `demoStringsByLanguage` in `assets/site.js` and is
picked by `<html lang>`. The `hreflang` links are relative; switch them to absolute URLs once the domain is known.

## SEO, social sharing and LLM discovery

- Each page has a canonical URL, absolute `hreflang` links (en/de/x-default), a robots meta tag (the 404 is `noindex`),
  Open Graph and Twitter card tags with `assets/og-image.png` (1200 x 630), and JSON-LD:
  `MobileApplication` + `WebSite` on the home pages, `FAQPage` on the FAQ (copied from the visible answers), `HowTo` on
  the guide, `BreadcrumbList` everywhere. Index pages use the directory URL (`/`, `/de/`). Icons: `brand-icon.png`,
  `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`.
- `sitemap.xml` lists every page with `xhtml:link` language alternates. `robots.txt` allows all crawlers, AI crawlers
  named explicitly, and points to the sitemap.
- `llms.txt` (index) and `llms-full.txt` (plain text of the guide and FAQ) follow the llms.txt convention.
- When you change a page title, description, FAQ answer or guide step, update the matching JSON-LD and `llms-full.txt`
  too: structured data must match what is visible on the page. No ratings or reviews are declared because there are none.
- The Google Play / App Store links in the `MobileApplication` data should get `downloadUrl` / `sameAs` once live.

## Preview

```bash
python3 -m http.server 8765 --directory website
```

Then open http://localhost:8765.

## Before publishing

Every placeholder is a yellow-highlighted `<span class="todo">`. Find them with:

```bash
grep -rn 'class="todo"' website
```

- Owner name, postal address and support email (footer, privacy, data protection, imprint, support).
- Data protection: data protection officer (or remove), retention periods, hosting provider, transfers outside the
  EU, competent supervisory authority. Have the legal pages reviewed, then remove the "Draft" notes.
- Imprint: legal form, register, VAT ID, phone, person responsible for content, consumer dispute resolution
  statement. The imprint follows German law (§ 5 DDG, § 18 MStV); adjust for another country.
- Store buttons say "Coming soon": replace them with the Google Play and App Store links once the apps are live.
- **Domain:** every canonical, hreflang, Open Graph, structured-data, `robots.txt`, `sitemap.xml`, `llms.txt` and
  `llms-full.txt` URL uses `https://your-domain.example`. Replace it everywhere in one go (macOS sed; on GNU sed drop the `""`):
  `grep -rl your-domain.example website | xargs sed -i "" "s#https://your-domain.example#https://YOUR.REAL.DOMAIN#g"`.
  Social previews and canonicals need absolute URLs, so do this before the first deploy.
- If Content Credentials stay off on Android (no signing server), the certificate request sentences on the privacy
  and data protection pages can be removed.

## Hosting

Any static host works (GitHub Pages, Netlify, Cloudflare Pages, a plain web server). Serve `404.html` for missing
pages and make sure HTTPS is on. The Play Console and App Store Connect privacy policy URL is `/privacy.html`.
