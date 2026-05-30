#!/usr/bin/env python3
"""Wrapper for the canonical image inventory script at the repository root."""

from pathlib import Path
import runpy


if __name__ == "__main__":
    root_script = Path(__file__).resolve().parents[1] / "image_inventory.py"
    runpy.run_path(str(root_script), run_name="__main__")
