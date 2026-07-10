#!/usr/bin/env python3
"""Import the local photography archive as web-ready gallery assets."""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent.parent
FINAL_EDITS = Path("/Users/aayushahuja/Desktop/Final Edits")
KAJAL = Path("/Users/aayushahuja/Desktop/Kajal final ")
SANSRUTI = Path("/Users/aayushahuja/Desktop/Shoot 26th April")
OUTPUT = ROOT / "images" / "gallery"
MANIFEST = ROOT / "data" / "gallery.json"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


KAJAL_SELECTIONS = [
    Path("Landscape/IMG_1421.JPG"),
    Path("Landscape/IMG_1424.JPG"),
    Path("Portrait /Close ups/IMG_1398.JPG"),
    Path("Portrait /Close ups/IMG_1401.JPG"),
    Path("Portrait /Close ups/IMG_1403.JPG"),
    Path("Portrait /Ghoomar/IMG_1380.JPG"),
    Path("Portrait /Ghoomar/IMG_1381.JPG"),
    Path("Portrait /Ghoomar/IMG_1383.JPG"),
]

SANSRUTI_SELECTIONS = [
    Path("Saree 1/Edited/Edited-4.jpg"),
    Path("Saree 1/Edited/Edited-5.jpg"),
    Path("Saree 1/Edited/Edited-6.jpg"),
    Path("Saree 1/Edited/Edited-10.jpg"),
    Path("Saree 1/Edited/Edited-11.jpg"),
    Path("Saree 2/Edited/Edited-1.jpg"),
    Path("Saree 2/Edited/Edited-5.jpg"),
    Path("Saree 3/Edited/Edited-9.jpg"),
    Path("Saree 4/Edited/Edited-14.jpg"),
    Path("Saree 4/Edited/Edited-17.jpg"),
    Path("Saree 5/Edited/Edited-20.jpg"),
]

# These titles are deliberately editorial rather than filename-derived. Each
# frame was reviewed on a contact sheet so the public gallery describes what is
# actually in the photograph.
FINAL_TITLES = {
    "A4E6EB98-1A0C-4E7D-9687-54E1435BE266.JPG": "Where the Sky Meets the Tide",
    "ACFAD645-34EF-484F-B239-4F45CCFA4F6D.JPG": "The Lone Trawler",
    "AdobePhotoshopExpress_2025-02-16_22-54-01+0530.JPG": "Amber Moon",
    "airport-1.jpg": "Exit Through the Terminal",
    "airport-2.jpg": "A Meal Between Flights",
    "airport-3.jpg": "The Light Tree",
    "airport.jpg": "Branches of Light",
    "Ant hill.jpg": "Life Along the Bark",
    "BF63ABE1-5B10-4991-BA80-221E7C3341A1.jpg": "Stars in the Black",
    "Bird-2.jpg": "Purple Swamphen",
    "Bird.jpg": "Pond Heron at Rest",
    "Bird_couple-1.jpg": "Swamphens Together",
    "Bird_couple-2.jpg": "Two Ducks, One Current",
    "Bird_couple.jpg": "At the Water's Edge",
    "bird_flight.jpg": "Small Wings, Open Sky",
    "Black Winged Stilt-1.jpg": "Black-Winged Stilt",
    "Black Winged Stilt.jpg": "Ready for Flight",
    "Blr Airport.jpg": "Storm Over Bengaluru",
    "Blue Dragon.JPG": "The Blue Dragon",
    "CA5D3ED9-D3DE-48F5-A935-0C8A847A6730_Original.jpg": "Glass Against Blue",
    "Charvi.JPG": "Charvi in Colour",
    "DEE8B97A-82DE-45AB-964C-2A0257901078.JPG": "Lake of Fire",
    "diwali-1.jpg": "The First Diya",
    "diwali.jpg": "A Quiet Flame",
    "DSC02489.jpg": "Palace in Gold",
    "DSC02731.jpg": "Violet Fire",
    "DSC08423.jpg": "Silver Cascade",
    "DSC08882.jpg": "Ridges at Dawn",
    "Duck.jpg": "Solitary Duck",
    "E099C7C5-D12F-4620-8A0D-1202110B8B79.jpg": "Wings Rising",
    "eagle_fly-1.jpg": "Into the Wind",
    "eagle_fly.jpg": "Banking Through Blue",
    "Fire_nubra.JPG": "Nubra After Dark",
    "Flamebeck_woodpecker-1.jpg": "Flameback on the Trunk I",
    "Flamebeck_woodpecker-2.jpg": "Flameback on the Trunk II",
    "Flamebeck_woodpecker-3.jpg": "Flameback on the Trunk III",
    "Flamebeck_woodpecker.jpg": "Flameback in Profile",
    "flight.jpg": "Window Seat Reverie",
    "Flower with sun.jpg": "Bloom Across the Sun",
    "Flowers close up-1.jpg": "Blue Hydrangea",
    "Flowers close up-2.jpg": "Bottlebrush in Bloom",
    "Flowers close up-3.jpg": "Lantana Light",
    "Flowers close up.jpg": "Wildflowers After Rain",
    "Flying_bird.jpg": "White Wings on Dark Water",
    "Greater_Coucal.jpg": "Coucal in Morning Light",
    "gurudwara-1.jpg": "Crown of Light",
    "gurudwara.jpg": "The Illuminated Gurudwara",
    "home.jpg": "Home Dressed in Lights",
    "IMG_0040_Original.jpg": "The Last Tree in the Fog",
    "IMG_0052.JPG": "Moon in Full Detail",
    "IMG_0055.JPG": "Blue Hour Above the City",
    "IMG_0058.JPG": "Grounded",
    "IMG_0066.jpg": "Roads After Midnight",
    "IMG_0078.JPG": "The Glass Lotus",
    "IMG_0080.jpg": "Palace Across the Water",
    "IMG_0082.jpg": "Three at Sunset",
    "IMG_0085.jpg": "Sunset Tide",
    "IMG_0090.jpg": "Road Into the Clouds",
    "IMG_0233.jpg": "Autumn Against Blue",
    "IMG_0235.jpg": "The Golden Canopy",
    "IMG_1185.jpg": "Harbour at Blue Hour",
    "IMG_1190.jpg": "Paddling Through the Harbour",
    "IMG_1192.jpg": "The Night Tree",
    "IMG_1197.jpg": "Lake Under a Painted Sky",
    "IMG_1199.jpg": "The Black Swan",
    "IMG_1201.jpg": "Sunset Beyond the Railing",
    "IMG_1205.jpg": "Three Birds in the Grey",
    "IMG_1206.jpg": "The Chase Above",
    "IMG_1207.jpg": "Storm Rider",
    "IMG_1215.jpg": "At the Edge of the View",
    "IMG_1217.jpg": "Blue Distance",
    "IMG_1230.jpg": "City Under a Golden Sky",
    "IMG_1235.jpg": "Wing Into Blue",
    "IMG_1236.jpg": "Above the Clouds",
    "IMG_1244.jpg": "Crossing the Sun",
    "IMG_1245.jpg": "Orbiting Daylight",
    "IMG_1254_Original.jpg": "Faith and Frequency",
    "IMG_1266.JPG": "Clay and Flame",
    "IMG_1267.jpg": "A Sky Full of Sparks",
    "IMG_1272.jpg": "Spotted Deer in Green",
    "IMG_1325.jpg": "Mountain Through the Veil",
    "IMG_1344.jpg": "Night Trails",
    "IMG_1345.jpg": "The Grey Moon",
    "IMG_1357.JPG": "The Ant Procession",
    "IMG_1358.JPG": "The Full Display",
    "IMG_1360.jpg": "Water Over Stone",
    "IMG_1365.jpg": "The Old Macaque",
    "IMG_1464.jpg": "Hall of a Hundred Details",
    "IMG_1466.jpg": "Red Diya",
    "IMG_1468.jpg": "Gentle Giant",
    "IMG_1548.jpg": "White Feathers",
    "IMG_1552.jpg": "A Delicate Stem",
    "IMG_1554.jpg": "The Road Through Green",
    "IMG_1557.jpg": "Those Honest Eyes",
    "IMG_1559.jpg": "Langur on the Branch",
    "IMG_1561.jpg": "Machine and Mountains",
    "IMG_1796_Original.jpg": "First Light on the Ridge",
    "IMG_1893_Original.jpg": "Mountains Without End",
    "IMG_1992_Original.JPG": "The Blue Valley",
    "IMG_2279.jpg": "Halfway to Full",
    "IMG_2285.jpg": "The Long Fall",
    "IMG_2287.jpg": "Tongue of the Serpent",
    "IMG_2292.JPG": "A Small Moon in a Large Night",
    "IMG_2293.jpg": "Blue Moon",
    "IMG_2295.jpg": "Stillness at the Blue Lake",
    "IMG_2299.jpg": "Together at Pangong",
    "IMG_2309.jpg": "Milky Way Over the Ridge",
    "IMG_2333.jpg": "The River Finds a Way",
    "IMG_9809_Original.jpg": "Diya and Bokeh",
    "Ishita.jpg": "Ishita Between Moments",
    "moon.jpg": "Crescent in Detail",
    "pamban_sunset-1.jpg": "Pamban Sun",
    "pamban_sunset-2.jpg": "Boats Beneath the Light",
    "pamban_sunset-3.jpg": "Waiting Boats",
    "pamban_sunset-4.jpg": "Last Light at Pamban",
    "pamban_sunset.jpg": "Pamban Afterglow",
    "Peacock-1.jpg": "Peacock Blue",
    "Peacock-2.jpg": "Monochrome Peacock",
    "Peacock-3.jpg": "Regal Portrait",
    "Peacock.jpg": "Peacock at Rest",
    "pigeon.jpg": "The Wire Sitter",
    "Pine Forest.jpg": "Mist Beyond the Pines",
    "Pink_flower.jpg": "Spring in Pink",
    "Plane-1.jpg": "Turning Overhead",
    "Plane.jpg": "Directly Above",
    "Plant.jpg": "Leaves Catching Light",
    "Purple_heron-1.jpg": "Heron Unfolding",
    "Purple_heron-2.jpg": "The Heron's Curve",
    "Purple_heron.jpg": "Purple Heron Standing",
    "Snapseed 2.jpg": "The High-Altitude Plain",
    "Snapseed 4.jpg": "Hazy Dawn",
    "Snapseed.jpg": "Valley in Vivid Colour",
    "Spotted_owl-1.jpg": "The Sleepy Sentinel",
    "Spotted_owl-2.jpg": "Eyes Forward",
    "Spotted_owl-3.jpg": "A Quiet Bow",
    "Spotted_owl-4.jpg": "The Curious Look",
    "Spotted_owl-5.jpg": "Midday Drowse",
    "Spotted_owl-6.jpg": "Watching from the Leaves",
    "Spotted_owl-7.jpg": "Spotted Owl in Profile",
    "Spotted_owl-9.jpg": "Portrait of a Spotted Owl",
    "Spotted_owl.jpg": "Back Turned, Still Watching",
    "Sunrise-2.jpg": "Sunrise Over the Green Ridge",
    "sunrise-3.jpg": "Morning at the Edge of Land",
    "Sunrise.jpg": "Sun Through the Old Tree",
    "twin_eagle-1.jpg": "Two Raptors, One Sky",
    "twin_eagle-2.jpg": "Crossing Paths",
    "twin_eagle-3.jpg": "The Aerial Pair",
    "twin_eagle.jpg": "Flying in Formation",
    "vivekanand_memorial-1.jpg": "Vivekananda at the Horizon",
    "vivekanand_memorial.jpg": "Vivekananda Rock Memorial",
    "wave_splashing-1.jpg": "The Breaking Wall",
    "wave_splashing-2.jpg": "White Water Over Black Rock",
    "wave_splashing-3.jpg": "After the Impact",
    "wave_splashing.jpg": "Ocean Against Stone",
    "Wild Monkey.jpg": "Behind the Haze",
    "Wilson forest.jpg": "Looking Up in Wilson Forest",
}

KAJAL_TITLES = {
    "Landscape/IMG_1421.JPG": "Kajal · A Smile on the Street",
    "Landscape/IMG_1424.JPG": "Kajal · Joy in Motion",
    "Portrait /Close ups/IMG_1398.JPG": "Kajal · Behind the Veil",
    "Portrait /Close ups/IMG_1401.JPG": "Kajal · The Earring",
    "Portrait /Close ups/IMG_1403.JPG": "Kajal · Framed in Gold",
    "Portrait /Ghoomar/IMG_1380.JPG": "Kajal · The Ghoomar",
    "Portrait /Ghoomar/IMG_1381.JPG": "Kajal · Dupatta in Flight",
    "Portrait /Ghoomar/IMG_1383.JPG": "Kajal · A Turn Through Colour",
}

SANSRUTI_TITLES = {
    "Saree 1/Edited/Edited-4.jpg": "Sansruti · Yellow Saree in Profile",
    "Saree 1/Edited/Edited-5.jpg": "Sansruti · A Sunlit Smile",
    "Saree 1/Edited/Edited-6.jpg": "Sansruti · Painted Details in Yellow",
    "Saree 1/Edited/Edited-10.jpg": "Sansruti · Standing in Sunshine",
    "Saree 1/Edited/Edited-11.jpg": "Sansruti · The Upward Glance",
    "Saree 2/Edited/Edited-1.jpg": "Sansruti · Peacock Drape in Green",
    "Saree 2/Edited/Edited-5.jpg": "Sansruti · The Peacock Detail",
    "Saree 3/Edited/Edited-9.jpg": "Sansruti · Lavender Pastures",
    "Saree 4/Edited/Edited-14.jpg": "Sansruti · Fuchsia in Profile",
    "Saree 4/Edited/Edited-17.jpg": "Sansruti · The Fuchsia Drape",
    "Saree 5/Edited/Edited-20.jpg": "Sansruti · A Saree in Bloom",
}

# Phone/camera filenames reveal nothing about the subject, so these reviewed
# overrides also keep the filters honest.
FINAL_CATEGORY_BY_FILENAME = {
    "A4E6EB98-1A0C-4E7D-9687-54E1435BE266.JPG": "places",
    "ACFAD645-34EF-484F-B239-4F45CCFA4F6D.JPG": "places",
    "BF63ABE1-5B10-4991-BA80-221E7C3341A1.jpg": "cosmos",
    "DEE8B97A-82DE-45AB-964C-2A0257901078.JPG": "places",
    "DSC08423.jpg": "nature",
    "DSC08882.jpg": "places",
    "E099C7C5-D12F-4620-8A0D-1202110B8B79.jpg": "wildlife",
    "IMG_0040_Original.jpg": "nature",
    "IMG_0082.jpg": "portraits",
    "IMG_0085.jpg": "places",
    "IMG_0090.jpg": "places",
    "IMG_0233.jpg": "nature",
    "IMG_0235.jpg": "nature",
    "IMG_1185.jpg": "places",
    "IMG_1190.jpg": "places",
    "IMG_1192.jpg": "nature",
    "IMG_1197.jpg": "places",
    "IMG_1199.jpg": "wildlife",
    "IMG_1205.jpg": "wildlife",
    "IMG_1206.jpg": "wildlife",
    "IMG_1207.jpg": "wildlife",
    "IMG_1244.jpg": "wildlife",
    "IMG_1245.jpg": "wildlife",
    "IMG_1272.jpg": "wildlife",
    "IMG_1325.jpg": "places",
    "IMG_1357.JPG": "wildlife",
    "IMG_1358.JPG": "wildlife",
    "IMG_1360.jpg": "nature",
    "IMG_1365.jpg": "wildlife",
    "IMG_1468.jpg": "wildlife",
    "IMG_1548.jpg": "wildlife",
    "IMG_1552.jpg": "nature",
    "IMG_1554.jpg": "nature",
    "IMG_1557.jpg": "wildlife",
    "IMG_1559.jpg": "wildlife",
    "IMG_1796_Original.jpg": "places",
    "IMG_1893_Original.jpg": "places",
    "IMG_1992_Original.JPG": "places",
    "IMG_2285.jpg": "nature",
    "IMG_2287.jpg": "wildlife",
    "IMG_2333.jpg": "nature",
}

COSMOS_NAMES = {
    "adobephotoshopexpress_2025-02-16_22-54-01+0530",
    "img_0052",
    "img_1344",
    "img_1345",
    "img_2279",
    "img_2292",
    "img_2293",
    "img_2309",
    "moon",
}

PEOPLE_NAMES = {
    "charvi",
    "flight",
    "ishita",
    "img_0058",
    "img_1215",
    "img_1217",
    "img_2295",
    "img_2299",
}

WILDLIFE_WORDS = {
    "bird",
    "coucal",
    "duck",
    "eagle",
    "heron",
    "monkey",
    "owl",
    "peacock",
    "pigeon",
    "stilt",
    "woodpecker",
}

NATURE_WORDS = {
    "ant hill",
    "flower",
    "flowers",
    "forest",
    "plant",
    "sunrise",
    "wave",
}

FEATURED_NAMES = {
    "a4e6eb98-1a0c-4e7d-9687-54e1435be266",
    "blue dragon",
    "charvi",
    "dsc08882",
    "eagle_fly-1",
    "fire_nubra",
    "greater_coucal",
    "ishita",
    "moon",
    "spotted_owl-9",
    "vivekanand_memorial",
    "wave_splashing",
    "wilson forest",
}


def slug(value: str) -> str:
    cleaned = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return cleaned or "frame"


def display_name(path: Path, source: str) -> str:
    if source == "final-edits":
        return FINAL_TITLES[path.name]
    if source == "kajal":
        return KAJAL_TITLES[path.relative_to(KAJAL).as_posix()]
    if source == "sansruti":
        return SANSRUTI_TITLES[path.relative_to(SANSRUTI).as_posix()]
    raise ValueError(f"Unknown gallery source: {source}")


def category_for(path: Path, source: str) -> str:
    if source == "kajal":
        return "portraits"
    if source == "sansruti":
        return "brand"
    if path.name in FINAL_CATEGORY_BY_FILENAME:
        return FINAL_CATEGORY_BY_FILENAME[path.name]

    stem = path.stem.lower().replace("_original", "")
    searchable = stem.replace("_", " ").replace("-", " ")
    if stem in COSMOS_NAMES or "moon" in searchable:
        return "cosmos"
    if stem in PEOPLE_NAMES or any(word in searchable for word in ("portrait", "charvi", "ishita")):
        return "portraits"
    if any(word in searchable for word in WILDLIFE_WORDS):
        return "wildlife"
    if any(word in searchable for word in NATURE_WORDS):
        return "nature"
    return "places"


def resize(source: Image.Image, max_width: int) -> Image.Image:
    if source.width <= max_width:
        return source.copy()
    height = round(source.height * max_width / source.width)
    return source.resize((max_width, height), Image.Resampling.LANCZOS)


def import_frame(path: Path, source: str, index: int) -> dict:
    relative_key = f"{source}/{path.as_posix()}"
    digest = hashlib.sha1(relative_key.encode("utf-8")).hexdigest()[:8]
    base = f"{index:03d}-{slug(source)}-{slug(path.stem)}-{digest}"
    thumb_path = OUTPUT / f"{base}-thumb.webp"
    full_path = OUTPUT / f"{base}.webp"

    with Image.open(path) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        thumb = resize(image, 720)
        full = resize(image, 1800)
        thumb.save(thumb_path, "WEBP", quality=72, method=5, optimize=True)
        full.save(full_path, "WEBP", quality=82, method=5, optimize=True)

    title = display_name(path, source)
    category = category_for(path, source)
    source_label = {
        "final-edits": "Final Edits",
        "kajal": "Kajal portrait study",
        "sansruti": "Sansruti campaign",
    }[source]
    stem = path.stem.lower().replace("_original", "")

    return {
        "id": base,
        "title": title,
        "category": category,
        "source": source_label,
        "thumb": f"images/gallery/{thumb_path.name}",
        "full": f"images/gallery/{full_path.name}",
        "width": thumb.width,
        "height": thumb.height,
        "alt": f"{category.rstrip('s').capitalize()} photograph by Aayush Ahuja: {title}",
        "featured": source != "final-edits" or stem in FEATURED_NAMES,
        "sort_key": hashlib.sha1(f"display/{relative_key}".encode("utf-8")).hexdigest(),
    }


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)

    final_frames = sorted(
        [path for path in FINAL_EDITS.rglob("*") if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS],
        key=lambda path: path.name.lower(),
    )
    untitled = [path.name for path in final_frames if path.name not in FINAL_TITLES]
    obsolete_titles = sorted(set(FINAL_TITLES) - {path.name for path in final_frames})
    if untitled or obsolete_titles:
        problems = []
        if untitled:
            problems.append("Photos without reviewed titles:\n" + "\n".join(untitled))
        if obsolete_titles:
            problems.append("Titles for photos no longer in Final Edits:\n" + "\n".join(obsolete_titles))
        raise ValueError("\n\n".join(problems))

    sources: list[tuple[Path, str]] = [(path, "final-edits") for path in final_frames]
    sources.extend((KAJAL / path, "kajal") for path in KAJAL_SELECTIONS)
    sources.extend((SANSRUTI / path, "sansruti") for path in SANSRUTI_SELECTIONS)

    missing = [str(path) for path, _ in sources if not path.exists()]
    if missing:
        raise FileNotFoundError("Missing selected gallery files:\n" + "\n".join(missing))

    # The Desktop folders are the source of truth. Remove only previously
    # generated gallery derivatives so deletions cannot linger on the website.
    for generated_asset in OUTPUT.glob("*.webp"):
        generated_asset.unlink()

    items = []
    for index, (path, source) in enumerate(sources, start=1):
        items.append(import_frame(path, source, index))
        if index % 20 == 0 or index == len(sources):
            print(f"Imported {index}/{len(sources)} frames", flush=True)

    items.sort(key=lambda item: (not item["featured"], item["sort_key"]))
    for item in items:
        item.pop("sort_key", None)

    counts = {category: sum(item["category"] == category for item in items) for category in (
        "portraits", "brand", "wildlife", "places", "nature", "cosmos"
    )}
    manifest = {
        "version": 1,
        "count": len(items),
        "counts": counts,
        "items": items,
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {MANIFEST} with {len(items)} frames", flush=True)


if __name__ == "__main__":
    main()
