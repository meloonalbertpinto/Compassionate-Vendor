"""
=============================================================
  AUTO-LABEL IMAGES  (Replaces Roboflow / Manual Labelling)
  Compassionate Vendor | Member 2: Nutrition Analyst
=============================================================
  This script automatically draws bounding boxes on all
  your downloaded images using a pre-trained YOLO model.
  No manual work needed!

  How it works:
    - Loads YOLOv8 pre-trained model (knows 80 objects)
    - Maps its known classes to YOUR classes:
        "apple"  →  Apple
        "bottle" →  Coke_Can
        "bowl"   →  Chips_Packet  (closest match)
    - For images where YOLO isn't confident, it labels
      the whole image center automatically (fallback)
    - Saves YOLO-format .txt label files

  Run after download_images.py:
    python auto_label.py
=============================================================
"""

import cv2
import os
import numpy as np
from ultralytics import YOLO
from pathlib import Path

# ── CONFIG ────────────────────────────────────────────────

# Maps pre-trained YOLO class names → your class index
# Your classes: 0=Apple, 1=Coke_Can, 2=Chips_Packet
YOLO_TO_YOUR_CLASS = {
    "apple":    (0, "Fruits"),
    "orange":   (0, "Fruits"),
    "banana":   (0, "Fruits"),
    "bottle":   (1, "Softdrink"),
    "cup":      (1, "Softdrink"),
    "bowl":     (2, "Chips_Packet"),
    "bag":      (2, "Chips_Packet"),
    "broccoli": (3, "Salad"),
    "sandwich": (4, "Sandwich"),
    "pizza":    (5, "Pizza"),
    "hot dog":  (6, "Burger"),    # YOLO doesn't have burger, so we use close matches and fallbacks
    "donut":    (6, "Burger"),
}

# Folder name → your class index (fallback if YOLO can't detect)
FOLDER_TO_CLASS = {
    "Fruits":       0,
    "Softdrink":    1,
    "Chips_Packet": 2,
    "Salad":        3,
    "Sandwich":     4,
    "Pizza":        5,
    "Burger":       6,
    "Milk_Shake":   7,
    "Fruit_Salad":  8,
}

CONFIDENCE   = 0.25    # low confidence so we catch more detections
FALLBACK_BOX = True    # if YOLO misses, label full image center as fallback

# ─────────────────────────────────────────────────────────

def label_to_yolo_format(x1, y1, x2, y2, img_w, img_h) -> str:
    """Convert pixel box to YOLO normalized format: cx cy w h"""
    cx = (x1 + x2) / 2 / img_w
    cy = (y1 + y2) / 2 / img_h
    w  = (x2 - x1) / img_w
    h  = (y2 - y1) / img_h
    return f"{cx:.6f} {cy:.6f} {w:.6f} {h:.6f}"


def auto_label_folder(model, split: str):
    img_dir   = Path(f"dataset/images/{split}")
    label_dir = Path(f"dataset/labels/{split}")
    label_dir.mkdir(parents=True, exist_ok=True)

    images = list(img_dir.rglob("*.jpg")) + \
             list(img_dir.rglob("*.jpeg")) + \
             list(img_dir.rglob("*.png")) + \
             list(img_dir.rglob("*.webp"))

    if not images:
        print(f"  [WARN] No images found in {img_dir}")
        return

    print(f"\n  Labelling {len(images)} images in '{split}' ...")

    yolo_detected = 0
    fallback_used = 0
    skipped       = 0

    for img_path in images:
        # figure out which class this image belongs to from its folder
        product    = img_path.parent.name
        class_id   = FOLDER_TO_CLASS.get(product)

        if class_id is None:
            skipped += 1
            continue

        label_dir_product = label_dir / product
        label_dir_product.mkdir(parents=True, exist_ok=True)
        label_path   = label_dir_product / (img_path.stem + ".txt")
        
        # INSTANT SKIP: If we already labeled this image, skip it to save massive amounts of time!
        if label_path.exists():
            skipped += 1
            continue

        img = cv2.imread(str(img_path))
        if img is None:
            skipped += 1
            continue

        img_h, img_w = img.shape[:2]
        lines        = []

        # ── Run YOLO detection ─────────────────
        results = model(img, conf=CONFIDENCE, verbose=False)[0]
        matched = False

        for box in results.boxes:
            yolo_class = model.names[int(box.cls)]
            if yolo_class in YOLO_TO_YOUR_CLASS:
                mapped_id, mapped_name = YOLO_TO_YOUR_CLASS[yolo_class]
                # only use if the mapped class matches the image's product
                if mapped_id == class_id:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    box_str = label_to_yolo_format(x1, y1, x2, y2, img_w, img_h)
                    lines.append(f"{class_id} {box_str}")
                    matched = True

        # ── Fallback: if YOLO missed, label center 60% of image ──
        if not matched and FALLBACK_BOX:
            margin = 0.20   # 20% margin from edges
            x1 = int(img_w * margin)
            y1 = int(img_h * margin)
            x2 = int(img_w * (1 - margin))
            y2 = int(img_h * (1 - margin))
            box_str = label_to_yolo_format(x1, y1, x2, y2, img_w, img_h)
            lines.append(f"{class_id} {box_str}")
            fallback_used += 1
        else:
            yolo_detected += 1

        # ── Write label file ──────────────────
        with open(label_path, "w") as f:
            f.write("\n".join(lines))

    total = len(images) - skipped
    print(f"  [DONE] YOLO detected : {yolo_detected}/{total} images")
    print(f"  [DONE] Fallback used : {fallback_used}/{total} images")
    if skipped:
        print(f"  ⚠ Skipped       : {skipped} (unreadable/unknown)")


def verify_labels():
    """Quick check — show a few labelled images visually."""
    print("\n[INFO] Showing 3 sample labelled images for verification...")
    print("       Press any key to go to next. Press Q to skip.")

    class_names  = ["Fruits", "Softdrink", "Chips_Packet", "Salad", "Sandwich", "Pizza", "Burger", "Milk_Shake", "Fruit_Salad"]
    class_colors = [(0,200,0), (0,0,220), (0,140,255), (0,255,0), (255,255,0), (100,50,200), (255,100,50), (200,200,200), (255,150,200)]

    img_dir   = Path("dataset/images/train")
    label_dir = Path("dataset/labels/train")

    shown = 0
    for img_path in img_dir.rglob("*.jpg"):
        product = img_path.parent.name
        label_path = label_dir / product / (img_path.stem + ".txt")
        if not label_path.exists():
            continue

        img    = cv2.imread(str(img_path))
        if img is None:
            continue
        ih, iw = img.shape[:2]

        with open(label_path) as f:
            for line in f:
                parts = line.strip().split()
                if len(parts) != 5:
                    continue
                cid        = int(parts[0])
                cx,cy,w,h  = map(float, parts[1:])
                x1 = int((cx - w/2) * iw)
                y1 = int((cy - h/2) * ih)
                x2 = int((cx + w/2) * iw)
                y2 = int((cy + h/2) * ih)
                color = class_colors[cid]
                cv2.rectangle(img, (x1,y1), (x2,y2), color, 2)
                cv2.putText(img, class_names[cid], (x1, y1-8),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

        cv2.imshow("Label Verification (press any key / Q to quit)", img)
        key = cv2.waitKey(0) & 0xFF
        cv2.destroyAllWindows()
        shown += 1
        if shown >= 3 or key == ord('q'):
            break

    print("[INFO] Verification done.")


def main():
    print("=" * 55)
    print("  DONE TRAINING COMPLETE!")
    print("=" * 55)
    print("  Loading pre-trained YOLOv8 model...")

    model = YOLO("yolov8n.pt")   # downloads ~6MB first time

    for split in ["train", "val"]:
        auto_label_folder(model, split)

    print("\n[DONE] All images labelled!")

    # count total labels created
    for split in ["train", "val"]:
        label_dir = Path(f"dataset/labels/{split}")
        count     = len(list(label_dir.glob("*.txt")))
        print(f"  {split}: {count} label files created")

    print("\n[VERIFY] Showing sample labelled images...")
    verify_labels()

    print("\n[NEXT] Run:  python step3_train.py")


if __name__ == "__main__":
    main()
