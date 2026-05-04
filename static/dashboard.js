// Dashboard JavaScript for file management
class DashboardManager {
    constructor() {
        this.currentCategory = 'music';
        this.content = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadContent();
    }

    setupEventListeners() {
        // File upload
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files));
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFileSelect(e.dataTransfer.files);
        });

        // Category tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchCategory(btn.dataset.category));
        });

        // Modal
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
        document.getElementById('mediaModal').addEventListener('click', (e) => {
            if (e.target.id === 'mediaModal') this.closeModal();
        });
    }

    async handleFileSelect(files) {
        const uploadProgress = document.getElementById('uploadProgress');
        const progressFill = document.getElementById('progressFill');
        const uploadStatus = document.getElementById('uploadStatus');
        
        if (files.length === 0) return;

        uploadProgress.style.display = 'block';
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            uploadStatus.textContent = `Uploading ${file.name} (${i + 1}/${files.length})`;
            progressFill.style.width = `${((i + 1) / files.length) * 100}%`;
            
            await this.uploadFile(file);
        }

        setTimeout(() => {
            uploadProgress.style.display = 'none';
            progressFill.style.width = '0%';
            this.loadContent();
        }, 1000);
    }

    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Upload error:', error);
            this.showError(`Failed to upload ${file.name}: ${error.message}`);
        }
    }

    async loadContent() {
        try {
            const response = await fetch('/my-content');
            this.content = await response.json();
            
            if (response.ok) {
                this.updateAllCategories();
            } else {
                throw new Error(this.content.error || 'Failed to load content');
            }
        } catch (error) {
            console.error('Load content error:', error);
            this.showError(`Failed to load content: ${error.message}`);
        }
    }

    updateAllCategories() {
        ['music', 'videos', 'documents', 'images'].forEach(category => {
            this.updateCategory(category);
        });
    }

    updateCategory(category) {
        const files = this.content[category] || [];
        const grid = document.getElementById(`${category}-files`);
        const count = document.getElementById(`${category}-count`);
        
        count.textContent = `${files.length} files`;
        
        if (files.length === 0) {
            grid.innerHTML = '<div class="empty-state">No files uploaded yet</div>';
            return;
        }

        grid.innerHTML = files.map(file => this.createFileItem(file, category)).join('');
    }

    createFileItem(file, category) {
        const icon = this.getFileIcon(file.name);
        const size = this.formatFileSize(file.size);
        const preview = this.getFilePreview(file, category);
        
        return `
            <div class="file-item" onclick="dashboardManager.openFile('${file.path}', '${file.name}', '${category}')">
                <div class="file-preview">
                    ${preview}
                </div>
                <div class="file-info">
                    <h4 title="${file.name}">${file.name}</h4>
                    <p>${size}</p>
                    <p>${this.formatDate(file.modified)}</p>
                    <div class="file-actions">
                        <button class="file-action-btn" onclick="event.stopPropagation(); dashboardManager.downloadFile('${file.path}', '${file.name}')">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="file-action-btn" onclick="event.stopPropagation(); dashboardManager.deleteFile('${file.path}', '${category}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const icons = {
            'mp3': 'fa-music',
            'mp4': 'fa-video',
            'pdf': 'fa-file-pdf',
            'jpg': 'fa-image',
            'jpeg': 'fa-image',
            'png': 'fa-image',
            'gif': 'fa-image'
        };
        return icons[ext] || 'fa-file';
    }

    getFilePreview(file, category) {
        const ext = file.name.split('.').pop().toLowerCase();
        
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
            return `<img src="${file.path}" alt="${file.name}">`;
        } else {
            const icon = this.getFileIcon(file.name);
            return `<i class="fas ${icon}"></i>`;
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    switchCategory(category) {
        // Update tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        // Update content
        document.querySelectorAll('.category-content').forEach(content => {
            content.classList.toggle('active', content.id === `${category}-content`);
        });

        this.currentCategory = category;
    }

    openFile(path, filename, category) {
        const modal = document.getElementById('mediaModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = filename;
        
        const ext = filename.split('.').pop().toLowerCase();
        
        if (['mp3'].includes(ext)) {
            modalBody.innerHTML = `<audio controls class="audio-player">
                <source src="${path}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>`;
        } else if (['mp4'].includes(ext)) {
            modalBody.innerHTML = `<video controls class="video-player">
                <source src="${path}" type="video/mp4">
                Your browser does not support the video element.
            </video>`;
        } else if (['pdf'].includes(ext)) {
            modalBody.innerHTML = `<iframe src="${path}" class="pdf-viewer"></iframe>`;
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
            modalBody.innerHTML = `<img src="${path}" alt="${filename}" class="image-viewer">`;
        } else {
            modalBody.innerHTML = `<div style="text-align: center; padding: 2rem;">
                <i class="fas fa-file" style="font-size: 4rem; color: #667eea; margin-bottom: 1rem;"></i>
                <p>This file type cannot be previewed. Please download it to view.</p>
                <button class="play-btn" onclick="dashboardManager.downloadFile('${path}', '${filename}')">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>`;
        }
        
        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('mediaModal');
        modal.classList.remove('active');
        
        // Stop media playback
        const modalBody = document.getElementById('modalBody');
        const audio = modalBody.querySelector('audio');
        const video = modalBody.querySelector('video');
        if (audio) audio.pause();
        if (video) video.pause();
    }

    downloadFile(path, filename) {
        const link = document.createElement('a');
        link.href = path;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async deleteFile(path, category) {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            // Note: You would need to implement a delete endpoint in Flask
            // For now, we'll just show a message
            this.showError('Delete functionality not yet implemented in backend');
        } catch (error) {
            this.showError(`Failed to delete file: ${error.message}`);
        }
    }

    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid #f5c6cb;
            z-index: 2000;
            max-width: 300px;
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// Initialize dashboard when page loads
let dashboardManager;
document.addEventListener('DOMContentLoaded', () => {
    dashboardManager = new DashboardManager();
});
