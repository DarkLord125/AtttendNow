from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition as fr
import numpy as np
import os
import datetime
from pymongo import MongoClient
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}


app = Flask(__name__)
CORS(app)

# Load environment variables from .env file
load_dotenv()

# Load all the known faces and their encodings from the 'people' folder
def load_known_faces():
    known_faces = []
    for dirname in os.listdir('people'):
        if not os.path.isdir(os.path.join('people', dirname)):
            continue
        for filename in os.listdir(os.path.join('people', dirname)):
            image = fr.load_image_file(os.path.join('people', dirname, filename))
            face_encodings = fr.face_encodings(image)
            if len(face_encodings) > 0:
                encoding = face_encodings[0]
                name = dirname
                known_faces.append((encoding, name))
    return known_faces


known_faces = load_known_faces()

# Process the uploaded image and return the detected faces
def process_image(image_path):
    image = fr.load_image_file(image_path)
    locations = fr.face_locations(image)
    encodings = fr.face_encodings(image, locations)

    # Compare the encodings with the known faces
    detected_faces = []
    for encoding in encodings:
        matches = fr.compare_faces([f[0] for f in known_faces], encoding, tolerance=0.56)
        if any(matches):
            name = known_faces[np.argmax(matches)][1]
            detected_faces.append({'name': name, 'attendance': True})

    return detected_faces

# Save the attendance records to a MongoDB collection
mongo_url = os.environ.get('MONGO_URL')
client = MongoClient(mongo_url)
db = client['test']
collection = db['attendance']

def save_attendance(attendance, filename):
    # faces_data = []
    people_data = []
    for name, status in attendance.items():
        person_data = {"name": name, "attendance status": status}
        people_data.append(person_data)

    record = {
        "image": filename,
        "faces": people_data,
        "timestamp": datetime.datetime.utcnow()
    }
    collection.insert_one(record)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/detect_faces', methods=['POST'])
def detect_faces():
    # Get the uploaded image file
    if 'file' not in request.files:
        return jsonify({'error': 'No image provided.'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected.'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)

    # Save the uploaded image to a temporary file
    temp_path = 'temp/' + file.filename
    file.save(temp_path)

    # Run the facial recognition code on the uploaded image
    detected_faces = process_image(temp_path)

    # Save the attendance records to MongoDB
    attendance = {}
    for face in detected_faces:
        folder_path = os.path.join('people', face['name'])
        if os.path.isdir(folder_path):
            attendance[face['name']] = True
        else:
            attendance[face['name']] = False
    save_attendance(attendance, file.filename)

    # Delete the temporary file
    os.remove(temp_path)

    # Return the detected faces and attendance status as a JSON response
    return jsonify({'detected_faces': detected_faces})


if __name__ == '__main__':
    app.run(debug=True, port=4000)
