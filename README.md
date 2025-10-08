# CodeAayu Creatives - Photography Portfolio Website

A modern, responsive photography portfolio website showcasing travel, portrait, wildlife, and scenic photography. Built with vanilla HTML, CSS, and JavaScript with a focus on performance and visual storytelling.

🌐 **Live Site:** [codeaayucreatives.co.in](https://codeaayucreatives.co.in)

## 📸 Features

### Portfolio Showcase
- **Multi-category Gallery**: Travel, Wildlife, Birds, Scenic, and Portrait photography
- **Filterable Gallery**: Dynamic filtering system to browse photos by category
- **Lightbox View**: Full-screen image viewing with smooth transitions
- **Face-focused Thumbnails**: Smart cropping for portrait photos to highlight subjects
- **Responsive Grid Layout**: Masonry-style gallery that adapts to all screen sizes

### Interactive Elements
- **Smooth Animations**: AOS (Animate On Scroll) library for engaging page transitions
- **Dark/Light Theme Toggle**: User preference-based theme switching
- **Dynamic Navigation**: Active page highlighting and smooth scroll navigation
- **Contact Form**: Integrated with Web3Forms for functional contact submissions
- **Back-to-Top Button**: Easy navigation on long pages

### Content Sections
- **Home Page**: Hero section, about preview, services, featured work, and contact
- **Photography Page**: Complete portfolio gallery with filtering and lightbox
- **About Page**: Personal story, education, experience, and timeline
- **Writing Page**: Blog posts and creative writing showcase
- **Contact Page**: Contact form with social media links

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables for theming
- **Icons**: SVG icons for performance and scalability
- **Fonts**: Google Fonts (Space Grotesk, Inter)
- **Animations**: AOS (Animate On Scroll) library
- **Form Handling**: Web3Forms API integration
- **Hosting**: GitHub Pages (or custom hosting)

## 📁 Project Structure

```
my_website_codeaayu_creatives_co_in/
├── .claude/                      # Claude AI documentation
│   └── photo-processing-guide.md # Photo workflow documentation
├── assets/                       # Additional assets (PDFs, etc.)
├── components/                   # Reusable HTML components
│   ├── header.html              # Navigation bar
│   └── footer.html              # Footer and back-to-top
├── css/                         # Additional stylesheets
│   ├── main.css
│   └── responsive.css
├── images/                      # All image assets
│   ├── about/                   # About page images
│   ├── logos/                   # Brand logos
│   ├── portfolio/               # Full-size portfolio images
│   └── thumbnails/              # Optimized thumbnails
│       ├── portfolio/           # Portfolio thumbnails
│       └── about/               # About page thumbnails
├── js/                          # Additional JavaScript
│   └── main.js
├── components-loader.js         # Dynamic component loader
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

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- A text editor (VS Code, Sublime, etc.)
- Python 3.x with PIL/Pillow (for photo processing)
- Git (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/my_website_codeaayu_creatives_co_in.git
   cd my_website_codeaayu_creatives_co_in
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     # Then visit http://localhost:8000
     ```

3. **Install Python dependencies (for photo processing)**
   ```bash
   pip install Pillow
   ```

## 📷 Adding New Photos

Detailed instructions are available in [`.claude/photo-processing-guide.md`](.claude/photo-processing-guide.md)

### Quick Start

1. **Copy photos to portfolio folder**
   ```bash
   cp /path/to/photo.jpg images/portfolio/portrait-N.jpg
   ```

2. **Remove white borders (if present)**
   ```python
   python3 -c "
   from PIL import Image, ImageChops
   # See .claude/photo-processing-guide.md for complete script
   "
   ```

3. **Create face-focused thumbnails**
   ```python
   python3 -c "
   from PIL import Image
   # See .claude/photo-processing-guide.md for complete script
   "
   ```

4. **Add to HTML pages**
   - Update `index.html` and `photography.html`
   - Add appropriate category (`portraits`, `travel`, `wildlife`, etc.)

## 🎨 Customization

### Theme Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary: #6366f1;        /* Primary brand color */
    --secondary: #8b5cf6;      /* Secondary brand color */
    --bg-primary: #ffffff;     /* Light theme background */
    --text-primary: #1a1a1a;   /* Light theme text */
}

[data-theme="dark"] {
    --bg-primary: #0a0a0a;     /* Dark theme background */
    --text-primary: #f5f5f5;   /* Dark theme text */
}
```

### Navigation & Footer
Edit the component files:
- `components/header.html` - Navigation bar
- `components/footer.html` - Footer content

Changes will automatically apply to all pages thanks to the component loader system.

### Adding New Pages
1. Create new HTML file (e.g., `services.html`)
2. Add `data-page="services"` to `<body>` tag
3. Include component placeholders:
   ```html
   <div id="header-component"></div>
   <!-- Your content -->
   <div id="footer-component"></div>
   ```
4. Load scripts:
   ```html
   <script src="components-loader.js"></script>
   <script src="script.js"></script>
   ```

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

Mobile-specific features:
- Hamburger menu navigation
- Touch-optimized gallery
- Optimized image loading
- Condensed layouts

## 🔧 Maintenance

### Updating Portfolio
1. Add new photos following the photo processing guide
2. Update `photography.html` with new gallery items
3. Optionally add featured work to `index.html`

### Updating Content
- **About**: Edit `about.html`
- **Services**: Edit `index.html` services section
- **Writing**: Edit `writing.html`
- **Contact**: Update social media links in `components/footer.html`

### Updating Styles
- Main styles: `styles.css`
- Component-specific styles: Embedded in HTML pages
- Responsive styles: `css/responsive.css`

## 🌐 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Go to Settings → Pages
3. Select branch (usually `main`)
4. Set custom domain in `CNAME` file (if applicable)

### Custom Domain
1. Update `CNAME` file with your domain
2. Configure DNS records:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
          185.199.109.153
          185.199.110.153
          185.199.111.153

   Type: CNAME
   Name: www
   Value: yourusername.github.io
   ```

## 📧 Contact Form Setup

The contact form uses [Web3Forms](https://web3forms.com/):

1. Get API key from Web3Forms
2. Update `contact.html`:
   ```html
   <input type="hidden" name="access_key" value="YOUR_API_KEY">
   ```
3. Configure redirect URL and form behavior

## 🎯 Performance Optimization

- **Image Optimization**: Thumbnails are max 800x600px, quality 90%
- **Lazy Loading**: Images load only when needed
- **CSS/JS Minification**: Consider minifying for production
- **CDN**: Consider using a CDN for fonts and libraries
- **Caching**: Browser caching configured for static assets

## 🧪 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is private and proprietary. All rights reserved.

## 👨‍💻 Author

**Aayush Ahuja**
- Website: [codeaayucreatives.co.in](https://codeaayucreatives.co.in)
- Instagram: [@codeaayu.creatives](https://instagram.com/codeaayu.creatives)
- Medium: [@codeaayu](https://medium.com/@codeaayu)
- LinkedIn: [codeaayu](https://www.linkedin.com/in/codeaayu/)
- YouTube: [@codeaayucreatives](https://www.youtube.com/@codeaayucreatives)

## 🙏 Acknowledgments

- Photography subjects and collaborators
- Web3Forms for contact form API
- Google Fonts for typography
- AOS library for scroll animations
- All open-source tools and libraries used

## 📝 Version History

### v2.0 (Current)
- Added portrait photography section
- Implemented face-focused thumbnail system
- Added dark/light theme toggle
- Integrated Web3Forms contact form
- Component-based architecture for header/footer
- Improved responsive design
- Enhanced gallery filtering
- Added lightbox functionality

### v1.0
- Initial release
- Basic portfolio structure
- Travel and wildlife photography showcase

## 🐛 Known Issues

None currently. Report issues via email or social media.

## 🔮 Future Enhancements

- [ ] Add blog functionality with CMS integration
- [ ] Implement photo categories pagination
- [ ] Add photo metadata (camera, settings, location)
- [ ] Create print shop integration
- [ ] Add client testimonials section
- [ ] Implement photo search functionality
- [ ] Add image zoom on hover preview
- [ ] Create photography tutorials section

---

**Last Updated**: October 2025

For detailed photo processing instructions, see [`.claude/photo-processing-guide.md`](.claude/photo-processing-guide.md)
