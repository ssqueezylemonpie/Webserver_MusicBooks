# Jellyfin Web Client with Personal Dashboard

A comprehensive Flask-based web application that serves as both a Jellyfin media server client and a personal file management dashboard. This application allows you to browse your Jellyfin libraries and manage your own media files (music, videos, documents, images) in one unified interface.

## Features

### 🎬 Jellyfin Integration
- **Library Browsing**: Browse all your Jellyfin media libraries
- **Content Discovery**: View movies, TV shows, music, and other media
- **Search Functionality**: Search across all your Jellyfin content
- **Item Details**: View detailed information about media items
- **Direct Playback**: Launch media in Jellyfin's web player

### 📁 Personal Dashboard
- **File Upload**: Drag-and-drop interface for uploading files
- **Media Management**: Organize your own music, videos, documents, and images
- **Built-in Players**: Native audio/video player and PDF viewer
- **File Operations**: Download and manage uploaded files
- **Category Organization**: Automatic categorization by file type

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Glassmorphism Design**: Modern, elegant interface with blur effects
- **Smooth Animations**: Interactive elements with smooth transitions
- **Intuitive Navigation**: Easy switching between Jellyfin and personal content

## Technology Stack

- **Backend**: Flask (Python web framework)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API Integration**: Jellyfin REST API
- **File Storage**: Local filesystem with organized directories
- **Styling**: Custom CSS with Font Awesome icons

## Project Structure

```
Webserver_MusicBooks/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── static/
│   ├── style.css         # Application styles
│   ├── script.js         # Jellyfin client JavaScript
│   └── dashboard.js      # Dashboard management JavaScript
├── templates/
│   ├── index.html        # Main Jellyfin client interface
│   └── dashboard.html    # Personal dashboard interface
├── uploads/              # User uploaded files
│   ├── music/           # MP3 files
│   ├── videos/          # MP4 files
│   ├── documents/       # PDF files
│   └── images/          # JPG, PNG, GIF files
└── README.md            # This file
```

## Installation

### Prerequisites
- Python 3.7 or higher
- Jellyfin server running on `http://localhost:8096`
- Jellyfin API key

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ssqueezylemonpie/Webserver_MusicBooks.git
   cd Webserver_MusicBooks
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Jellyfin API**
   - Open `app.py`
   - Update the `JELLYFIN_URL` and `API_KEY` variables with your Jellyfin server details
   - Your Jellyfin API key can be found in Jellyfin settings → Dashboard → API Keys

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:5000`

## Configuration

### Jellyfin Settings
In `app.py`, configure these variables:

```python
JELLYFIN_URL = "http://localhost:8096"  # Your Jellyfin server URL
API_KEY = "your_api_key_here"           # Your Jellyfin API key
```

### File Upload Settings
- **Maximum file size**: 100MB (configurable in `app.py`)
- **Supported formats**: MP3, MP4, PDF, JPG, JPEG, PNG, GIF
- **Storage location**: `uploads/` directory with subdirectories by type

## API Endpoints

### Jellyfin Integration
- `GET /` - Main application interface
- `GET /jellyfin-info` - Jellyfin server connection status
- `GET /libraries` - Get all media libraries
- `GET /library/<id>` - Browse library contents
- `GET /item/<id>` - Get item details
- `GET /search` - Search media content

### Personal Dashboard
- `GET /dashboard` - Personal dashboard interface
- `POST /upload` - Upload files
- `GET /my-content` - Get uploaded files
- `GET /uploads/<path>` - Serve uploaded files

## Security Features

- **Filename Sanitization**: All uploaded filenames are sanitized using Werkzeug's `secure_filename()`
- **File Type Validation**: Only allowed file types are accepted
- **Path Security**: File serving is restricted to the uploads directory
- **API Key Protection**: Jellyfin API key is server-side only

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

### Running in Development Mode
```bash
python app.py
```
The application runs in debug mode by default with auto-reload.

### File Structure Details
- **Static files**: CSS, JavaScript, and other assets
- **Templates**: Jinja2 HTML templates
- **Uploads**: User content organized by file type
- **Logs**: Flask development server logs

## Troubleshooting

### Common Issues

1. **Jellyfin Connection Failed**
   - Verify Jellyfin server is running
   - Check API key validity
   - Ensure correct server URL

2. **File Upload Issues**
   - Check file size limits (100MB default)
   - Verify file type is supported
   - Ensure uploads directory has write permissions

3. **Media Player Issues**
   - Ensure browser supports HTML5 media elements
   - Check file format compatibility

### Debug Mode
The application runs in debug mode by default, providing detailed error messages and auto-reload on code changes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the user guide documentation

---

**Note**: This application requires a running Jellyfin server to access media libraries. Personal dashboard features work independently of Jellyfin.