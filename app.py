from flask import Flask, jsonify, render_template, request, send_from_directory
import requests
import urllib.parse
import os
import json
from werkzeug.utils import secure_filename

app = Flask(__name__)

# File upload configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp3', 'mp4', 'pdf', 'jpg', 'jpeg', 'png', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.join(UPLOAD_FOLDER, 'music'), exist_ok=True)
os.makedirs(os.path.join(UPLOAD_FOLDER, 'videos'), exist_ok=True)
os.makedirs(os.path.join(UPLOAD_FOLDER, 'documents'), exist_ok=True)
os.makedirs(os.path.join(UPLOAD_FOLDER, 'images'), exist_ok=True)

# --- Jellyfin Configuration ---
JELLYFIN_URL = "http://localhost:8096"
API_KEY = "f7ec6b08e2f04c119c4221956509ed01"

headers = {
    "X-Emby-Token": API_KEY,
    "Content-Type": "application/json"
}

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/jellyfin-info")
def jellyfin_info():
    response = requests.get(f"{JELLYFIN_URL}/System/Info", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        return jsonify({
            "status": "Connected!",
            "server_name": data.get("ServerName"),
            "version": data.get("Version")
        })
    else:
        return jsonify({"error": f"Failed to connect to Jellyfin. Status code: {response.status_code}"}), 500

@app.route("/libraries")
def get_libraries():
    response = requests.get(f"{JELLYFIN_URL}/Users", headers=headers)
    if response.status_code == 200:
        users = response.json()
        if users:
            user_id = users[0]['Id']
            libraries_response = requests.get(f"{JELLYFIN_URL}/Users/{user_id}/Views", headers=headers)
            if libraries_response.status_code == 200:
                return jsonify(libraries_response.json())
    return jsonify({"error": "Failed to get libraries"}), 500

@app.route("/library/<library_id>")
def get_library_items(library_id):
    response = requests.get(f"{JELLYFIN_URL}/Users", headers=headers)
    if response.status_code == 200:
        users = response.json()
        if users:
            user_id = users[0]['Id']
            items_response = requests.get(f"{JELLYFIN_URL}/Users/{user_id}/Items", 
                                       headers=headers, 
                                       params={'ParentId': library_id, 'Recursive': True})
            if items_response.status_code == 200:
                return jsonify(items_response.json())
    return jsonify({"error": "Failed to get library items"}), 500

@app.route("/item/<item_id>")
def get_item_details(item_id):
    response = requests.get(f"{JELLYFIN_URL}/Users", headers=headers)
    if response.status_code == 200:
        users = response.json()
        if users:
            user_id = users[0]['Id']
            item_response = requests.get(f"{JELLYFIN_URL}/Users/{user_id}/Items/{item_id}", 
                                        headers=headers)
            if item_response.status_code == 200:
                return jsonify(item_response.json())
    return jsonify({"error": "Failed to get item details"}), 500

@app.route("/search")
def search_items():
    query = request.args.get('q', '')
    if not query:
        return jsonify({"error": "No search query provided"}), 400
    
    response = requests.get(f"{JELLYFIN_URL}/Users", headers=headers)
    if response.status_code == 200:
        users = response.json()
        if users:
            user_id = users[0]['Id']
            search_response = requests.get(f"{JELLYFIN_URL}/Users/{user_id}/Items", 
                                         headers=headers,
                                         params={'SearchTerm': query, 'Recursive': True})
            if search_response.status_code == 200:
                return jsonify(search_response.json())
    return jsonify({"error": "Search failed"}), 500

# File upload and dashboard functionality
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_category(filename):
    ext = filename.rsplit('.', 1)[1].lower()
    if ext in ['mp3']:
        return 'music'
    elif ext in ['mp4']:
        return 'videos'
    elif ext in ['pdf']:
        return 'documents'
    elif ext in ['jpg', 'jpeg', 'png', 'gif']:
        return 'images'
    else:
        return 'other'

@app.route("/upload", methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        category = get_file_category(filename)
        category_folder = os.path.join(app.config['UPLOAD_FOLDER'], category)
        
        file_path = os.path.join(category_folder, filename)
        file.save(file_path)
        
        return jsonify({
            "message": "File uploaded successfully",
            "filename": filename,
            "category": category,
            "path": f"/uploads/{category}/{filename}"
        })
    
    return jsonify({"error": "File type not allowed"}), 400

@app.route("/uploads/<path:filename>")
def serve_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route("/my-content")
def get_my_content():
    content = {
        'music': [],
        'videos': [],
        'documents': [],
        'images': []
    }
    
    for category in content.keys():
        category_folder = os.path.join(app.config['UPLOAD_FOLDER'], category)
        if os.path.exists(category_folder):
            files = []
            for filename in os.listdir(category_folder):
                file_path = os.path.join(category_folder, filename)
                if os.path.isfile(file_path):
                    stat = os.stat(file_path)
                    files.append({
                        'name': filename,
                        'path': f"/uploads/{category}/{filename}",
                        'size': stat.st_size,
                        'modified': stat.st_mtime
                    })
            content[category] = sorted(files, key=lambda x: x['modified'], reverse=True)
    
    return jsonify(content)

@app.route("/dashboard")
def dashboard():
    return render_template('dashboard.html')

if __name__ == "__main__":
    app.run(debug=True)
