import cv2
import mediapipe as mp

class HandDetector:
    def __init__(self, max_hands=2):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            max_num_hands=max_hands,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.7
        )
        self.mp_draw = mp.solutions.drawing_utils

    def process(self, frame):
        # Convert BGR → RGB
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb)
        return results

    def draw_hands(self, frame, results):
        if results.multi_hand_landmarks:
            for handLms in results.multi_hand_landmarks:
                self.mp_draw.draw_landmarks(
                    frame, handLms, self.mp_hands.HAND_CONNECTIONS
                )
        return frame

    def get_hand_centroid(self, frame, results):
        h, w, _ = frame.shape

        if results.multi_hand_landmarks:
            hand = results.multi_hand_landmarks[0]

            # Collect all landmark points
            x_list = []
            y_list = []

            for lm in hand.landmark:
                x_list.append(int(lm.x * w))
                y_list.append(int(lm.y * h))

            # Compute centroid
            cx = sum(x_list) // len(x_list)
            cy = sum(y_list) // len(y_list)

            return (cx, cy)
        
    def get_all_hand_centroids(self, frame, results):
        centroids = []

        if results.multi_hand_landmarks:
            h, w, _ = frame.shape

            for hand_landmarks in results.multi_hand_landmarks:
                cx = int(hand_landmarks.landmark[9].x * w)
                cy = int(hand_landmarks.landmark[9].y * h)
                centroids.append((cx, cy))

        return centroids           