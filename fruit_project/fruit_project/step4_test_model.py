"""
=============================================================
  STEP 4 — TEST YOUR TRAINED MODEL (Live Webcam)
  Compassionate Vendor | Member 2: Nutrition Analyst
=============================================================
  Opens your webcam and draws boxes around:
    🍏 Fruits
    🥤 Softdrink
    🍟 Chips_Packet
    🥗 Salad
    🥪 Sandwich
    🍕 Pizza
    🍔 Burger
    🥤 Milk_Shake
    🥣 Fruit_Salad

  Hold a product in front of your camera to test!
  Press Q to quit.

  Run after step3_train.py:
    python step4_test_model.py
=============================================================
"""

import cv2
import os
from ultralytics import YOLO

# ── CONFIG ────────────────────────────────────────────────
MODEL_PATH  = "runs/detect/runs/train/compassionate_vendor/weights/best.pt"
CONFIDENCE  = 0.12     # lowered to detect more easily
CLASS_NAMES = ["Fruits", "Softdrink", "Chips_Packet", "Salad", "Sandwich", "Pizza", "Burger", "Milk_Shake", "Fruit_Salad"]
COLORS      = {
    "Fruits":       (0, 200, 0),    # green
    "Softdrink":    (0, 0, 220),    # red
    "Chips_Packet": (0, 140, 255),  # orange
    "Salad":        (0, 255, 0),
    "Sandwich":     (255, 255, 0),
    "Pizza":        (100, 50, 200),
    "Burger":       (255, 100, 50),
    "Milk_Shake":   (200, 200, 200),
    "Fruit_Salad":  (255, 150, 200),
}
# ─────────────────────────────────────────────────────────

def check_model():
    if not os.path.exists(MODEL_PATH):
        print(f"\n[ERROR] Trained model not found at: {MODEL_PATH}")
        print("        Make sure step3_train.py finished successfully first!")
        exit(1)


def run_webcam():
    print("=" * 55)
    print("  STEP 4: LIVE TEST — Compassionate Vendor")
    print("=" * 55)

    check_model()

    print(f"\n[INFO] Loading trained model from: {MODEL_PATH}")
    model = YOLO(MODEL_PATH)

    print("[INFO] Opening webcam...")
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("\n[ERROR] Could not open webcam!")
        print("        Make sure your webcam is connected and not used by another app.")
        exit(1)

    print("\n✅ Webcam is live! Hold a product in front of the camera.")
    print("   Press Q to quit.\n")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("[WARN] Could not read frame from webcam. Retrying...")
            continue

        # Run detection
        results = model(frame, conf=CONFIDENCE, verbose=False)[0]

        # Draw boxes on frame
        for box in results.boxes:
            class_id   = int(box.cls)
            confidence = float(box.conf)
            name       = CLASS_NAMES[class_id] if class_id < len(CLASS_NAMES) else "Unknown"
            color      = COLORS.get(name, (255, 255, 255))

            x1, y1, x2, y2 = map(int, box.xyxy[0])

            # Draw rectangle
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

            # Draw label background
            label = f"{name} {confidence:.0%}"
            (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
            cv2.rectangle(frame, (x1, y1 - th - 10), (x1 + tw + 4, y1), color, -1)

            # Draw label text
            cv2.putText(frame, label, (x1 + 2, y1 - 5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        # Show FPS hint
        cv2.putText(frame, "Press Q to quit", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200, 200, 200), 2)

        cv2.imshow("Compassionate Vendor — Product Detector", frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("\n[INFO] Webcam closed.")
    print("[NEXT] Run:  python nutrition_analyst_v2.py")


if __name__ == "__main__":
    run_webcam()
