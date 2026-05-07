import cv2
import numpy as np
import base64

class QualityInspector:
    def __init__(self):
        # Spoilage range (Brown/Dark spots)
        self.lower_brown = np.array([0, 0, 0])
        self.upper_brown = np.array([30, 255, 100])
        self.threshold = 0.05

    def analyze_freshness(self, img):
        if img is None:
            return None

        # Convert to HSV
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        
        # Create mask for spoiled areas
        mask = cv2.inRange(hsv, self.lower_brown, self.upper_brown)
        
        # Calculate ratio
        total_pixels = img.shape[0] * img.shape[1]
        spoil_pixels = cv2.countNonZero(mask)
        ratio = spoil_pixels / total_pixels

        # Determine status
        status = "FRESH" if ratio < self.threshold else "SPOILED"
        
        return {
            "ratio": round(ratio, 4),
            "status": status,
            "mask": mask
        }

    def get_annotated_image(self, img, mask):
        annotated = img.copy()
        annotated[mask > 0] = [0, 0, 255] # Red for spoilage
        
        _, buffer = cv2.imencode('.jpg', annotated)
        encoded = base64.b64encode(buffer).decode('utf-8')
        return f"data:image/jpeg;base64,{encoded}"
