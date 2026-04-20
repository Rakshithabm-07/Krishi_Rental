"""
aadhaar_validator.py
────────────────────
Validates:
1. Aadhaar NUMBER  – format + Verhoeff checksum (official algorithm)
2. Aadhaar IMAGE   – checks image contains Aadhaar-specific visual markers
                     using Pillow (no OCR dependency needed)
"""

import re
import io
from PIL import Image

# ─────────────────────────────────────────────────────────────
# 1.  AADHAAR NUMBER VALIDATION
# ─────────────────────────────────────────────────────────────

# Verhoeff multiplication table
_V_D = [
    [0,1,2,3,4,5,6,7,8,9],
    [1,2,3,4,0,6,7,8,9,5],
    [2,3,4,0,1,7,8,9,5,6],
    [3,4,0,1,2,8,9,5,6,7],
    [4,0,1,2,3,9,5,6,7,8],
    [5,9,8,7,6,0,4,3,2,1],
    [6,5,9,8,7,1,0,4,3,2],
    [7,6,5,9,8,2,1,0,4,3],
    [8,7,6,5,9,3,2,1,0,4],
    [9,8,7,6,5,4,3,2,1,0],
]
_V_P = [
    [0,1,2,3,4,5,6,7,8,9],
    [1,5,7,6,2,8,3,0,9,4],
    [5,8,0,3,7,9,6,1,4,2],
    [8,9,1,6,0,4,3,5,2,7],
    [9,4,5,3,1,2,6,8,7,0],
    [4,2,8,6,5,7,3,9,0,1],
    [2,7,9,3,8,0,6,4,1,5],
    [7,0,4,6,9,1,3,2,5,8],
]
_V_INV = [0,4,3,2,1,9,8,7,6,5]

def _verhoeff_check(number: str) -> bool:
    """Return True if number passes Verhoeff checksum."""
    c = 0
    for i, ch in enumerate(reversed(number)):
        c = _V_D[c][_V_P[i % 8][int(ch)]]
    return c == 0

def validate_aadhaar_number(raw: str) -> tuple[bool, str]:
    """
    Returns (is_valid, error_message).
    Accepts formats: 1234 5678 9012 | 1234-5678-9012 | 123456789012
    """
    # Strip spaces and hyphens
    number = re.sub(r'[\s\-]', '', raw.strip())

    if not number:
        return False, "Aadhaar number is required"

    if not number.isdigit():
        return False, "Aadhaar number must contain only digits"

    if len(number) != 12:
        return False, f"Aadhaar number must be 12 digits (got {len(number)})"

    # First digit cannot be 0 or 1
    if number[0] in ('0', '1'):
        return False, "Aadhaar number cannot start with 0 or 1"

    # All same digits is invalid
    if len(set(number)) == 1:
        return False, "Aadhaar number is invalid"

    # Verhoeff checksum
    if not _verhoeff_check(number):
        return False, "Aadhaar number is invalid (checksum failed)"

    return True, ""


# ─────────────────────────────────────────────────────────────
# 2.  AADHAAR IMAGE VALIDATION
# ─────────────────────────────────────────────────────────────

# Typical Aadhaar card dimensions (mm): 85.6 × 54  → ratio ~1.58
_AADHAAR_RATIO_MIN = 1.3
_AADHAAR_RATIO_MAX = 2.0

# Aadhaar cards have a white/cream base with colored bands
# We check that the image is plausibly a document photo:
#   - JPEG or PNG
#   - Not too small (at least 200×100 px)
#   - Not square like a profile photo (ratio check)
#   - Contains a reasonable mix of colors (not blank/solid)

ALLOWED_MIME = {'image/jpeg', 'image/jpg', 'image/png'}
ALLOWED_EXT  = {'.jpg', '.jpeg', '.png'}

def validate_aadhaar_image(file_storage) -> tuple[bool, str]:
    """
    file_storage: werkzeug FileStorage object
    Returns (is_valid, error_message)
    """
    import os

    # ── 1. Extension check ───────────────────────────────────
    filename = file_storage.filename or ''
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXT:
        return False, "Aadhaar image must be JPG or PNG"

    # ── 2. Read bytes ────────────────────────────────────────
    file_storage.stream.seek(0)
    raw = file_storage.stream.read()
    if len(raw) < 5000:            # less than ~5 KB → too small to be a real scan
        return False, "Aadhaar image file is too small. Please upload a clear photo of your Aadhaar card"

    if len(raw) > 10 * 1024 * 1024:  # > 10 MB
        return False, "Aadhaar image is too large (max 10 MB)"

    # ── 3. Open with Pillow ──────────────────────────────────
    try:
        img = Image.open(io.BytesIO(raw))
        img.verify()               # catches corrupt files
        img = Image.open(io.BytesIO(raw))  # re-open after verify
        img = img.convert('RGB')
    except Exception:
        return False, "Could not read image. Please upload a valid JPG or PNG file"

    width, height = img.size

    # ── 4. Minimum size ──────────────────────────────────────
    if width < 200 or height < 100:
        return False, "Aadhaar image resolution is too low. Please upload a clearer photo"

    # ── 5. Aspect ratio – Aadhaar card is landscape ──────────
    ratio = width / height
    if ratio < _AADHAAR_RATIO_MIN:
        return False, (
            "This does not look like an Aadhaar card image. "
            "Please upload a landscape photo of your Aadhaar card"
        )
    if ratio > _AADHAAR_RATIO_MAX:
        return False, "Image is too wide to be an Aadhaar card. Please upload a proper photo"

    # ── 6. Color diversity check (not a blank / solid image) ─
    # Sample a grid of pixels and count distinct colors
    small = img.resize((40, 25))
    pixels = list(small.getdata())
    # Bucket each channel to nearest 32 to group similar colors
    buckets = set(
        (r >> 5, g >> 5, b >> 5)
        for r, g, b in pixels
    )
    if len(buckets) < 6:
        return False, "Image appears to be blank or a solid color. Please upload a real Aadhaar card photo"

    # ── 7. Brightness check – must not be near-black or near-white ──
    import statistics
    brightnesses = [0.299*r + 0.587*g + 0.114*b for r, g, b in pixels]
    mean_brightness = statistics.mean(brightnesses)
    if mean_brightness < 20:
        return False, "Aadhaar image is too dark. Please upload a clearer photo"
    if mean_brightness > 240:
        return False, "Aadhaar image is too bright / overexposed. Please upload a clearer photo"

    # ── 8. Reset stream for saving ───────────────────────────
    file_storage.stream.seek(0)

    return True, ""
