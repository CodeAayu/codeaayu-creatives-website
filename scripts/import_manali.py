#!/usr/bin/env python3
"""Add the selected solo Ishita portraits from Manali to the gallery."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent.parent
SOURCE = Path("/Users/aayushahuja/Desktop/Manali/pics")
GALLERY_OUTPUT = ROOT / "images" / "gallery"
KINETIC_OUTPUT = ROOT / "images" / "kinetic"
MANIFEST = ROOT / "data" / "gallery.json"
SOURCE_LABEL = "Manali portrait story"

SELECTIONS = [
    ("manali-ishita-mountain-light", "DSC06479.JPG", "Ishita in Mountain Light"),
    ("manali-ishita-snowline", "DSC06453_1.JPG", "Ishita Before the Snowline"),
    ("manali-ishita-waterfall", "DSC06480.JPG", "Ishita by the Falls"),
]


def resize(source: Image.Image, max_width: int) -> Image.Image:
    if source.width <= max_width:
        return source.copy()
    height = round(source.height * max_width / source.width)
    return source.resize((max_width, height), Image.Resampling.LANCZOS)


def import_frame(frame_id: str, source_path: Path, title: str) -> dict:
    thumb_path = GALLERY_OUTPUT / f"{frame_id}-thumb.webp"
    full_path = GALLERY_OUTPUT / f"{frame_id}.webp"

    with Image.open(source_path) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        thumb = resize(image, 720)
        full = resize(image, 1800)
        thumb.save(thumb_path, "WEBP", quality=74, method=5, optimize=True)
        full.save(full_path, "WEBP", quality=84, method=5, optimize=True)

    return {
        "id": frame_id,
        "title": title,
        "category": "portraits",
        "source": SOURCE_LABEL,
        "thumb": f"images/gallery/{thumb_path.name}",
        "full": f"images/gallery/{full_path.name}",
        "width": thumb.width,
        "height": thumb.height,
        "alt": f"Portrait photograph by Aayush Ahuja: {title}",
        "featured": True,
    }


def main() -> None:
    selected_paths = [(frame_id, SOURCE / filename, title) for frame_id, filename, title in SELECTIONS]
    missing = [str(path) for _, path, _ in selected_paths if not path.exists()]
    if missing:
        raise FileNotFoundError("Missing selected Manali photographs:\n" + "\n".join(missing))

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    previous = [item for item in manifest["items"] if item.get("source") == SOURCE_LABEL]
    retained = [item for item in manifest["items"] if item.get("source") != SOURCE_LABEL]

    for item in previous:
        for key in ("thumb", "full"):
            asset = ROOT / item[key]
            if asset.parent == GALLERY_OUTPUT and asset.exists():
                asset.unlink()

    GALLERY_OUTPUT.mkdir(parents=True, exist_ok=True)
    KINETIC_OUTPUT.mkdir(parents=True, exist_ok=True)
    imported = [import_frame(frame_id, path, title) for frame_id, path, title in selected_paths]

    with Image.open(selected_paths[0][1]) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        feature = resize(image, 1800)
        feature.save(KINETIC_OUTPUT / "portrait-ishita-manali.webp", "WEBP", quality=84, method=5, optimize=True)

    legacy_feature = KINETIC_OUTPUT / "portrait-ishita.webp"
    if legacy_feature.exists():
        legacy_feature.unlink()

    items = imported + retained
    categories = ("portraits", "brand", "wildlife", "places", "nature", "cosmos")
    manifest["version"] = 2
    manifest["count"] = len(items)
    manifest["counts"] = {
        category: sum(item["category"] == category for item in items)
        for category in categories
    }
    manifest["items"] = items
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Added {len(imported)} solo Ishita portraits; gallery now has {len(items)} frames")


if __name__ == "__main__":
    main()
