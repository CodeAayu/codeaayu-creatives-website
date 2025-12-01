# CodeAayu Creatives - Photography Portfolio Website

A modern, elegant photography portfolio website showcasing travel, portrait, wildlife, and scenic photography. Built with vanilla HTML, CSS, and JavaScript featuring a sophisticated dark theme with editorial luxury aesthetics.

**Live Site:** [codeaayucreatives.co.in](https://codeaayucreatives.co.in)

## Features

### Portfolio Showcase
- **Multi-category Gallery**: Travel, Wildlife, Birds, Scenic, and Portrait photography
- **Filterable Gallery**: Dynamic filtering system to browse photos by category
- **Lightbox View**: Full-screen high-resolution image viewing with keyboard navigation
- **Responsive Grid Layout**: Adaptive gallery that works beautifully on all screen sizes

### Design & Aesthetics
- **Editorial Luxury Theme**: Sophisticated dark mode design with warm cream and gold accents
- **Professional Typography**: Playfair Display (serif) for headlines, DM Sans for body text
- **Smooth Animations**: Scroll-triggered reveals and subtle hover effects
- **Grain Texture Overlay**: Premium feel with subtle grain texture

### Interactive Elements
- **Responsive Navigation**: Desktop nav with mobile hamburger menu
- **Contact Form**: Integrated with Web3Forms for functional contact submissions
- **Back-to-Top Button**: Easy navigation on long pages
- **Loading Screen**: Branded loading animation

### Content Sections
- **Home Page**: Hero section, about preview, services, featured work, writing preview, and contact
- **Photography Page**: Complete portfolio gallery with category filtering and lightbox
- **About Page**: Personal story, experience timeline, and skills showcase
- **Writing Page**: Blog posts and Medium articles showcase
- **Contact Page**: Contact form with FAQ section

## Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables (dark theme)
- **Typography**: Google Fonts (Playfair Display, DM Sans)
- **Icons**: Inline SVG icons
- **Form Handling**: Web3Forms API integration
- **Hosting**: GitHub Pages

## Project Structure

```
codeaayu-creatives-website/
├── images/
│   ├── about/                   # About page images
│   ├── logos/                   # Brand logos (white/black variants)
│   ├── portfolio/               # Full-size portfolio images
│   └── thumbnails/              # Optimized thumbnails
│       ├── portfolio/           # Portfolio thumbnails
│       └── about/               # About page thumbnails
├── script.js                    # Main JavaScript file
├── styles.css                   # Main stylesheet
├── index.html                   # Home page
├── photography.html             # Photography portfolio
├── about.html                   # About page
├── writing.html                 # Writing/blog page
├── contact.html                 # Contact page
├── CNAME                        # Custom domain configuration
└── README.md                    # This file
```

## Getting Started

### Prerequisites
- A modern web browser
- A text editor (VS Code, Sublime, etc.)
- Git (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CodeAayu/codeaayu-creatives-website.git
   cd codeaayu-creatives-website
   ```

2. **Open in browser**
   ```bash
   # Using Python 3
   python -m http.server 8080
   # Then visit http://localhost:8080
   ```

## Design System

### Color Palette
```css
:root {
  --color-ink: #1a1a1a;          /* Deep charcoal (background) */
  --color-cream: #f5f0e8;        /* Warm cream (text) */
  --color-gold: #c9a962;         /* Muted gold (accent) */
  --color-muted: #8a8580;        /* Muted gray (secondary text) */
}
```

### Typography
- **Display/Headlines**: Playfair Display (serif)
- **Body Text**: DM Sans (sans-serif)

### Breakpoints
- **Desktop**: 1024px and above
- **Tablet**: 641px - 1023px
- **Mobile**: 640px and below

## Responsive Design

The website is fully responsive with:
- Mobile-first approach
- Optimized touch interactions
- Simplified footer on mobile
- Disabled animations on mobile for better performance
- Adaptive image loading

## Deployment

### GitHub Pages
1. Push to GitHub repository
2. Go to Settings → Pages
3. Select branch (usually `main`)
4. Set custom domain in `CNAME` file

### Custom Domain
Configure DNS records:
```
Type: A
Name: @
Value: 185.199.108.153 (and other GitHub IPs)

Type: CNAME
Name: www
Value: codeaayu.github.io
```

## Contact Form Setup

The contact form uses [Web3Forms](https://web3forms.com/):

1. Get API key from Web3Forms
2. Update the access_key in contact form
3. Form submissions are sent to configured email

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Author

**Aayush Ahuja**
- Website: [codeaayucreatives.co.in](https://codeaayucreatives.co.in)
- Instagram: [@codeaayu.creatives](https://instagram.com/codeaayu.creatives)
- Medium: [@codeaayu](https://medium.com/@codeaayu)
- LinkedIn: [codeaayu](https://www.linkedin.com/in/codeaayu/)
- YouTube: [@codeaayucreatives](https://www.youtube.com/@codeaayucreatives)

## Version History

### v3.0 (Current - December 2024)
- Complete design overhaul with editorial luxury aesthetic
- Dark mode only theme with warm cream and gold accents
- New typography system (Playfair Display + DM Sans)
- Actual brand logo integration in header, footer, and loading screen
- Improved mobile responsiveness
- Simplified footer on mobile
- Enhanced lightbox with full-resolution images
- Removed theme toggle (dark mode only)
- Performance optimizations for mobile

### v2.0
- Added portrait photography section
- Implemented face-focused thumbnail system
- Added dark/light theme toggle
- Integrated Web3Forms contact form
- Enhanced gallery filtering
- Added lightbox functionality

### v1.0
- Initial release
- Basic portfolio structure
- Travel and wildlife photography showcase

## License

This project is private and proprietary. All rights reserved.

---

**Last Updated**: December 2024
