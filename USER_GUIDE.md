# User Guide - Jellyfin Web Client with Personal Dashboard

This comprehensive user guide will help you navigate and use all features of the Jellyfin Web Client with Personal Dashboard.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Jellyfin Library Browsing](#jellyfin-library-browsing)
3. [Personal Dashboard](#personal-dashboard)
4. [File Management](#file-management)
5. [Media Playback](#media-playback)
6. [Search Functionality](#search-functionality)
7. [Navigation](#navigation)
8. [Tips and Tricks](#tips-and-tricks)
9. [Troubleshooting](#troubleshooting)

## Getting Started

### Accessing the Application

1. **Start the Application**
   - Ensure the Flask application is running (`python app.py`)
   - Open your web browser
   - Navigate to `http://localhost:5000`

2. **Initial Setup**
   - The application will automatically attempt to connect to your Jellyfin server
   - Check the connection status in the top-right corner
   - If disconnected, verify your Jellyfin server is running and API key is correct

### Understanding the Interface

The application has two main sections:
- **Home Page**: Jellyfin library browsing
- **Dashboard**: Personal file management

You can switch between these using the navigation buttons in the header.

## Jellyfin Library Browsing

### Viewing Your Libraries

1. **Library Overview**
   - On the home page, you'll see all available media libraries
   - Each library shows its type (Movies, Music, TV Shows, etc.)
   - Click on any library card to browse its contents

2. **Library Categories**
   - **Movies**: Film collections with posters and metadata
   - **TV Shows**: Series with episode information
   - **Music**: Albums and tracks with cover art
   - **Photos**: Image galleries
   - **Books**: E-book collections
   - **Videos**: General video content

### Browsing Content

1. **Content Grid**
   - Items are displayed in a responsive grid layout
   - Each item shows its thumbnail/poster, title, and year
   - Hover over items to see interactive effects

2. **Item Details**
   - Click any item to view detailed information
   - See synopsis, cast, genre, runtime, and other metadata
   - Use the "Play" button to launch in Jellyfin's web player

### Navigation Controls

- **Back Button**: Return to previous view
- **Search Bar**: Find specific content quickly
- **Connection Status**: Monitor Jellyfin server connectivity

## Personal Dashboard

### Accessing the Dashboard

1. **Navigate to Dashboard**
   - Click "My Dashboard" in the header navigation
   - This opens your personal file management interface

2. **Dashboard Overview**
   - Upload area for adding new files
   - Category tabs for organizing content
   - File grid showing all uploaded content

### File Upload

#### Method 1: Drag and Drop

1. **Select Files**
   - Drag files from your computer directly onto the upload area
   - The area will highlight when files are ready to drop
   - Release to start uploading

#### Method 2: Click to Browse

1. **Open File Browser**
   - Click anywhere in the upload area
   - Select files using your system's file dialog
   - Multiple files can be selected at once

#### Upload Progress

- **Progress Bar**: Visual indicator of upload completion
- **Status Messages**: Shows current file being uploaded
- **Automatic Refresh**: Content updates after successful upload

### Supported File Types

| Category | Formats | Description |
|----------|---------|-------------|
| **Music** | MP3 | Audio files with metadata support |
| **Videos** | MP4 | Video files with HTML5 playback |
| **Documents** | PDF | Portable Document Format files |
| **Images** | JPG, JPEG, PNG, GIF | Picture files with preview |

### File Size Limits

- **Maximum Size**: 100MB per file
- **Multiple Uploads**: No limit on number of files
- **Storage**: Local filesystem in organized directories

## File Management

### Category Organization

Files are automatically organized into four categories:

#### 🎵 Music
- **Location**: `uploads/music/`
- **Features**: Audio player, metadata display
- **Actions**: Play, Download, Delete

#### 🎬 Videos  
- **Location**: `uploads/videos/`
- **Features**: Video player, fullscreen support
- **Actions**: Play, Download, Delete

#### 📄 Documents
- **Location**: `uploads/documents/`
- **Features**: PDF viewer, page navigation
- **Actions**: View, Download, Delete

#### 🖼️ Images
- **Location**: `uploads/images/`
- **Features**: Image preview, zoom capability
- **Actions**: View, Download, Delete

### File Operations

#### Viewing Files

1. **Click on any file** to open it in the modal viewer
2. **Modal Player**: Built-in player for supported formats
3. **Fullscreen Options**: Available for video and image viewing

#### Downloading Files

1. **Click the download button** (↓) on any file item
2. **File downloads** to your default download location
3. **Original filename** is preserved

#### Deleting Files

1. **Click the delete button** (🗑️) on any file item
2. **Confirmation dialog** prevents accidental deletion
3. **File removed** from both interface and filesystem

### File Information

Each file item displays:
- **Filename**: Truncated if too long
- **File Size**: Human-readable format (KB, MB, GB)
- **Upload Date**: When the file was added
- **Preview**: Thumbnail or icon representation

## Media Playback

### Audio Player (Music Files)

- **Controls**: Play, pause, seek, volume
- **Progress Bar**: Visual timeline indicator
- **Duration**: Total and elapsed time display
- **Format Support**: MP3 files

### Video Player (Video Files)

- **Controls**: Play, pause, seek, volume, fullscreen
- **Quality**: Original file quality maintained
- **Format Support**: MP4 files
- **Responsive**: Adapts to screen size

### PDF Viewer (Documents)

- **Navigation**: Page scrolling and zoom
- **Controls**: Scroll bars and zoom controls
- **Full Document**: Complete PDF rendering
- **Compatibility**: Browser-dependent PDF support

### Image Viewer (Images)

- **Display**: Full-quality image rendering
- **Responsive**: Scales to fit modal
- **Formats**: JPG, JPEG, PNG, GIF support
- **Zoom**: Browser zoom functionality

## Search Functionality

### Jellyfin Search

1. **Use the search bar** in the header
2. **Type your query** (movie title, artist, etc.)
3. **Press Enter** or click the search button
4. **Results appear** in a dedicated section

### Search Features

- **Global Search**: Searches across all libraries
- **Real-time**: Results update as you type
- **Multiple Types**: Movies, shows, music, etc.
- **Quick Access**: Click results to view details

### Search Tips

- **Be Specific**: Use exact titles for better results
- **Partial Matches**: Works with partial names
- **No Results**: Try different search terms
- **Clear Search**: Return to library view

## Navigation

### Header Navigation

- **Logo**: Returns to home page
- **Search Bar**: Global Jellyfin search
- **Connection Status**: Server connectivity indicator
- **Navigation Buttons**: Switch between Home and Dashboard

### Page Navigation

- **Breadcrumbs**: Visual path indicator
- **Back Buttons**: Return to previous views
- **Tab Navigation**: Switch between content categories
- **Modal Controls**: Close and interact with popups

### Keyboard Shortcuts

- **Enter**: Submit search or confirm actions
- **Escape**: Close modals and cancel operations
- **Tab**: Navigate between interactive elements
- **Space**: Pause/play media (when focused)

## Tips and Tricks

### File Organization

1. **Descriptive Names**: Use clear filenames for easy identification
2. **Consistent Formats**: Stick to supported file types
3. **Regular Cleanup**: Remove unused files to save space
4. **Batch Upload**: Upload multiple files at once for efficiency

### Performance Optimization

1. **File Sizes**: Keep files under 100MB for faster uploads
2. **Browser Cache**: Modern browsers cache frequently accessed files
3. **Network Speed**: Upload performance depends on your connection
4. **Storage Space**: Monitor available disk space for uploads

### User Experience

1. **Responsive Design**: Works on tablets and smartphones
2. **Modal Viewing**: Focus on content without distraction
3. **Progress Indicators**: Visual feedback for all operations
4. **Error Handling**: Clear messages for troubleshooting

### Advanced Usage

1. **Dual Purpose**: Use both Jellyfin and personal content
2. **Content Mixing**: Complement Jellyfin libraries with personal files
3. **Quick Access**: Dashboard for frequently used personal files
4. **Integration**: Seamless switching between content sources

## Troubleshooting

### Common Issues

#### Jellyfin Connection Problems

**Symptoms**: "Disconnected" status, no libraries loading

**Solutions**:
1. Verify Jellyfin server is running on `http://localhost:8096`
2. Check API key in `app.py` configuration
3. Ensure network connectivity to Jellyfin server
4. Restart the Flask application

#### File Upload Issues

**Symptoms**: Upload fails, files not appearing

**Solutions**:
1. Check file size (must be under 100MB)
2. Verify file format is supported
3. Ensure uploads directory has write permissions
4. Try refreshing the page after upload

#### Media Playback Problems

**Symptoms**: Audio/video won't play, PDF won't display

**Solutions**:
1. Update browser to latest version
2. Check browser media format support
3. Ensure file isn't corrupted
4. Try downloading file for local playback

#### Performance Issues

**Symptoms**: Slow loading, unresponsive interface

**Solutions**:
1. Check system resources (CPU, memory)
2. Close other browser tabs
3. Reduce file sizes for uploads
4. Restart the application

### Error Messages

#### "Failed to connect to Jellyfin"
- Jellyfin server is not running
- Incorrect server URL or API key
- Network connectivity issues

#### "File type not allowed"
- File format not in supported list
- Check file extension
- Convert to supported format if needed

#### "Upload failed"
- File size exceeds 100MB limit
- Insufficient disk space
- Permission issues with uploads directory

### Getting Help

1. **Check this guide** for common solutions
2. **Review the README.md** for technical details
3. **Check browser console** for error messages
4. **Restart the application** to clear temporary issues

### Contact Support

For persistent issues:
1. Document the error message
2. Note the steps to reproduce
3. Include browser and system information
4. Create an issue on the GitHub repository

---

## Quick Reference

### Keyboard Shortcuts
- `Enter` - Search/Confirm
- `Escape` - Close modal
- `Tab` - Navigate elements

### File Limits
- **Size**: 100MB per file
- **Types**: MP3, MP4, PDF, JPG, PNG, GIF
- **Storage**: Local filesystem

### URLs
- **Home**: `http://localhost:5000`
- **Dashboard**: `http://localhost:5000/dashboard`
- **Jellyfin**: `http://localhost:8096` (default)

### Navigation Path
```
Home → Library → Content → Details
     ↓
Dashboard → Upload → Category → File → View
```

---

**Enjoy using your Jellyfin Web Client with Personal Dashboard!**
