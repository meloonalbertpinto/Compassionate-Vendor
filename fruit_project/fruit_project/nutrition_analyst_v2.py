"""
=============================================================
  STEP 5 — NUTRITION ANALYST (Live Camera)
  Compassionate Vendor | Member 2: Nutrition Analyst
=============================================================
  Points your camera at a product and instantly shows:
    - Product name
    - Calories
    - Protein, Carbs, Fat, Sugar, Fibre
    - A simple health rating (Green / Yellow / Red)

  Hold a product in front of your camera.
  Press Q to quit.

  Run after step4_test_model.py:
    python nutrition_analyst_v2.py
=============================================================
"""

import cv2
import os
from ultralytics import YOLO

# ── NUTRITION DATABASE ────────────────────────────────────
# Per typical serving size
NUTRITION_DB = {
    "Fruits": {
        "serving":  "1 medium piece (182g)",
        "calories": 95,
        "protein":  0.5,
        "carbs":    25,
        "sugar":    19,
        "fat":      0.3,
        "fibre":    4.4,
        "rating":   "GREEN",
        "tip":      "High fibre, natural sugars. Great healthy snack!"
    },
    "Softdrink": {
        "serving":  "1 can (330ml)",
        "calories": 139,
        "protein":  0,
        "carbs":    35,
        "sugar":    35,
        "fat":      0,
        "fibre":    0,
        "rating":   "RED",
        "tip":      "High in sugar. Consider water or diet alternatives."
    },
    "Chips_Packet": {
        "serving":  "1 packet (30g)",
        "calories": 152,
        "protein":  2,
        "carbs":    15,
        "sugar":    0.3,
        "fat":      9.5,
        "fibre":    1.2,
        "rating":   "YELLOW",
        "tip":      "High in fat and salt. Enjoy in moderation."
    },
    "Salad": {
        "serving":  "1 bowl (200g)",
        "calories": 45,
        "protein":  2,
        "carbs":    8,
        "sugar":    3,
        "fat":      0.5,
        "fibre":    3.5,
        "rating":   "GREEN",
        "tip":      "Excellent choice! Packed with vitamins and low in calories."
    },
    "Sandwich": {
        "serving":  "1 sandwich (150g)",
        "calories": 250,
        "protein":  12,
        "carbs":    30,
        "sugar":    4,
        "fat":      8,
        "fibre":    2.5,
        "rating":   "YELLOW",
        "tip":      "Balanced meal, but watch out for high-calorie sauces."
    },
    "Pizza": {
        "serving":  "1 slice (107g)",
        "calories": 285,
        "protein":  12,
        "carbs":    36,
        "sugar":    3.5,
        "fat":      10,
        "fibre":    2.5,
        "rating":   "YELLOW",
        "tip":      "High in calories and salt. Best as an occasional treat."
    },
    "Burger": {
        "serving":  "1 burger (226g)",
        "calories": 540,
        "protein":  34,
        "carbs":    40,
        "sugar":    9,
        "fat":      27,
        "fibre":    3,
        "rating":   "RED",
        "tip":      "Very high in calories and fat. Consider a side salad instead of fries."
    },
    "Milk_Shake": {
        "serving":  "1 medium (300ml)",
        "calories": 350,
        "protein":  8,
        "carbs":    60,
        "sugar":    55,
        "fat":      9,
        "fibre":    0,
        "rating":   "RED",
        "tip":      "Packed with added sugars. Try a fresh fruit smoothie instead."
    },
    "Fruit_Salad": {
        "serving":  "1 bowl (150g)",
        "calories": 60,
        "protein":  1,
        "carbs":    15,
        "sugar":    12,
        "fat":      0.2,
        "fibre":    2.5,
        "rating":   "GREEN",
        "tip":      "Excellent source of vitamins, hydration, and natural energy!"
    },
}

RATING_COLORS = {
    "GREEN":  (0, 200, 0),
    "YELLOW": (0, 200, 200),
    "RED":    (0, 0, 220),
}

# ── CONFIG ────────────────────────────────────────────────
MODEL_PATH = "runs/detect/runs/train/compassionate_vendor/weights/best.pt"
CONFIDENCE = 0.11
# ─────────────────────────────────────────────────────────


def draw_simple_label(frame, name, x1, y1, x2, y2, rating):
    """Draw only the bounding box and the name on the camera frame."""
    rating_color = RATING_COLORS.get(rating, (255, 255, 255))
    
    # Draw bounding box
    cv2.rectangle(frame, (x1, y1), (x2, y2), rating_color, 2)
    
    # Draw label background
    label = name.replace("_", " ")
    (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
    cv2.rectangle(frame, (x1, y1 - th - 10), (x1 + tw + 4, y1), rating_color, -1)
    
    # Draw label text
    cv2.putText(frame, label, (x1 + 2, y1 - 5),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    return frame


def print_nutrition_terminal(name, data):
    """Print the detailed nutrition info to the terminal instead of the frame."""
    # Clear terminal (optional, but makes it look like a real HUD)
    # os.system('cls' if os.name == 'nt' else 'clear') 
    
    print("\n" + "="*40)
    print(f" PRODUCT DETECTED: {name.upper().replace('_', ' ')}")
    print("="*40)
    print(f" Serving Size: {data['serving']}")
    print(f" Calories    : {data['calories']} kcal")
    print("-" * 20)
    print(f" Protein     : {data['protein']}g")
    print(f" Carbs       : {data['carbs']}g")
    print(f" Sugar       : {data['sugar']}g")
    print(f" Fat         : {data['fat']}g")
    print(f" Fibre       : {data['fibre']}g")
    print("-" * 20)
    print(f" HEALTH RATING: {data['rating']}")
    print(f" TIP: {data['tip']}")
    print("="*40 + "\n")


def run():
    print("=" * 55)
    print("  NUTRITION ANALYST v2 — Compassionate Vendor")
    print("=" * 55)

    if not os.path.exists(MODEL_PATH):
        print(f"\n[ERROR] Trained model not found at: {MODEL_PATH}")
        print("        Please run step3_train.py first!")
        exit(1)

    print(f"\n[INFO] Loading model from: {MODEL_PATH}")
    model = YOLO(MODEL_PATH)

    print("[INFO] Opening webcam...")
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("\n[ERROR] Could not open webcam!")
        exit(1)

    print("\n✅ Nutrition Analyst is live!")
    print("   Hold a product (Fruits / Softdrink / Chips / Pizza / Burger / etc.) in front of camera.")
    print("   Press Q to quit.\n")

    last_printed = None

    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        results = model(frame, conf=CONFIDENCE, verbose=False)[0]
        detected_any = False

        for box in results.boxes:
            class_id = int(box.cls)
            name     = model.names[class_id]

            if name not in NUTRITION_DB:
                continue

            detected_any = True
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            data = NUTRITION_DB[name]
            
            # Draw ONLY simple box and name on screen
            frame = draw_simple_label(frame, name, x1, y1, x2, y2, data["rating"])

            # Print detailed info to TERMINAL only if it's a new detection
            if name != last_printed:
                print_nutrition_terminal(name, data)
                last_printed = name

        if not detected_any:
            last_printed = None  # Reset so it can print again if the same item returns
            cv2.putText(frame, "Hold a product in front of the camera...",
                        (10, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (150, 150, 150), 1)

        cv2.putText(frame, "Press Q to quit", (10, frame.shape[0] - 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (100, 100, 100), 1)

        cv2.imshow("Nutrition Analyst — Compassionate Vendor", frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("\n✅ Nutrition Analyst closed. Your project is complete!")


if __name__ == "__main__":
    run()
