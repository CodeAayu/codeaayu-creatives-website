# Photo Processing Guide for CodeAayu Creatives Website

This guide documents the workflow for adding new photos to the website, including creating thumbnails with proper face-focused cropping and removing white borders.

## Directory Structure

```
images/
├── portfolio/          # Full-size images
└── thumbnails/
    └── portfolio/      # Thumbnail versions (max 800x600px)
```

## Workflow for Adding Portrait Photos

### 1. Copy Original Photos

Copy selected photos from source to the portfolio folder with proper naming:

```bash
cp /path/to/source/photo.jpg images/portfolio/portrait-N.jpg
```

**Naming Convention:**
- Portraits: `portrait-1.jpg`, `portrait-2.jpg`, etc.
- Birds: Descriptive names like `Peacock.jpg`, `Purple_heron.jpg`
- Animals: `animal-1.jpg`, `Wild Monkey.jpg`, etc.
- Scenic: Descriptive names like `Sunrise.jpg`, `Pine Forest.jpg`

### 2. Remove White Borders (If Present)

Some photos have white/light gray borders that need to be removed:

```python
python3 << 'EOF'
from PIL import Image, ImageChops

def auto_crop_borders(image_path, output_path):
    """Remove white/light borders from image"""
    img = Image.open(image_path)

    # Convert to RGB if needed
    if img.mode != 'RGB':
        img = img.convert('RGB')

    # Create a background image that's the same as the border color
    bg = Image.new('RGB', img.size, (255, 255, 255))
    diff = ImageChops.difference(img, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()

    if bbox:
        cropped = img.crop(bbox)
        cropped.save(output_path, quality=95)
        print(f"Cropped {image_path}: {img.size} -> {cropped.size}")
        return cropped.size
    else:
        img.save(output_path, quality=95)
        print(f"No border detected in {image_path}")
        return img.size

# Process multiple images
for num in [8, 9, 10]:  # Replace with your image numbers
    auto_crop_borders(
        f'images/portfolio/portrait-{num}.jpg',
        f'images/portfolio/portrait-{num}.jpg'
    )
EOF
```

### 3. Create Face-Focused Thumbnails for Portraits

For portrait photos, we need thumbnails that focus on the face/upper body, not full body:

```python
python3 << 'EOF'
from PIL import Image

# Configuration: (image_number, file_path, crop_percentage)
# crop_percentage: 0.5 = top 50%, 0.6 = top 60%, etc.
portraits = [
    (1, 'images/portfolio/portrait-1.jpg', 0.6),
    (2, 'images/portfolio/portrait-2.jpg', 0.6),
    (3, 'images/portfolio/portrait-3.jpg', 0.55),
    # Add more as needed
]

for num, filepath, crop_pct in portraits:
    img = Image.open(filepath)
    w, h = img.size

    # For horizontal images, crop differently
    if w > h:
        # Horizontal - crop to focus on left/center where face usually is
        crop_width = int(h * 1.2)  # slightly wider than square
        cropped = img.crop((0, 0, min(crop_width, w), h))
    else:
        # Vertical - crop top portion to get face/upper body
        crop_height = int(h * crop_pct)
        cropped = img.crop((0, 0, w, crop_height))

    # Resize to thumbnail (max 800x600, maintains aspect ratio)
    cropped.thumbnail((800, 600), Image.Resampling.LANCZOS)
    cropped.save(f'images/thumbnails/portfolio/portrait-{num}.jpg', quality=90)
    print(f'Portrait {num}: {img.size} -> cropped to {cropped.size} -> thumbnail saved')
EOF
```

**Guidelines for crop_pct:**
- `0.5` (50%) - For portraits where face is in top half
- `0.6` (60%) - Standard for most full-body portraits
- `0.7` (70%) - For 3/4 body shots or when face is lower in frame
- For horizontal photos, the script automatically crops from left/center

### 4. Create Standard Thumbnails (Non-Portraits)

For landscape, wildlife, or other photos that don't need face-focusing:

```python
python3 << 'EOF'
from PIL import Image

# List of images to process
images = ['animal-3.jpg', 'Sunrise.jpg', 'Pine Forest.jpg']

for img_name in images:
    img = Image.open(f'images/portfolio/{img_name}')

    # Resize maintaining aspect ratio (max 800x600)
    img.thumbnail((800, 600), Image.Resampling.LANCZOS)
    img.save(f'images/thumbnails/portfolio/{img_name}', quality=90)
    print(f'{img_name}: Thumbnail created at {img.size}')
EOF
```

## Adding Photos to Website Pages

The current site uses inlined resilient HTML tiles plus mirrored data. When adding, removing, or re-ordering a portfolio frame, keep these locations in sync:

1. `photography.html` - the visible full gallery inside `<div class="portfolio-grid" data-portfolio-grid>`.
2. `index.html` - the visible selected-work grid inside `<div class="portfolio-grid" data-selected-work>` if the frame is featured.
3. `script.js` - the `PORTFOLIO_DATA` fallback const.
4. `data/portfolio.json` - the tooling/build mirror of the same data.

### For Home Page (`index.html`)

Add featured frames to the selected-work grid only when they should appear on the home page:

```html
<button class="work-tile" type="button"
  data-lightbox-src="images/portfolio/portrait-N.jpg"
  data-caption="Portrait / Photo Title"
  data-reveal>
  <img src="images/thumbnails/portfolio/portrait-N.jpg" alt="Portrait description" loading="lazy" decoding="async">
  <span class="work-caption"><span>Portrait</span><span>Photo Title</span></span>
</button>
```

**Available categories:**
- `portrait` - Portrait and personal-brand photography
- `travel` - Travel and destination frames
- `wildlife` - Wildlife and bird photography
- `scenic` - Scenic/landscape photos
- `texture` - Detail, color, and texture studies

### For Photography Page (`photography.html`)

Add to the gallery grid:

```html
<button class="work-tile" data-category="portrait" type="button"
  data-lightbox-src="images/portfolio/portrait-N.jpg"
  data-caption="Portrait / Photo Title"
  data-reveal>
  <img src="images/thumbnails/portfolio/portrait-N.jpg" alt="Portrait description" loading="lazy" decoding="async">
  <span class="work-caption"><span>Portrait</span><span>Photo Title</span></span>
</button>
```

No manual lightbox index is required. `script.js` reads all `[data-lightbox-src]` triggers at click time and supports left/right arrow navigation.

### Data Mirror Entry

Add the same frame to `PORTFOLIO_DATA` in `script.js` and to `data/portfolio.json`:

```json
{
  "id": "portrait-N",
  "thumb": "images/thumbnails/portfolio/portrait-N.jpg",
  "full": "images/portfolio/portrait-N.jpg",
  "alt": "Portrait description",
  "category": "portrait",
  "surfaces": ["web", "campaign"],
  "title": "Photo Title",
  "tagline": "Portrait"
}
```

For home-page featured frames, also add:

```json
"featured": true,
"featuredOrder": 5
```

## CSS Configuration for Face-Focused Display

The current gallery uses `.work-tile img` with `object-fit: cover`, so the thumbnail file itself should already be cropped to the desired face/subject framing before it is added to the site:

```css
.work-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms var(--ease);
}
```

For portraits, create the face-focused thumbnail first and verify the rendered crop. Do not rely on page-level `object-position` to recover a poorly cropped thumbnail.

## Quick Reference Commands

### Check image dimensions:
```bash
sips -g pixelWidth -g pixelHeight images/portfolio/photo.jpg
```

### List all portraits:
```bash
ls -lh images/portfolio/portrait-*.jpg
ls -lh images/thumbnails/portfolio/portrait-*.jpg
```

### Verify thumbnail sizes:
```bash
find images/thumbnails/portfolio -name "*.jpg" -exec sips -g pixelWidth -g pixelHeight {} \;
```

## Troubleshooting

### Problem: Face is cut off in thumbnail
**Solution:** Increase the `crop_pct` value (e.g., from 0.6 to 0.7) to include more of the upper body.

### Problem: White borders visible
**Solution:** Run the auto_crop_borders function on the full-size image first, then recreate the thumbnail.

### Problem: Thumbnail doesn't match full-size image
**Solution:** Ensure both the full-size image in `images/portfolio/` and thumbnail in `images/thumbnails/portfolio/` are created from the same source file with the same naming.

### Problem: Horizontal photo shows wrong part of image
**Solution:** The script automatically handles horizontal photos by cropping from the left side. Adjust the multiplier `1.2` in the horizontal crop logic if needed.

## Notes

- Always maintain aspect ratios when creating thumbnails
- Quality setting of 90 provides good balance between file size and quality
- Maximum thumbnail dimension is 800px (width or height, whichever is larger)
- The lightbox uses full-size images from `images/portfolio/`, so keep those high quality
- Face-focused cropping is specifically for portrait photos; use standard thumbnails for landscapes and wildlife
