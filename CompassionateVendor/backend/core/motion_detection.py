import cv2
import numpy as np

class MotionDetector:
    def __init__(self):
        self.bg_subtractor = cv2.createBackgroundSubtractorMOG2(
            history=500,
            varThreshold=50,
            detectShadows=False
        )

        # 👇 RIGHT PLACE (inside __init__)
        self.kernel = np.ones((7, 7), np.uint8)

    def get_mask(self, frame):
        mask = self.bg_subtractor.apply(frame)
        return mask

    def clean_mask(self, mask):
        # Erosion
        mask = cv2.erode(mask, self.kernel, iterations=1)

        # Dilation
        mask = cv2.dilate(mask, self.kernel, iterations=2)

        return mask