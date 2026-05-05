# Import necessary libraries for our web application
from flask import Flask, jsonify, render_template, request, send_from_directory
import requests  # For making HTTP requests to Jellyfin API
import urllib.parse  # For URL encoding
import os  # For file system operations
import json  # For JSON data handling
from werkzeug.utils import secure_filename  # For secure filename handling

# Create Flask application instance
app = Flask(__name__)

# ==============================================================================
# CONFIGURATION SECTION
# ==============================================================================

# File upload configuration
UPLOAD_FOLDER = 'uploads'  # Main folder for uploaded files
ALLOWED_EXTENSIONS = {'mp3', 'mp4', 'pdf', 'jpg', 'jpeg', 'png', 'gif'}  # Allowed file types

# Configure Flask app settings
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER  # Tell Flask where to save files
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size (100 * 1024 * 1024 bytes)

# Create necessary directories if they don't exist
# exist_ok=True prevents errors if folders already exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.join(UPLOAD_FOLDER, 'music'), exist_ok=True)      # For MP3 files
os.makedirs(os.path.join(UPLOAD_FOLDER, 'videos'), exist_ok=True)     # For MP4 files
os.makedirs(os.path.join(UPLOAD_FOLDER, 'documents'), exist_ok=True)  # For PDF files
os.makedirs(os.path.join(UPLOAD_FOLDER, 'images'), exist_ok=True)     # For JPG, PNG, GIF files

# ==============================================================================
# JELLYFIN API CONFIGURATION
# ==============================================================================

# Jellyfin server settings - CHANGE THESE TO MATCH YOUR SETUP
JELLYFIN_URL = "http://localhost:8096"  # Your Jellyfin server address
API_KEY = "f7ec6b08e2f04c119c4221956509ed01"  # Your Jellyfin API key

# HTTP headers for Jellyfin API requests
# X-Emby-Token is required for authentication with Jellyfin
headers = {
    "X-Emby-Token": API_KEY,  # Authentication token
    "Content-Type": "application/json"  # Tell server we're sending JSON
}

# ==============================================================================
# MAIN WEB PAGES
# ==============================================================================

@app.route("/")  # This is the home page route
def home():
    """Display the main page with Jellyfin library browser"""
    return render_template('index.html')  # Show the index.html template

@app.route("/jellyfin-info")  # Route to check Jellyfin connection
def jellyfin_info():
    """Check if we can connect to Jellyfin server"""
    # Make HTTP GET request to Jellyfin API
    response = requests.get(f"{JELLYFIN_URL}/System/Info", headers=headers)
    
    # Check if request was successful (HTTP 200 means OK)
    if response.status_code == 200:
        data = response.json()  # Convert response to Python dictionary
        return jsonify({
            "status": "Connected!",
            "server_name": data.get("ServerName"),  # Get server name from response
            "version": data.get("Version")  # Get server version
        })
    else:
        # If connection failed, return error message
        return jsonify({"error": f"Failed to connect to Jellyfin. Status code: {response.status_code}"}), 500

@app.route("/libraries")  # Route to get all Jellyfin libraries
def get_libraries():
    """Get all media libraries from Jellyfin server"""
    # First, get list of users from Jellyfin
    response = requests.get(f"{JELLYFIN_URL}/Users", headers=headers)
    
    # Check if we got users successfully
    if response.status_code == 200:
        users = response.json()  # Convert to Python list
        if users:  # If we have at least one user
            user_id = users[0]['Id']  # Get the first user's ID
            
            # Now get this user's library views
            libraries_response = requests.get(f"{JELLYFIN_URL}/Users/{user_id}/Views", headers=headers)
            
            # Check if library request was successful
            if libraries_response.status_code == 200:
                return jsonify(libraries_response.json())  # Return libraries as JSON
    
    # If we get here, something went wrong
    return jsonify({"error": "Failed to get libraries"}), 500

@app.route("/library/<library_id>")  # Route to browse a specific library
def get_library_items(library_id):
    """Get all items within a specific library"""
    # Get users to find user ID (same as previous function)
    response = requests.get(f"{JELLYFIN_URL}/Users", headers=headers)
    
    if response.status_code == 200:
        users = response.json()
        if users:
            user_id = users[0]['Id']  # Get first user's ID
            
            # Get all items in this library
            # ParentId = library_id (filter by this library)
            # Recursive = True (include all subfolders)
            items_response = requests.get(f"{JELLYFIN_URL}/Users/{user_id}/Items", 
                                       headers=headers, 
                                       params={'ParentId': library_id, 'Recursive': True})
            
            if items_response.status_code == 200:
                return jsonify(items_response.json())  # Return items as JSON
    
    # If we get here, something failed
    return jsonify({"error": "Failed to get library items"}), 500

@app.route("/item/<item_id>")  # Route to get details for a specific item
def get_item_details(item_id):
    """Get detailed information about a specific media item"""
    # Get users to find user ID (same pattern as before)
    response = requests.get(f"{JELLYFIN_URL}/Users", headers=headers)
    
    if response.status_code == 200:
        users = response.json()
        if users:
            user_id = users[0]['Id']  # Get first user's ID
            
            # Get detailed information for this specific item
            item_response = requests.get(f"{JELLYFIN_URL}/Users/{user_id}/Items/{item_id}", 
                                        headers=headers)
            
            if item_response.status_code == 200:
                return jsonify(item_response.json())  # Return item details as JSON
    
    # If we get here, something went wrong
    return jsonify({"error": "Failed to get item details"}), 500

@app.route("/search")  # Route to search Jellyfin content
def search_items():
    """Search for media items across all libraries"""
    # Get search query from URL parameters (?q=search_term)
    query = request.args.get('q', '')
    
    # Check if user provided a search term
    if not query:
        return jsonify({"error": "No search query provided"}), 400  # 400 = Bad Request
    
    # Get users to find user ID (same pattern as other functions)
    response = requests.get(f"{JELLYFIN_URL}/Users", headers=headers)
    
    if response.status_code == 200:
        users = response.json()
        if users:
            user_id = users[0]['Id']  # Get first user's ID
            
            # Search for items matching the query
            # SearchTerm = what we're looking for
            # Recursive = True (search in all subfolders)
            search_response = requests.get(f"{JELLYFIN_URL}/Users/{user_id}/Items", 
                                         headers=headers,
                                         params={'SearchTerm': query, 'Recursive': True})
            
            if search_response.status_code == 200:
                return jsonify(search_response.json())  # Return search results as JSON
    
    # If we get here, search failed
    return jsonify({"error": "Search failed"}), 500

# ==============================================================================
# FILE UPLOAD AND DASHBOARD FUNCTIONS
# ==============================================================================

def allowed_file(filename):
    """Check if the uploaded file has an allowed extension"""
    # Check if filename contains a dot and extension is in our allowed list
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_category(filename):
    """Determine which category folder a file belongs to based on extension"""
    ext = filename.rsplit('.', 1)[1].lower()  # Get file extension (lowercase)
    
    # Return folder name based on file type
    if ext in ['mp3']:
        return 'music'      # Audio files go to music folder
    elif ext in ['mp4']:
        return 'videos'     # Video files go to videos folder
    elif ext in ['pdf']:
        return 'documents'  # PDF files go to documents folder
    elif ext in ['jpg', 'jpeg', 'png', 'gif']:
        return 'images'     # Image files go to images folder
    else:
        return 'other'      # Unknown file types go to other folder

@app.route("/upload", methods=['POST'])  # Route for file uploads (POST only)
def upload_file():
    """Handle file uploads from the dashboard"""
    # Check if file was included in the request
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400  # 400 = Bad Request
    
    file = request.files['file']  # Get the uploaded file object
    
    # Check if user actually selected a file
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400  # 400 = Bad Request
    
    # Check if file type is allowed and file exists
    if file and allowed_file(file.filename):
        # Make filename safe (removes dangerous characters)
        filename = secure_filename(file.filename)
        
        # Determine which folder to save file in
        category = get_file_category(filename)
        category_folder = os.path.join(app.config['UPLOAD_FOLDER'], category)
        
        # Create full file path
        file_path = os.path.join(category_folder, filename)
        
        # Save the file to disk
        file.save(file_path)
        
        # Return success message with file information
        return jsonify({
            "message": "File uploaded successfully",
            "filename": filename,
            "category": category,
            "path": f"/uploads/{category}/{filename}"  # URL path for accessing file
        })
    
    # If file type is not allowed
    return jsonify({"error": "File type not allowed"}), 400  # 400 = Bad Request

@app.route("/uploads/<path:filename>")  # Route to serve uploaded files
def serve_uploaded_file(filename):
    """Serve files from the uploads directory"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route("/my-content")  # Route to get all uploaded files
def get_my_content():
    """Get list of all uploaded files organized by category"""
    # Initialize empty content structure
    content = {
        'music': [],      # For MP3 files
        'videos': [],     # For MP4 files
        'documents': [],  # For PDF files
        'images': []      # For JPG, PNG, GIF files
    }
    
    # Go through each category folder
    for category in content.keys():
        category_folder = os.path.join(app.config['UPLOAD_FOLDER'], category)
        
        # Check if category folder exists
        if os.path.exists(category_folder):
            files = []
            
            # List all files in this category folder
            for filename in os.listdir(category_folder):
                file_path = os.path.join(category_folder, filename)
                
                # Only include actual files (not directories)
                if os.path.isfile(file_path):
                    # Get file statistics
                    stat = os.stat(file_path)
                    
                    # Create file information dictionary
                    files.append({
                        'name': filename,  # Original filename
                        'path': f"/uploads/{category}/{filename}",  # URL path
                        'size': stat.st_size,  # File size in bytes
                        'modified': stat.st_mtime  # Last modified timestamp
                    })
            
            # Sort files by modification date (newest first)
            content[category] = sorted(files, key=lambda x: x['modified'], reverse=True)
    
    # Return all content as JSON
    return jsonify(content)

@app.route("/dashboard")  # Route for personal dashboard page
def dashboard():
    """Display the personal file management dashboard"""
    return render_template('dashboard.html')  # Show dashboard.html template

# ==============================================================================
# APPLICATION STARTUP
# ==============================================================================

if __name__ == "__main__":
    # This block runs when the script is executed directly
    # debug=True enables auto-reload and detailed error messages
    # In production, use a proper WSGI server instead
    app.run(debug=True)
