# Production launch checklist

This concept is a preview. It must not replace or impersonate the official site until every item below is complete and Green Lane Accountants has approved it.

## 1. Content sign-off

- [ ] Every item in [client-approval.md](client-approval.md) confirmed, corrected or removed.
- [ ] Contact details in `src/site.json` confirmed (phone, email, address, map link).
- [ ] An authorised logo supplied, or the typographic wordmark and favicon approved.
- [ ] All page copy read and approved by the practice, including service descriptions and the Business accounts page.
- [ ] Copy reviewed for compliance with any professional body rules that apply to the practice. If the firm is regulated or a member of a professional body, add the disclosures that body requires.

## 2. Real enquiry form handling

The demonstration form must be replaced before launch. `npm run check` fails a production build while it is still present.

- [ ] Choose a form handler, for example a server-side endpoint run by the host or a reputable form-processing service. Prefer UK or EU data hosting, and sign a data processing agreement.
- [ ] Remove `method="dialog"`, `data-demo-form`, the demonstration notice and the demonstration result panel. Point the form at the real handler, using `POST` over HTTPS.
- [ ] Validate on the server as well as in the browser. Keep the accessible error summary and inline errors.
- [ ] Add spam protection that doesn't harm accessibility or privacy, such as a honeypot field, rate limiting or a privacy-friendly challenge. Avoid any CAPTCHA that sets tracking cookies.
- [ ] Deliver enquiries to a monitored inbox. Test delivery, spam filtering and failure handling, and show a clear message if sending fails, with the phone number as a fallback.
- [ ] Write an honest confirmation message, approved by the practice. Don't promise a response time unless the practice commits to one.
- [ ] Keep the advice not to include bank details or tax references. Collect no more data than needed.
- [ ] Decide how long enquiries are kept, and delete them from the handler or inbox on that schedule.
- [ ] Re-run keyboard, screen reader and mobile tests on the live form.

## 3. Privacy and legal

- [ ] **An approved privacy notice is published before the form goes live.** This concept deliberately does not include one. It must be written or approved by the practice. It should cover: the data controller (the practice's legal entity); what the enquiry form collects and why; the lawful basis; who processes the data (form handler, email host); retention; rights under UK GDPR and the Data Protection Act 2018; and how to complain to the ICO.
- [ ] Link the privacy notice from the form and the footer. Add a short line by the form, such as "We'll use your details to reply to your enquiry. See our privacy notice." Only add a consent checkbox if the lawful basis actually requires one.
- [ ] Confirm the practice's ICO registration (data protection fee) is current.
- [ ] Website terms approved and published, if wanted. The current site has them at `/terms/`.
- [ ] If the practice is a limited company or LLP: show the registered name, company number, place of registration and registered office address on the site, as the Companies Act trading disclosure rules require.
- [ ] Cookies: the concept sets none. If analytics or any other cookie or local storage is added later, get prior consent under PECR first. Use a consent tool that blocks scripts until the visitor opts in.

## 4. Remove preview mode

- [ ] Set `"preview": false` in `src/site.json`. This removes:
  - the "Unofficial design concept — preview only" banner, and the preview wording in the footer;
  - `<meta name="robots" content="noindex, nofollow">`;
  - the `Preview:` prefix on page titles.
- [ ] Add links to the privacy notice and terms in the footer (`src/layout.mjs`).
- [ ] Run `npm run build && npm run check`. The check confirms that no page still has the banner or `noindex`.
- [ ] Take down or restrict the GitHub Pages preview once the live site launches, so two versions don't compete.

## 5. Hosting and redirects

- [ ] Choose production hosting. Any static host works: the output is plain HTML, CSS and JavaScript. Turn on HTTPS, and pick one host (`www.` or the bare domain) with the other redirecting to it with a 301. The current site uses `https://www.greenlaneaccountants.co.uk`.
- [ ] Crawl the current site and check Search Console (if set up) for every indexed URL, then map each one with a 301 redirect. Known URLs:

| Current URL | New URL | Action |
| --- | --- | --- |
| `/` | `/` | Keep |
| `/about-us/` | `/about-us/` | Keep (route preserved) |
| `/contacts/` | `/contacts/` | Keep (route preserved) |
| `/privacy-policy/` | `/privacy-policy/` | Keep, with the approved notice |
| `/terms/` | `/terms/` | Keep, with approved terms, or 301 to `/` |
| — | `/services/` | New |
| — | `/services/business-accounts/` | New |
| Any other indexed URL (old pages, feeds, attachments) | Closest equivalent | 301, or let it return 404 if there is no equivalent |

- [ ] Serve the custom `404.html` with a real 404 status. Build with `BASE_PATH=/` at the root of the domain.
- [ ] Set sensible cache headers: long-lived for `/assets/` (the CSS and JS URLs carry a version hash), short for HTML.

## 6. Search setup

No rankings or traffic improvements are promised or implied.

- [ ] **Canonical URLs.** The production build adds `<link rel="canonical">` to each page using `productionUrl` in `src/site.json`:
  - `https://www.greenlaneaccountants.co.uk/`
  - `https://www.greenlaneaccountants.co.uk/services/`
  - `https://www.greenlaneaccountants.co.uk/services/business-accounts/`
  - `https://www.greenlaneaccountants.co.uk/about-us/`
  - `https://www.greenlaneaccountants.co.uk/contacts/`
- [ ] **Sitemap and robots.** The production build writes `sitemap.xml` (excluding the 404 page) and `robots.txt` pointing to it. Add the privacy and terms pages when they exist.
- [ ] **Titles and descriptions.** Each page has a unique title (60 characters or fewer) and meta description. This also fixes the old "Strathmere Accountants / Welwyn Garden City" title. Review them with the practice.
- [ ] **Structured data.** Add `AccountingService` JSON-LD to the homepage, using confirmed facts only. Draft:

```json
{
  "@context": "https://schema.org",
  "@type": "AccountingService",
  "name": "Green Lane Accountants",
  "url": "https://www.greenlaneaccountants.co.uk/",
  "telephone": "+44 116 220 0438",
  "email": "help@greenlaneaccountants.co.uk",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "79 Green Lane Road",
    "addressLocality": "Leicester",
    "addressRegion": "Leicestershire",
    "postalCode": "LE5 3TP",
    "addressCountry": "GB"
  },
  "areaServed": ["Leicester", "Leicestershire"]
}
```

  Add `openingHoursSpecification`, `logo`, `geo` and `sameAs` (social profiles) only once they are confirmed. Validate with the Schema.org validator and Google's Rich Results Test.
- [ ] **Google Search Console and Bing Webmaster Tools.** Verify the domain, submit the sitemap, watch coverage after launch, and fix crawl errors and redirect gaps.
- [ ] **Google Business Profile.** Make sure the name, address, phone number, website URL and hours match the site exactly.
- [ ] **Social previews.** Add an `og:image` (1200×630) and `og:url` if link previews matter.
- [ ] Don't create duplicate location pages. Mention Leicester naturally, as the concept does.

## 7. Final quality assurance

- [ ] `npm run build && npm run check` passes in production mode.
- [ ] Test in current Chrome, Safari (macOS and iOS), Firefox and Edge, at phone, tablet and desktop widths.
- [ ] Keyboard-only run through every page and the live form. Spot-check with a screen reader (VoiceOver or NVDA).
- [ ] Automated accessibility scan (for example axe or Lighthouse) shows no violations.
- [ ] Check every phone, email and map link on a real phone.
- [ ] Run Lighthouse or PageSpeed Insights for performance and fix any regressions. Don't publish or promise scores.
- [ ] Confirm that no analytics, tracking pixels, chat widgets or third-party embeds were added without consent and privacy review.
