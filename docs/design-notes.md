# Design notes

## Direction

The aim was a site that feels like an established local practice rather than a template: calm, editorial and confident, with the substance (services, who the firm helps, how to get in touch) doing the work rather than decoration.

The existing site was used as a factual reference only. The concept rewrites the copy from the verified service list and avoids every claim that has not been confirmed (see [client-approval.md](client-approval.md)).

## Palette

| Token | Hex | Use |
| --- | --- | --- |
| Forest | `#1c3a2a` | Headings, buttons, dark panels |
| Forest dark | `#12271c` | Footer |
| Ivory | `#f7f2e6` | Page background |
| Paper | `#fcfaf4` | Alternate sections, form fields |
| Sage pale | `#dfe6d5` | Alternate sections, form notice |
| Sage | `#a7b89d` | Decoration only (never text) |
| Sage ink | `#46594b` | Small labels |
| Charcoal | `#232724` | Body text, display headings |

All text colour pairs meet WCAG 2.2 AA, and most meet AAA:

| Pair | Contrast |
| --- | --- |
| Charcoal on ivory | 13.6:1 |
| Forest on ivory | 11.1:1 |
| Ivory on forest | 11.1:1 |
| Muted text `#4b524d` on ivory | 7.2:1 |
| Sage ink on ivory | 6.7:1 |
| Sage ink on sage pale | 5.9:1 |
| Muted light text `#c4cfbe` on forest | 7.7:1 |
| Error `#9e2a1f` on ivory | 6.7:1 |
| Form field border on paper (non-text) | 4.6:1 |

## Typography

- **Fraunces** (variable, with optical sizing) for headings. At large sizes it switches to its display cut, which gives the homepage headline a confident, editorial feel. Italic is used for the second half of key headings, for example *"Clear advice for your business."*, so each page has a clear typographic voice without imagery.
- **Public Sans** for body text, labels and the interface: plain, highly legible and slightly institutional, which suits an accountancy practice.
- Both are self-hosted (about 175 KB in total, with the two regular files preloaded) under the SIL Open Font Licence. No requests go to Google Fonts or any other third party.
- The body text is 17–18px, with line lengths kept to roughly 65–75 characters.

## Wordmark

No authorised logo was supplied, so the business name is set as a typographic wordmark: "Green Lane" in Fraunces semibold over "ACCOUNTANTS" in widely tracked Public Sans. The favicon is a simple lane mark on forest green. Both are placeholders until the client approves a logo.

## Original decoration

- **The double rule.** A double line appears above eyebrow labels, audience columns and at the foot of lists. It echoes the accountant's double underline beneath a final total: a quiet, relevant detail rather than generic ornament.
- **The lane drawing.** The homepage contact panel opens with an original SVG line drawing of a winding lane between field boundaries, a nod to the practice's name and its street. It is cropped rather than scaled, so line weights stay the same from phone to desktop.
- **The street plate.** The About page includes a CSS street-name plate for Green Lane Road. It is decorative (hidden from screen readers) and built from facts the practice already publishes.

There is no photography, no stock imagery, no invented dashboards or statistics, no carousels, no gradients and almost no animation (small hover nudges, disabled under `prefers-reduced-motion`).

## Layout

- **Homepage:** a large headline with both calls to action, and a prominent forest panel with the phone number, email and address beside it. Below that: a numbered, ledger-style service index (rows, not cards); who the firm helps; plain reasons to get in touch; three working principles; and a full-width contact band.
- **Services:** a jump menu, then one section per service. Each has a sticky heading column on desktop, a plain-English explanation, an "It may help if you…" list and a direct next step. Each "Ask about…" link preselects the topic in the enquiry form.
- **Business accounts:** what accounts are for, how the practice can help, what is worth discussing and what to have to hand, then an enquiry prompt. An "At a glance" summary sits beside the heading. It describes the service without promising specific deliverables.
- **About:** short, factual copy, the practice's principles and a contact prompt. There are no biographies, team photos or testimonials.
- **Contact:** contact details (sticky on desktop) beside the demonstration form, with the "nothing is sent" notice directly above the form and again by the button.

## Mobile is its own layout

- The header shows a tap-to-call button and a "Menu" button. The menu opens in place as large serif links, with the phone number and email beneath.
- The homepage contact panel runs edge to edge, with the phone number set large as a tap target.
- Buttons span the full width and stack. Call-to-action panels run edge to edge.
- Long email addresses can break after the "@" instead of overflowing.
- On tablets, three-column groups become "heading beside text" rows rather than squeezed columns, and the hero contact details sit in two columns.

## Accessibility

- Semantic landmarks, a skip link, one `<h1>` per page and a logical heading order.
- A 3px focus outline on every interactive element. It turns ivory on dark panels.
- An accessible disclosure menu: `aria-expanded`, Escape closes it and returns focus, and links stay visible without JavaScript.
- Every form field has a visible label. Optional fields are marked. Errors use a GOV.UK-style summary with links to each field, inline messages, `aria-invalid` and `aria-describedby`.
- The form sets `autocomplete` on each field, uses 16px minimum input text (so iOS doesn't zoom) and touch targets of at least 44px.
- Verified with axe-core (WCAG 2.2 AA and best-practice rules): no violations on any page at 390px and 1440px.
