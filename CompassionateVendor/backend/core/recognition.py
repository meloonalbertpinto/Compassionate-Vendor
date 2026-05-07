import cv2
import os
from ultralytics import YOLO

# Nutrition Database (Added aliases for better recognition)
NUTRITION_DB = {
    "Fruits": {
        "serving":  "1 medium piece (182g)",
        "calories": 95, "protein":  0.5, "carbs": 25, "sugar": 19, "fat": 0.3, "fibre": 4.4,
        "rating": "GREEN", "tip": "High fibre, natural sugars. Great healthy snack!"
    },
    "Apple": {
        "serving":  "1 medium piece (182g)",
        "calories": 95, "protein":  0.5, "carbs": 25, "sugar": 19, "fat": 0.3, "fibre": 4.4,
        "rating": "GREEN", "tip": "High fibre, natural sugars. Great healthy snack!"
    },
    "Orange": {
        "serving": "1 fruit (131g)",
        "calories": 62, "protein": 1.2, "carbs": 15, "sugar": 12, "fat": 0.2, "fibre": 3.1,
        "rating": "GREEN", "tip": "Excellent source of Vitamin C!"
    },
    "Banana": {
        "serving": "1 medium (118g)",
        "calories": 105, "protein": 1.3, "carbs": 27, "sugar": 14, "fat": 0.4, "fibre": 3.1,
        "rating": "GREEN", "tip": "Great for energy and potassium."
    },
    "Softdrink": {
        "serving":  "1 can (330ml)",
        "calories": 139, "protein":  0, "carbs": 35, "sugar": 35, "fat": 0, "fibre": 0,
        "rating": "RED", "tip": "High in sugar. Consider water or diet alternatives."
    },
    "Coca-Cola": {
        "serving":  "1 can (330ml)",
        "calories": 139, "protein":  0, "carbs": 35, "sugar": 35, "fat": 0, "fibre": 0,
        "rating": "RED", "tip": "High in sugar. Consider water or diet alternatives."
    },
    "Chips_Packet": {
        "serving":  "1 packet (30g)",
        "calories": 152, "protein":  2, "carbs": 15, "sugar": 0.3, "fat": 9.5, "fibre": 1.2,
        "rating": "YELLOW", "tip": "High in fat and salt. Enjoy in moderation."
    },
    "Salad": {
        "serving":  "1 bowl (200g)",
        "calories": 45, "protein":  2, "carbs": 8, "sugar": 3, "fat": 0.5, "fibre": 3.5,
        "rating": "GREEN", "tip": "Excellent choice! Packed with vitamins and low in calories."
    },
    "Sandwich": {
        "serving":  "1 sandwich (150g)",
        "calories": 250, "protein":  12, "carbs": 30, "sugar": 4, "fat": 8, "fibre": 2.5,
        "rating": "YELLOW", "tip": "Balanced meal, but watch out for high-calorie sauces."
    },
    "Pizza": {
        "serving":  "1 slice (107g)",
        "calories": 285, "protein":  12, "carbs": 36, "sugar": 3.5, "fat": 10, "fibre": 2.5,
        "rating": "YELLOW", "tip": "High in calories and salt. Best as an occasional treat."
    },
    "Burger": {
        "serving":  "1 burger (226g)",
        "calories": 540, "protein":  34, "carbs": 40, "sugar": 9, "fat": 27, "fibre": 3,
        "rating": "RED", "tip": "Very high in calories and fat. Consider a side salad instead of fries."
    },
    "Milk_Shake": {
        "serving":  "1 medium (300ml)",
        "calories": 350, "protein":  8, "carbs": 60, "sugar": 55, "fat": 9, "fibre": 0,
        "rating": "RED", "tip": "Packed with added sugars. Try a fresh fruit smoothie instead."
    },
    "Fruit_Salad": {
        "serving":  "1 bowl (150g)",
        "calories": 60, "protein":  1, "carbs": 15, "sugar": 12, "fat": 0.2, "fibre": 2.5,
        "rating": "GREEN", "tip": "Excellent source of vitamins, hydration, and natural energy!"
    },
}

class ProductRecognizer:
    def __init__(self, model_path):
        self.model = YOLO(model_path)
        self.confidence = 0.15  # Lowered for easier detection

    def identify(self, frame):
        results = self.model(frame, conf=self.confidence, verbose=False)[0]
        detections = []
        
        # DEBUG: See what the AI sees
        if len(results.boxes) > 0:
            labels = [self.model.names[int(box.cls)] for box in results.boxes]
            print(f"AI SEES: {labels}")

        for box in results.boxes:
            class_id = int(box.cls)
            name = self.model.names[class_id]
            
            # Map detected name to our database
            target_key = None
            if name in NUTRITION_DB:
                target_key = name
            elif name.lower() == "apple":
                target_key = "Apple"
            
            if target_key:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                detections.append({
                    "name": target_key,
                    "bbox": (x1, y1, x2, y2),
                    "nutrition": NUTRITION_DB[target_key]
                })
        return detections
