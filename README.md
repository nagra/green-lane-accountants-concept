# Green Lane Accountants: website redesign concept

An **unofficial, speculative design concept** for [Green Lane Accountants](https://www.greenlaneaccountants.co.uk/), an accountancy practice at 79 Green Lane Road, Leicester. It is a working five-page website that shows how the practice's presentation, service information and enquiry flow could be improved.

**Preview:** https://nagra.github.io/green-lane-accountants-concept/

This is not the official Green Lane Accountants website. Every page carries a visible preview banner and `noindex, nofollow`. The enquiry form is a demonstration: it does not send, store or email anything.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/services/` | All six services: accountancy, taxation, bookkeeping, payroll, VAT, company secretarial |
| `/services/business-accounts/` | Business accounts: a focused service page |
| `/about-us/` | About (keeps the existing site's route) |
| `/contacts/` | Contact details and the demonstration enquiry form (keeps the existing site's route) |

## Preview locally

Requires Node.js 20.12 or later. There are no dependencies to install.

```sh
npm start            # build, run checks, then serve at http://localhost:4173/
```

Or step by step:

```sh
npm run build        # writes static HTML to dist/
npm run check        # verifies links, metadata, preview safeguards, form labels and copy rules
npm run preview      # serves dist/ at http://localhost:4173/ (PORT=xxxx to change)
```

`dist/` is plain static HTML, CSS and JavaScript, so it can be hosted anywhere. Pages use relative links and work from any sub-path.

## Project structure

```
src/
  site.json            Business details and the preview switch, in one place
  layout.mjs           Shared page shell: head, preview banner, header, footer
  pages/               One HTML file per page; metadata is a JSON comment at the top
  assets/css/site.css  All styles
  assets/js/site.js    Mobile menu and the demonstration form (no network requests)
  assets/fonts/        Fraunces and Public Sans, self-hosted (SIL Open Font Licence)
scripts/
  build.mjs            Builds dist/
  check.mjs            Post-build checks; exits non-zero on any problem
  serve.mjs            Local preview server
docs/
  design-notes.md      Design choices
  client-approval.md   Facts, wording and assets that need the client's approval
  launch-checklist.md  What must happen before this could replace the live site
```

Pages use `{{token}}` placeholders for business details from `src/site.json` (for example `{{phone}}` and `{{email}}`), so contact details are defined once.

## Deployment

Pushing to `main` runs `.github/workflows/pages.yml`, which builds the site, runs `npm run check`, and publishes `dist/` to GitHub Pages.

## Preview safeguards

- A visible banner on every page: "Unofficial design concept — preview only."
- `<meta name="robots" content="noindex, nofollow">` on every page, and no canonical URLs, sitemap or structured data.
- No analytics, tracking, cookies, embedded maps, web fonts from third parties or other third-party resources.
- The enquiry form uses `method="dialog"` and has no `action`, so it cannot submit anywhere, even without JavaScript.
- `npm run check` fails the build if any of these safeguards are missing.

Setting `"preview": false` in `src/site.json` removes the banner and `noindex`, and adds canonical URLs, `sitemap.xml` and `robots.txt`. The check deliberately fails while the demonstration form is still present. See [docs/launch-checklist.md](docs/launch-checklist.md) before doing this.
