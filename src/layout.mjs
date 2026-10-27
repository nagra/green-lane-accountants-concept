// Shared page shell: <head>, preview banner, header, navigation and footer.

export const escapeHtml = (value) =>
  String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);

// Inline SVG snippets, available to pages as {{svg:name}}. All are decorative.
export const svg = {
  arrow:
    '<svg class="icon icon--arrow" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3.5 10h12.5M11 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  external:
    '<svg class="icon icon--external" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M8.5 4H5a1.5 1.5 0 0 0-1.5 1.5v9.5A1.5 1.5 0 0 0 5 16.5h9.5A1.5 1.5 0 0 0 16 15v-3.5M11.5 3.5h5v5M16.5 3.5 9 11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  phone:
    '<svg class="icon icon--phone" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M6.2 2.8H4.4a1.6 1.6 0 0 0-1.6 1.8 13.6 13.6 0 0 0 12.6 12.6 1.6 1.6 0 0 0 1.8-1.6v-1.8l-3.4-1.4-1.6 1.7a10.4 10.4 0 0 1-4.9-4.9l1.7-1.6Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  lane:
    '<svg class="lane-art" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><g class="lane-art__fields" stroke-width="1"><path d="M40 122 18 -8"/><path d="M84 150 34 214"/><path d="M128 170 156 72 252 92"/><path d="M156 72 210 -8"/><path d="M258 180 238 214"/><path d="M296 158 252 92 274 -6"/><path d="M352 118 414 214"/><path d="M390 92 368 26 396 -8"/><path d="M368 26 292 14"/><path d="M462 66 500 140 460 214"/><path d="M500 140 690 168 716 214"/><path d="M540 52 572 -8"/><path d="M650 50 674 -8"/><path d="M690 168 812 152"/><path d="M712 62 760 126 812 122"/></g><g class="lane-art__hedge" stroke-width="3" stroke-dasharray="0 8"><path d="M252 92 274 -6"/><path d="M500 140 460 214"/><path d="M414 214 352 118"/><path d="M156 72 210 -8"/><path d="M712 62 760 126"/></g><path class="lane-art__edge" d="M-12 112C60 118 110 186 188 186S310 160 350 120 422 62 474 60 552 40 612 42 740 70 812 62" stroke-width="15"/><path class="lane-art__road" d="M-12 112C60 118 110 186 188 186S310 160 350 120 422 62 474 60 552 40 612 42 740 70 812 62" stroke-width="12"/></g></svg>',
};

const navItems = [
  { key: 'home', label: 'Home', href: '' },
  { key: 'services', label: 'Services', href: 'services/' },
  { key: 'business-accounts', label: 'Business accounts', href: 'services/business-accounts/' },
  { key: 'about', label: 'About', href: 'about-us/' },
  { key: 'contact', label: 'Contact', href: 'contacts/' },
];

const serviceLinks = [
  ['accountancy', 'Accountancy'],
  ['taxation', 'Taxation'],
  ['bookkeeping', 'Bookkeeping'],
  ['payroll', 'Payroll'],
  ['vat', 'VAT'],
  ['company-secretarial', 'Company secretarial'],
];

export function renderPage({ site, meta, body, root, assets, urlPath }) {
  const e = escapeHtml;
  const title = site.preview ? `Preview: ${meta.title}` : meta.title;
  const robots = site.preview ? '\n  <meta name="robots" content="noindex, nofollow">' : '';
  const canonical =
    !site.preview && meta.canonical !== false ? `\n  <link rel="canonical" href="${e(site.productionUrl + urlPath)}">` : '';
  const current = (key) => (key === meta.nav ? ' aria-current="page"' : '');

  const nav = navItems
    .map((item) => `<li><a href="${root}${item.href}"${current(item.key)}>${item.label}</a></li>`)
    .join('\n          ');

  const banner = site.preview
    ? `
  <aside class="preview-banner" aria-label="Preview notice">
    <p><strong>Unofficial design concept — preview only.</strong> <span>This is not the official ${e(site.name)} website.</span></p>
  </aside>`
    : '';

  const footerNote = site.preview
    ? `<p>Unofficial design concept prepared for review by ${e(site.name)}. This is not the official website, and the enquiry form does not send any information.</p>`
    : `<p>&copy; ${new Date().getFullYear()} ${e(site.name)}</p>`;

  return `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(title)}</title>
  <meta name="description" content="${e(meta.description)}">${robots}${canonical}
  <meta name="theme-color" content="#1c3a2a">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_GB">
  <meta property="og:title" content="${e(title)}">
  <meta property="og:description" content="${e(meta.description)}">
  <link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="${root}assets/fonts/fraunces-latin-opsz-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${root}assets/fonts/public-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${root}${assets.css}">
  <script>document.documentElement.classList.add('js')</script>
  <script src="${root}${assets.js}" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to main content</a>${banner}
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="wordmark" href="${root}" aria-label="${e(site.name)}, home">
        <span class="wordmark__name">Green Lane</span>
        <span class="wordmark__descriptor">Accountants</span>
      </a>
      <a class="header-call" href="${e(site.phoneHref)}">${svg.phone}<span class="visually-hidden">Call ${e(site.phone)}</span></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <span class="nav-toggle__icon" aria-hidden="true"></span>
        <span class="nav-toggle__label">Menu</span>
      </button>
      <nav class="site-nav" id="site-nav" aria-label="Main">
        <ul class="site-nav__list">
          ${nav}
        </ul>
        <div class="site-nav__contact">
          <a class="site-nav__phone" href="${e(site.phoneHref)}">${svg.phone}<span>${e(site.phone)}</span></a>
          <a class="site-nav__email email" href="mailto:${e(site.email)}">${e(site.email)}</a>
        </div>
      </nav>
    </div>
  </header>

  <main id="main" tabindex="-1">
${body.trim()}
  </main>

  <footer class="site-footer on-dark">
    <div class="container">
      <div class="site-footer__grid">
        <div class="site-footer__brand">
          <a class="wordmark" href="${root}" aria-label="${e(site.name)}, home">
            <span class="wordmark__name">Green Lane</span>
            <span class="wordmark__descriptor">Accountants</span>
          </a>
          <p>Accountancy, taxation, bookkeeping, payroll, VAT and company secretarial support from our practice in Leicester.</p>
        </div>
        <nav class="site-footer__col" aria-label="Footer">
          <h2 class="footer-heading">Pages</h2>
          <ul class="footer-list">
            ${navItems.map((item) => `<li><a href="${root}${item.href}">${item.key === 'home' ? 'Home' : item.label}</a></li>`).join('\n            ')}
          </ul>
        </nav>
        <div class="site-footer__col">
          <h2 class="footer-heading">Services</h2>
          <ul class="footer-list">
            ${serviceLinks.map(([id, label]) => `<li><a href="${root}services/#${id}">${label}</a></li>`).join('\n            ')}
          </ul>
        </div>
        <div class="site-footer__col">
          <h2 class="footer-heading">Contact</h2>
          <address>${e(site.streetAddress)}<br>${e(site.locality)}<br>${e(site.postcode)}</address>
          <ul class="footer-list footer-list--contact">
            <li><a href="${e(site.phoneHref)}">${e(site.phone)}</a></li>
            <li><a class="email" href="mailto:${e(site.email)}">${e(site.email)}</a></li>
            <li><a href="${e(site.mapUrl)}" rel="noopener noreferrer">View on Google Maps${svg.external}<span class="visually-hidden"> (external site)</span></a></li>
          </ul>
        </div>
      </div>
      <div class="site-footer__base">
        ${footerNote}
      </div>
    </div>
  </footer>
</body>
</html>
`;
}
