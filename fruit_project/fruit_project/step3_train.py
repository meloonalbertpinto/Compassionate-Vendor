"""
=============================================================
  STEP 3 — TRAIN YOUR CUSTOM YOLO MODEL
  Compassionate Vendor | Member 2: Nutrition Analyst
=============================================================
  Trains YOLOv8 on your downloaded + labelled images.
  Detects: Apple, Coke_Can, Chips_Packet

  Run after auto_label.py:
    python step3_train.py
=============================================================
"""

import os
import yaml
from ultralytics import YOLO

# ── CONFIG ────────────────────────────────────────────────
EPOCHS     = 15        # increased for better detection accuracy
IMG_SIZE   = 640       # standard YOLO image size
BATCH_SIZE = 8         # reduce to 4 if you get memory errors
MODEL_BASE = "yolov8n.pt"   # start from pre-trained weights
# ─────────────────────────────────────────────────────────

def create_data_yaml():
    """Create the dataset config file YOLO needs."""
    data = {
        "path": os.path.abspath("dataset"),
        "train": "images/train",
        "val":   "images/val",
        "nc":    9,
        "names": ["Fruits", "Softdrink", "Chips_Packet", "Salad", "Sandwich", "Pizza", "Burger", "Milk_Shake", "Fruit_Salad"]
    }
    yaml_path = "dataset/data.yaml"
    with open(yaml_path, "w") as f:
        yaml.dump(data, f, default_flow_style=False)
    print(f"[INFO] Created dataset config: {yaml_path}")
    return yaml_path


from pathlib import Path

def check_dataset():
    """Make sure images and labels exist before training (recursive check)."""
    for split in ["train", "val"]:
        img_dir = Path(f"dataset/images/{split}")
        lbl_dir = Path(f"dataset/labels/{split}")
        
        # Recursive search for images
        img_count = len(list(img_dir.rglob("*.jpg"))) + \
                    len(list(img_dir.rglob("*.jpeg"))) + \
                    len(list(img_dir.rglob("*.png"))) + \
                    len(list(img_dir.rglob("*.webp")))
        
        # Recursive search for labels
        label_count = len(list(lbl_dir.rglob("*.txt")))
        
        print(f"  {split}: {img_count} images | {label_count} labels")
        if img_count == 0:
            print(f"\n[ERROR] No images found in {img_dir}")
            print("        Make sure you ran download_images.py and auto_label.py first!")
            exit(1)


def train():
    print("=" * 55)
    print("  STEP 3: TRAINING — Compassionate Vendor")
    print("=" * 55)

    print("\n[INFO] Checking dataset...")
    check_dataset()

    print("\n[INFO] Creating data.yaml config...")
    yaml_path = create_data_yaml()

    print("\n[INFO] Loading base model...")
    model = YOLO(MODEL_BASE)

    print(f"\n[INFO] Starting training for {EPOCHS} epochs...")
    print("       This may take 10–60 minutes depending on your computer.")
    print("       You will see numbers scrolling — that is normal!")
    print("       DO NOT close this window.\n")

    results = model.train(
        data    = yaml_path,
        epochs  = EPOCHS,
        imgsz   = IMG_SIZE,
        batch   = BATCH_SIZE,
        name    = "compassionate_vendor",
        project = "runs/train",
        exist_ok= True,
        verbose = True,
    )

    best_weights = "runs/train/compassionate_vendor/weights/best.pt"

    print("\n" + "=" * 55)
    print("  DONE TRAINING COMPLETE!")
    print("=" * 55)
    print(f"  Best model saved to: {best_weights}")
    print("\n[NEXT] Run:  python step4_test_model.py")


if __name__ == "__main__":
    train()
