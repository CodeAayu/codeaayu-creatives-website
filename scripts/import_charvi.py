#!/usr/bin/env python3
"""Build the selected Charvi homepage portrait from the Desktop source."""

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent.parent
SOURCE = Path("/Users/aayushahuja/Desktop/IMG_8225.HEIC")
OUTPUT = ROOT / "images" / "kinetic"
DESTINATION = OUTPUT / "portrait-charvi-adiyogi.webp"


def main() -> None:
    if not SOURCE.exists():
        raise FileNotFoundError(f"Missing selected Charvi photograph: {SOURCE}")

    OUTPUT.mkdir(parents=True, exist_ok=True)
    with Image.open(SOURCE) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        width = min(1400, image.width)
        height = round(image.height * width / image.width)
        optimized = image.resize((width, height), Image.Resampling.LANCZOS)
        optimized.save(DESTINATION, "WEBP", quality=84, method=5, optimize=True)

    legacy = OUTPUT / "portrait-charvi.webp"
    if legacy.exists():
        legacy.unlink()

    print(f"Wrote {DESTINATION} at {width}x{height}")


if __name__ == "__main__":
    main()
