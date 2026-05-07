import cv2
import time
from threading import Thread
from core.hand_detection import HandDetector
from core.motion_detection import MotionDetector
from core.recognition import ProductRecognizer
from utils.roi import ShelfZone
from api.server import start_api_server, update_system_state

# Configuration
MODEL_PATH = "models/best_v2.pt"
WEBCAM_ID = 0

def main():
    # 1. Initialize Components
    cap = cv2.VideoCapture(WEBCAM_ID)
    hand_detector = HandDetector()
    motion_detector = MotionDetector()
    recognizer = ProductRecognizer(MODEL_PATH)
    shelf = ShelfZone(120, 80, 520, 380)

    # 2. Start API Server in Background
    api_thread = Thread(target=start_api_server, daemon=True)
    api_thread.start()

    # 3. System State
    state = "IDLE"
    items_taken = 0
    payment_timeout = 30
    payment_start_time = 0
    remaining_time = 0
    hand_inside_states = []
    last_detection_time = 0
    cooldown = 2

    print("--- Compassionate Vendor: Integrated Engine Started ---")

    while True:
        ret, frame = cap.read()
        if not ret: break

        frame = cv2.flip(frame, 1)
        display_frame = frame.copy()
        display_frame = shelf.draw(display_frame)

        # Vision Processing
        hand_results = hand_detector.process(frame)
        display_frame = hand_detector.draw_hands(display_frame, hand_results)
        centroids = hand_detector.get_all_hand_centroids(frame, hand_results)

        motion_mask = motion_detector.get_mask(frame)
        clean_mask = motion_detector.clean_mask(motion_mask)
        
        # Logic Loop
        motion_detected = cv2.countNonZero(clean_mask[shelf.y1:shelf.y2, shelf.x1:shelf.x2]) > 1500

        # Product-driven logic (hands not required)
        products = recognizer.identify(frame)
        if products:
            p = products[0]
            product_name = p.get("name", "Unknown") 
            
            if state != "INTERACTION":
                print(f"Item Detected: {product_name}")
            
            state = "INTERACTION"
            last_detection_time = time.time()
            
            # Frontend useBackendSync expects a string for last_product to add to cart
            update_system_state(items_taken, remaining_time, state, product_name, display_frame)
            cv2.putText(display_frame, f"Product: {product_name}", (p['bbox'][0], p['bbox'][1]-10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        else:
            if state == "INTERACTION" and (time.time() - last_detection_time) > cooldown:
                print("Item Removed - Capture Confirmed")
                items_taken += 1
                payment_start_time = time.time()
                state = "PAYMENT_PENDING"
                # Pass empty string to clear the last product, allowing same product to be detected again
                update_system_state(items_taken, remaining_time, state, "", display_frame)

        # Payment Logic
        if state == "PAYMENT_PENDING":
            elapsed = time.time() - payment_start_time
            remaining_time = max(0, int(payment_timeout - elapsed))
            if remaining_time == 0: state = "THEFT"

        # Update API state
        update_system_state(items_taken, remaining_time, state, frame=display_frame)

        # UI Overlay
        cv2.putText(display_frame, f"STATUS: {state}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        cv2.putText(display_frame, f"ITEMS: {items_taken}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        cv2.imshow("Compassionate Vendor - Master Engine", display_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'): break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
