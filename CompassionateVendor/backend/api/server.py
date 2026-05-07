from flask import Flask, jsonify, render_template, request, Response
from flask_cors import CORS
import cv2
import numpy as np
import time
from core.quality import QualityInspector

app = Flask(__name__)
CORS(app)

# Shared system state
system_data = {
    "items_taken": 0,
    "payment_timer": 0,
    "system_status": "IDLE",
    "last_product": None
}

# Global for the latest frame
last_frame = None

quality_inspector = QualityInspector()

@app.route("/data", methods=["GET"])
def get_system_data():
    return jsonify(system_data)

@app.route("/analyze", methods=["POST"])
def analyze_product():
    if 'image' not in request.files:
        return jsonify({"error": "No image"}), 400
        
    file = request.files['image']
    img_bytes = file.read()
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    result = quality_inspector.analyze_freshness(img)
    if result:
        annotated_img = quality_inspector.get_annotated_image(img, result["mask"])
        return jsonify({
            "spoilage_ratio": result["ratio"],
            "status": result["status"],
            "processed_image": annotated_img
        })
    return jsonify({"error": "Processing failed"}), 500

@app.route("/video_feed")
def video_feed():
    def generate():
        while True:
            if last_frame is not None:
                ret, buffer = cv2.imencode('.jpg', last_frame)
                frame_bytes = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            else:
                time.sleep(0.1)
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

def update_system_state(items, timer, status, product=None, frame=None):
    global system_data, last_frame
    system_data["items_taken"] = items
    system_data["payment_timer"] = timer
    system_data["system_status"] = status
    if product:
        system_data["last_product"] = product
    if frame is not None:
        last_frame = frame

def start_api_server():
    app.run(debug=False, port=5000, host="0.0.0.0", use_reloader=False)
