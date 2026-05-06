#!/usr/bin/env python3
"""
Image Inventory Script for Benson Home Solutions Website

Processes all images from the canonical external image source defined in
AGENTS.md and creates an inventory with file metadata and placeholder
fields for manual review.
"""

import os
import json
import csv
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional

# Configuration
IMAGES_DIR = Path.home() / "Projects" / "benson-website-v5" / "images"
OUTPUT_DIR = Path.home() / "Projects" / "v6"
OUTPUT_JSON = OUTPUT_DIR / "image-inventory.json"
OUTPUT_CSV = OUTPUT_DIR / "image-inventory.csv"

# Image extensions to process
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"}

# Service categories from AGENTS.md
SERVICE_CATEGORIES = [
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

# Image stage classifications
IMAGE_STAGES = ["before", "during", "after", "general", "needs-review"]


def get_file_size_human(bytes_size: int) -> str:
    """Convert bytes to human-readable format."""
    for unit in ["B", "KB", "MB", "GB"]:
        if bytes_size < 1024.0:
            return f"{bytes_size:.1f} {unit}"
        bytes_size /= 1024.0
    return f"{bytes_size:.1f} TB"


def get_image_dimensions(file_path: Path) -> Optional[tuple[int, int]]:
    """Try to get image dimensions using PIL if available."""
    try:
        from PIL import Image
        with Image.open(file_path) as img:
            return img.size
    except ImportError:
        return None
    except Exception:
        return None


def classify_by_filename(filename: str) -> str:
    """
    Attempt to classify image stage based on filename patterns.
    Returns 'needs-review' if no clear pattern is found.
    """
    filename_lower = filename.lower()

    # Before patterns
    before_keywords = ["before", "pre", "damaged", "broken", "leak", "mold", "rot", "old"]
    if any(kw in filename_lower for kw in before_keywords):
        return "before"

    # After patterns
    after_keywords = ["after", "post", "new", "repaired", "fixed", "finished", "complete", "done"]
    if any(kw in filename_lower for kw in after_keywords):
        return "after"

    # During patterns
    during_keywords = ["during", "progress", "work", "install", "removal", "demo"]
    if any(kw in filename_lower for kw in during_keywords):
        return "during"

    return "needs-review"


def guess_service_category(filename: str) -> Optional[str]:
    """
    Attempt to guess service category based on filename patterns.
    Returns None if no clear pattern is found.
    """
    filename_lower = filename.lower()

    category_keywords = {
        "water-mold-moisture": ["water", "mold", "moisture", "dry", "flood", "leak", "damp"],
        "window-door-replacements": ["window", "door", "glass", "frame"],
        "property-preservation": ["preserve", "protect", "secure", "board"],
        "energy-weatherization": ["insul", "weather", "seal", "draft", "energy"],
        "inspection-repairs": ["inspect", "repair", "fix", "maintain"],
        "emergency-response": ["emergency", "urgent", "flood", "burst"],
    }

    for category, keywords in category_keywords.items():
        if any(kw in filename_lower for kw in keywords):
            return category

    return None


def process_images() -> List[Dict]:
    """Process all images in the directory and return inventory list."""
    inventory = []

    if not IMAGES_DIR.exists():
        print(f"Error: Images directory not found: {IMAGES_DIR}")
        return inventory

    print(f"Scanning images directory: {IMAGES_DIR}")

    # Get all files, sorted
    files = sorted(IMAGES_DIR.iterdir(), key=lambda p: p.name.lower())

    for file_path in files:
        if file_path.is_file() and file_path.suffix.lower() in IMAGE_EXTENSIONS:
            file_size = file_path.stat().st_size
            dimensions = get_image_dimensions(file_path)

            # Auto-classify based on filename
            stage = classify_by_filename(file_path.name)
            service_guess = guess_service_category(file_path.name)

            entry = {
                "file_name": file_path.name,
                "relative_path": f"images/{file_path.name}",
                "file_size_bytes": file_size,
                "file_size_human": get_file_size_human(file_size),
                "width": dimensions[0] if dimensions else None,
                "height": dimensions[1] if dimensions else None,
                "extension": file_path.suffix.lower(),
                # Manual review fields (placeholders)
                "subject": "",  # To be filled by human review
                "best_page_section": "",  # To be filled by human review
                "alt_text": "",  # To be filled by human review
                "image_stage": stage,  # Auto-classified, may need review
                "service_category": service_guess,  # Auto-guessed, may need review
                "needs_human_review": stage == "needs-review" or service_guess is None,
                "notes": "",
            }

            inventory.append(entry)
            print(f"  Processed: {file_path.name} ({get_file_size_human(file_size)})")

    return inventory


def save_inventory(inventory: List[Dict]) -> None:
    """Save inventory to both JSON and CSV formats."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Save JSON
    with open(OUTPUT_JSON, "w") as f:
        json.dump(inventory, f, indent=2)
    print(f"\nJSON inventory saved to: {OUTPUT_JSON}")

    # Save CSV
    if inventory:
        fieldnames = [
            "file_name",
            "relative_path",
            "file_size_human",
            "width",
            "height",
            "subject",
            "best_page_section",
            "alt_text",
            "image_stage",
            "service_category",
            "needs_human_review",
            "notes",
        ]

        with open(OUTPUT_CSV, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for entry in inventory:
                # Only write the fields we need for CSV
                row = {k: entry.get(k, "") for k in fieldnames}
                writer.writerow(row)
        print(f"CSV inventory saved to: {OUTPUT_CSV}")


def print_summary(inventory: List[Dict]) -> None:
    """Print a summary of the inventory."""
    if not inventory:
        print("No images found.")
        return

    total = len(inventory)
    by_stage = {}
    by_category = {}

    for entry in inventory:
        stage = entry["image_stage"]
        category = entry["service_category"] or "uncategorized"

        by_stage[stage] = by_stage.get(stage, 0) + 1
        by_category[category] = by_category.get(category, 0) + 1

    print("\n" + "=" * 60)
    print("IMAGE INVENTORY SUMMARY")
    print("=" * 60)
    print(f"Total images processed: {total}")
    print(f"\nBy image stage:")
    for stage, count in sorted(by_stage.items()):
        print(f"  {stage}: {count}")

    print(f"\nBy service category (guessed):")
    for category, count in sorted(by_category.items(), key=lambda x: x[1], reverse=True):
        print(f"  {category}: {count}")

    needs_review = sum(1 for e in inventory if e["needs_human_review"])
    print(f"\nImages needing human review: {needs_review}")
    print("=" * 60)


def main():
    """Main entry point."""
    print("Benson Home Solutions - Image Inventory Script")
    print("=" * 60)
    print(f"Images directory: {IMAGES_DIR}")
    print(f"Output directory: {OUTPUT_DIR}")
    print()

    inventory = process_images()

    if inventory:
        save_inventory(inventory)
        print_summary(inventory)
        print("\nNext steps:")
        print("1. Review the CSV file and fill in subject, page/section, and alt_text")
        print("2. Verify image_stage classifications")
        print("3. Update service_category assignments")
    else:
        print("No images to process.")


if __name__ == "__main__":
    main()
