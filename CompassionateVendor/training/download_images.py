"""
=============================================================
  DOWNLOAD TRAINING IMAGES FROM GOOGLE
  Compassionate Vendor | Member 2: Nutrition Analyst
=============================================================
  This replaces Step 1 (webcam collection).
  Downloads ~150 images per product automatically.

  Install first:
    pip install icrawler

  Then run:
    python download_images.py
=============================================================
"""

import os
import shutil
import random
from icrawler.builtin import GoogleImageCrawler, BingImageCrawler

# ── CONFIG ────────────────────────────────────────────────
# Each product has multiple search queries so you get
# diverse images (different angles, brands, backgrounds)

CONFIDENCE  = 0.12      # more sensitive for easier detection
EPOCHS      = 30        # more rounds = much smarter AI

SEARCH_QUERIES = {
    "Fruits": [
        "banana fruit bunch",
        "ripe orange fruit",
        "strawberry fruit close up",
        "watermelon slice food",
        "grapes bunch table",
    ],
    "Softdrink": [
        "pepsi can close up",
        "sprite can table",
        "fanta orange can",
        "mountain dew can",
    ],
    "Pizza": [
        "cheese pizza slice",
        "pepperoni pizza entire",
        "wood fired pizza pie",
    ],
    "Burger": [
        "cheeseburger food",
        "hamburger close up",
        "fast food burger table",
    ],
    "Milk_Shake": [
        "chocolate milkshake glass",
        "strawberry milkshake whipped cream",
        "vanilla milkshake cup",
    ],
    "Fruit_Salad": [
        "fresh fruit salad bowl",
        "mixed berries fruit bowl",
        "tropical fruit salad",
    ],
    # The user requested skipping Chips, Salad, and Sandwich, 
    # so we removed them from this download list!
}

IMAGES_PER_QUERY = 20    # Adjusted for the new variety requests
SAVE_ROOT        = "dataset/raw"

# ─────────────────────────────────────────────────────────

def make_dirs():
    for product in SEARCH_QUERIES:
        os.makedirs(f"{SAVE_ROOT}/{product}", exist_ok=True)
    for split in ["train", "val"]:
        os.makedirs(f"dataset/images/{split}", exist_ok=True)
        os.makedirs(f"dataset/labels/{split}", exist_ok=True)
    print("[INFO] Folders created.\n")


def download_all():
    make_dirs()

    for product, queries in SEARCH_QUERIES.items():
        print("=" * 55)
        print(f"  Downloading images for: {product}")
        print("=" * 55)

        product_folder = f"{SAVE_ROOT}/{product}"
        
        # Ensure we append to existing files by checking the current count
        if os.path.exists(product_folder):
            existing_imgs = [f for f in os.listdir(product_folder) if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))]
            img_count = len(existing_imgs)
        else:
            img_count = 0

        for i, query in enumerate(queries):
            # temp folder for each query
            temp_folder = f"{SAVE_ROOT}/temp_{product}_{i}"
            os.makedirs(temp_folder, exist_ok=True)

            print(f"  [{i+1}/{len(queries)}] Searching: '{query}'")

            try:
                # try Bing first (more reliable in this environment)
                crawler = BingImageCrawler(
                    storage={"root_dir": temp_folder},
                    log_level=50
                )
                crawler.crawl(
                    keyword = query,
                    max_num = IMAGES_PER_QUERY
                )
            except Exception:
                # fallback to Google
                print(f"  [WARN] Bing blocked, trying Google...")
                try:
                    crawler = GoogleImageCrawler(
                        storage={"root_dir": temp_folder},
                        log_level=50   # suppress logs
                    )
                    crawler.crawl(
                        keyword    = query,
                        max_num    = IMAGES_PER_QUERY,
                        file_idx_offset = 0
                    )
                except Exception as e:
                    print(f"  [WARN] Google also failed: {e}")
                    continue


            # move downloaded images to product folder with unique names
            for fname in os.listdir(temp_folder):
                if fname.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                    ext      = os.path.splitext(fname)[1]
                    new_name = f"{product}_{img_count:04d}{ext}"
                    src      = os.path.join(temp_folder, fname)
                    dst      = os.path.join(product_folder, new_name)
                    shutil.move(src, dst)
                    img_count += 1

            shutil.rmtree(temp_folder, ignore_errors=True)

        print(f"  [DONE] Downloaded {img_count} images for {product}\n")

    split_dataset()


def split_dataset():
    """Split raw images 80/20 into train and val."""
    print("[INFO] Splitting into train (80%) / val (20%) ...")

    for product in SEARCH_QUERIES:
        folder = f"{SAVE_ROOT}/{product}"
        images = [
            f for f in os.listdir(folder)
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
        ]
        random.shuffle(images)

        split_idx  = int(len(images) * 0.8)
        train_imgs = images[:split_idx]
        val_imgs   = images[split_idx:]

        os.makedirs(f"dataset/images/train/{product}", exist_ok=True)
        os.makedirs(f"dataset/images/val/{product}", exist_ok=True)

        for img in train_imgs:
            shutil.copy(
                os.path.join(folder, img),
                os.path.join("dataset/images/train", product, img)
            )
        for img in val_imgs:
            shutil.copy(
                os.path.join(folder, img),
                os.path.join("dataset/images/val", product, img)
            )

        print(f"  {product}: {len(train_imgs)} train | {len(val_imgs)} val")

    print("\n[DONE] All images downloaded and split!")
    print("[NEXT] Run:  python auto_label.py")


if __name__ == "__main__":
    print("=" * 55)
    print("  IMAGE DOWNLOADER — Compassionate Vendor")
    print("=" * 55)
    print("  Downloading ~150 images per product from Google.")
    print("  This may take 5-10 minutes. Don't close the window.")
    print("=" * 55 + "\n")
    download_all()
