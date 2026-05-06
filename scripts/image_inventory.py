#!/usr/bin/env python3
"""
Benson Home Solutions Image Inventory Script

Processes all images from the canonical external image source defined in
AGENTS.md and creates a comprehensive inventory including metadata,
visual analysis, and usage recommendations.
"""

import os
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import hashlib

try:
    from PIL import Image, ExifTags
    PILLOW_AVAILABLE = True
except ImportError:
    PILLOW_AVAILABLE = False
    print("Warning: Pillow not installed. Install with: pip install Pillow")

# Configuration
# Canonical external image source is documented in AGENTS.md.
IMAGES_DIR = Path.home() / "Projects" / "benson-website-v5" / "images"
OUTPUT_DIR = Path.home() / "Projects" / "v6"
OUTPUT_FILE = OUTPUT_DIR / "image-inventory.json"
MARKDOWN_OUTPUT = OUTPUT_DIR / "image-inventory.md"

# Service types from AGENTS.md
SERVICE_TYPES = [
    "inspection-repairs",
    "water-mold-moisture",
    "window-door-replacements",
    "maintenance-plans",
    "emergency-response",
    "energy-weatherization",
    "property-preservation",
    "residential-remodeling",
    "commercial-maintenance",
    "church-nonprofit-maintenance",
]

IMAGE_STAGES = ["before", "during", "after", "general", "needs-review"]

# Supported image extensions
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff"}


@dataclass
class ImageMetadata:
    """Metadata for a single image."""
    filename: str
    filepath: str
    file_size_bytes: int
    file_size_human: str
    width: Optional[int] = None
    height: Optional[int] = None
    format: Optional[str] = None
    mode: Optional[str] = None
    aspect_ratio: Optional[float] = None
    md5_hash: Optional[str] = None
    exif_date: Optional[str] = None
    exif_camera: Optional[str] = None
    exif_gps: Optional[Dict[str, float]] = None
    created_date: Optional[str] = None
    modified_date: Optional[str] = None


@dataclass
class ImageAnalysis:
    """Visual analysis and usage recommendations."""
    filename: str
    apparent_subject: str
    best_page_section: str
    suggested_alt_text: str
    image_stage: str
    service_category: Optional[str] = None
    crop_recommendation: Optional[str] = None
    enhancement_recommendation: Optional[str] = None
    needs_human_review: bool = False
    notes: Optional[str] = None


def format_file_size(size_bytes: int) -> str:
    """Format file size in human-readable format."""
    for unit in ["B", "KB", "MB", "GB"]:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} TB"


def calculate_md5(filepath: Path) -> str:
    """Calculate MD5 hash of a file."""
    hash_md5 = hashlib.md5()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()


def extract_exif(image: Image.Image) -> Dict[str, Any]:
    """Extract EXIF data from an image."""
    exif_data = {}
    if not hasattr(image, "_getexif"):
        return exif_data

    exif = image._getexif()
    if exif is None:
        return exif_data

    for tag, value in exif.items():
        decoded = ExifTags.TAGS.get(tag, tag)
        exif_data[decoded] = str(value)

    return exif_data


def get_image_metadata(filepath: Path) -> ImageMetadata:
    """Extract metadata from an image file."""
    stat = filepath.stat()

    metadata = ImageMetadata(
        filename=filepath.name,
        filepath=str(filepath),
        file_size_bytes=stat.st_size,
        file_size_human=format_file_size(stat.st_size),
        created_date=datetime.fromtimestamp(stat.st_ctime).isoformat(),
        modified_date=datetime.fromtimestamp(stat.st_mtime).isoformat(),
    )

    if PILLOW_AVAILABLE:
        try:
            with Image.open(filepath) as img:
                metadata.width = img.width
                metadata.height = img.height
                metadata.format = img.format
                metadata.mode = img.mode
                metadata.aspect_ratio = round(img.width / img.height, 2) if img.height > 0 else None

                # Extract EXIF data
                exif = extract_exif(img)
                if "DateTimeOriginal" in exif:
                    metadata.exif_date = exif["DateTimeOriginal"]
                if "Model" in exif:
                    metadata.exif_camera = exif["Model"]

                # GPS data would require additional parsing
                if "GPSInfo" in exif:
                    metadata.exif_gps = {"raw": exif["GPSInfo"]}

        except Exception as e:
            print(f"  Warning: Could not read image data for {filepath.name}: {e}")

    # Calculate MD5 hash
    try:
        metadata.md5_hash = calculate_md5(filepath)
    except Exception as e:
        print(f"  Warning: Could not calculate MD5 for {filepath.name}: {e}")

    return metadata


def analyze_image_visuals(filepath: Path) -> ImageAnalysis:
    """
    Analyze visual content of an image.
    This is a placeholder - in production, you'd use ML models or manual review.
    """
    filename = filepath.name

    # Default analysis - requires manual review
    analysis = ImageAnalysis(
        filename=filename,
        apparent_subject="Needs visual review",
        best_page_section="TBD",
        suggested_alt_text=f"Project photo from Benson Home Solutions - {filename}",
        image_stage="needs-review",
        needs_human_review=True,
        notes="Visual analysis requires manual review or ML model integration",
    )

    # Try to get basic image info for hints
    if PILLOW_AVAILABLE:
        try:
            with Image.open(filepath) as img:
                # Aspect ratio hints
                if img.width > img.height:
                    analysis.notes += " | Landscape orientation"
                elif img.height > img.width:
                    analysis.notes += " | Portrait orientation"
                else:
                    analysis.notes += " | Square orientation"

                # Color mode hints
                if img.mode == "RGB":
                    analysis.notes += " | Color photo"
                elif img.mode == "L":
                    analysis.notes += " | Grayscale"

        except Exception:
            pass

    return analysis


def process_images() -> List[Dict[str, Any]]:
    """Process all images in the directory."""
    if not IMAGES_DIR.exists():
        print(f"Error: Images directory not found: {IMAGES_DIR}")
        return []

    print(f"Processing images from: {IMAGES_DIR}")
    print()

    results = []
    image_files = [f for f in IMAGES_DIR.iterdir() if f.suffix.lower() in IMAGE_EXTENSIONS]

    if not image_files:
        print("No image files found.")
        return results

    print(f"Found {len(image_files)} image file(s):")
    for f in sorted(image_files):
        print(f"  - {f.name}")
    print()

    for filepath in sorted(image_files):
        print(f"Processing: {filepath.name}")

        # Extract metadata
        metadata = get_image_metadata(filepath)
        print(f"  Size: {metadata.file_size_human} | Dimensions: {metadata.width}x{metadata.height}")

        # Analyze visuals
        analysis = analyze_image_visuals(filepath)

        # Combine results
        result = {
            "metadata": asdict(metadata),
            "analysis": asdict(analysis),
            "processed_at": datetime.now().isoformat(),
        }
        results.append(result)

        print()

    return results


def save_inventory(results: List[Dict[str, Any]]):
    """Save inventory to JSON and Markdown files."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Save JSON
    with open(OUTPUT_FILE, "w") as f:
        json.dump(results, f, indent=2)
    print(f"JSON inventory saved to: {OUTPUT_FILE}")

    # Save Markdown
    markdown_lines = [
        "# Benson Home Solutions Image Inventory",
        "",
        f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        f"**Total Images:** {len(results)}",
        "",
        "---",
        "",
    ]

    for i, result in enumerate(results, 1):
        meta = result["metadata"]
        analysis = result["analysis"]

        markdown_lines.extend([
            f"## {i}. {meta['filename']}",
            "",
            "### Metadata",
            f"- **File Size:** {meta['file_size_human']}",
            f"- **Dimensions:** {meta['width']}x{meta['height']}",
            f"- **Format:** {meta['format']}",
            f"- **Aspect Ratio:** {meta['aspect_ratio']}",
            f"- **MD5:** {meta['md5_hash']}",
        ])

        if meta.get('exif_date'):
            markdown_lines.append(f"- **EXIF Date:** {meta['exif_date']}")
        if meta.get('exif_camera'):
            markdown_lines.append(f"- **Camera:** {meta['exif_camera']}")

        markdown_lines.extend([
            "",
            "### Visual Analysis",
            f"- **Subject:** {analysis['apparent_subject']}",
            f"- **Best Page/Section:** {analysis['best_page_section']}",
            f"- **Alt Text:** {analysis['suggested_alt_text']}",
            f"- **Stage:** {analysis['image_stage']}",
        ])

        if analysis.get('service_category'):
            markdown_lines.append(f"- **Service Category:** {analysis['service_category']}")
        if analysis.get('crop_recommendation'):
            markdown_lines.append(f"- **Crop Recommendation:** {analysis['crop_recommendation']}")
        if analysis.get('enhancement_recommendation'):
            markdown_lines.append(f"- **Enhancement:** {analysis['enhancement_recommendation']}")
        if analysis.get('needs_human_review'):
            markdown_lines.append(f"- **⚠️ Needs Human Review:** Yes")
        if analysis.get('notes'):
            markdown_lines.append(f"- **Notes:** {analysis['notes']}")

        markdown_lines.extend(["", "---", ""])

    with open(MARKDOWN_OUTPUT, "w") as f:
        f.write("\n".join(markdown_lines))

    print(f"Markdown inventory saved to: {MARKDOWN_OUTPUT}")


def main():
    """Main entry point."""
    print("=" * 60)
    print("Benson Home Solutions Image Inventory")
    print("=" * 60)
    print()

    if not PILLOW_AVAILABLE:
        print("⚠️  Pillow not installed. Install with: pip install Pillow")
        print("   Without Pillow, only basic file metadata will be extracted.")
        print()

    results = process_images()

    if results:
        save_inventory(results)
        print()
        print("✓ Inventory complete!")
    else:
        print("No images processed.")


if __name__ == "__main__":
    main()
