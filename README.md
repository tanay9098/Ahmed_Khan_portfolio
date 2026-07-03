# Ahmed Khan — Graphic Designer Portfolio

A premium, production-ready portfolio website for Ahmed Khan, a UAE-based graphic designer specialising in brand identity, marketing collateral, and visual communications.

## Features

- **Dark premium aesthetic** — deep black backgrounds with gold accents reflecting the designer's visual language
- **Custom cursor** — gold dot + ring follower with hover states (desktop only)
- **Loader animation** — branded AK monogram with progress bar
- **Smooth scroll reveal** — staggered entrance animations for all sections
- **Animated counters** — stats animate into view on scroll
- **Project filter** — client-side filtering by category (All / Branding / Marketing / Social Media / Print)
- **Project modal** — lightbox-style case study view for each project
- **Testimonial slider** — auto-playing with swipe support, dot navigation, and pause-on-hover
- **Contact form** — client-side validation with loading/success states
- **Fully responsive** — mobile, tablet, laptop, desktop, large monitors
- **Marquee ticker** — continuous skills/services scrolling band
- **Back-to-top button** — appears after 400px scroll
- **SEO optimised** — meta tags, Open Graph, Twitter Cards, JSON-LD structured data
- **Accessibility** — semantic HTML5, ARIA attributes, focus states, keyboard navigation
- **Reduced motion** — respects `prefers-reduced-motion`
- **No dependencies** — pure HTML5, CSS3, Vanilla JS (ES6)

## Folder Structure

```
Ahmed_Khan_portfolio/
├── index.html          # Main entry point
├── css/
│   └── style.css       # All styles (CSS custom properties, modular sections)
├── js/
│   └── script.js       # All interactivity (loader, cursor, filter, modal, slider, form)
├── assets/
│   ├── images/         # Add project images and OG cover here
│   ├── icons/          # Optional icon assets
│   └── fonts/          # Optional local font files
├── favicon/
│   └── favicon.svg     # SVG favicon (AK monogram)
├── robots.txt
├── sitemap.xml
└── README.md
```

## Customisation Guide

### Colours
All colours are CSS custom properties in `:root` at the top of `style.css`. Change `--gold` and `--black` to instantly retheme the entire site.

### Designer Information
Update the following in `index.html`:
- Hero stats (`data-target` values)
- About section text and skill tags
- Contact details (email, phone, location)
- Social media links
- Behance URL

### Projects
Each project card in the HTML has a `data-project` attribute matching a key in the `projectData` object in `script.js`. To add or edit projects:
1. Add a card in the `#projectGrid` section of `index.html`
2. Add the corresponding entry in `projectData` in `script.js`

### Real Images
Replace the CSS-generated card mockups by adding `<img>` tags inside `.project-card__img` with `loading="lazy"` and descriptive `alt` text.

### Contact Form Backend
The form submission in `script.js` (`initContactForm`) currently simulates a 1.8s delay. Replace the `await new Promise(...)` call with a real `fetch()` to your backend or a service like Formspree / EmailJS.

## Deployment

### GitHub Pages
1. Push to a repository named `username.github.io` or any repo
2. Go to **Settings → Pages → Source: Deploy from branch → main / root**
3. Update the canonical URL and sitemap URL to match

### Netlify
1. Drag and drop the project folder into Netlify's deploy interface, or
2. Connect the GitHub repo and deploy with default settings (no build command needed)

### Vercel
```bash
npx vercel --prod
```

## Browser Compatibility

| Browser         | Support |
|-----------------|---------|
| Chrome 90+      | ✅ Full |
| Firefox 88+     | ✅ Full |
| Safari 14+      | ✅ Full |
| Edge 90+        | ✅ Full |
| Samsung Browser | ✅ Full |
| IE 11           | ❌ Not supported |

## Credits

- Typography: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond), [Bebas Neue](https://fonts.google.com/specimen/Bebas+Neue), [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts
- Design & Development: Built to match Ahmed Khan's visual identity as seen in his 2026 Graphic Design Portfolio
