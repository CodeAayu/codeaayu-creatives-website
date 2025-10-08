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

### For Home Page (index.html)

Add to the work grid section around line 353:

```html
<!-- Portraits -->
<div class="work-item" data-category="portraits" data-aos="fade-up">
    <div class="work-image">
        <img src="images/thumbnails/portfolio/portrait-N.jpg" alt="Portrait photography" loading="lazy">
        <div class="work-overlay">
            <div class="work-info">
                <span class="work-category">Portrait Photography</span>
                <h3 class="work-title">Title Here</h3>
                <p class="work-description">Description here</p>
            </div>
            <a href="photography.html" class="work-link">
                <span>View Project</span>
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </a>
        </div>
    </div>
</div>
```

**Available categories:**
- `portraits` - Portrait photography
- `travel` - Travel photography
- `wildlife` - Wildlife photos
- `scenic` - Scenic/landscape photos
- `birds` - Bird photography
- `animals` - Animal photography

### For Photography Page (photography.html)

Add to the gallery around line 555:

```html
<div class="gallery-card" data-category="portraits" data-aos="fade-up">
    <div class="gallery-image">
        <img src="images/thumbnails/portfolio/portrait-N.jpg" alt="Portrait description" loading="lazy">
        <div class="gallery-overlay-v2">
            <span class="gallery-category">Portraits</span>
            <h3 class="gallery-title">Photo Title</h3>
            <button class="gallery-zoom" onclick="openLightbox(INDEX)">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
    </div>
</div>
```

**Important:** Update the `onclick="openLightbox(INDEX)"` with the correct sequential index based on existing photos in the gallery.

## CSS Configuration for Face-Focused Display

The photography.html page has this CSS (around line 940) to ensure faces are visible in thumbnails:

```css
.gallery-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;  /* Crops from top where faces are */
    transition: transform var(--transition-slow);
}
```

The gallery uses `aspect-ratio: 4/3` containers, and `object-position: top center` ensures that even if thumbnails don't perfectly match the container ratio, faces remain visible.

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
