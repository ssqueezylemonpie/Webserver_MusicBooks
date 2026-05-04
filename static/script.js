// Jellyfin Web Client JavaScript
class JellyfinClient {
    constructor() {
        this.baseURL = '';
        this.currentView = 'libraries';
        this.currentLibraryId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkConnection();
        this.loadLibraries();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        searchBtn.addEventListener('click', () => this.performSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        // Navigation buttons
        document.getElementById('backBtn').addEventListener('click', () => this.showLibraries());
        document.getElementById('detailsBackBtn').addEventListener('click', () => this.showContent());
    }

    async checkConnection() {
        try {
            const response = await fetch('/jellyfin-info');
            const data = await response.json();
            
            const statusElement = document.getElementById('connectionStatus');
            if (response.ok) {
                statusElement.className = 'connection-status connected';
                statusElement.innerHTML = `
                    <i class="fas fa-circle"></i>
                    <span>Connected to ${data.server_name}</span>
                `;
            } else {
                throw new Error(data.error || 'Connection failed');
            }
        } catch (error) {
            const statusElement = document.getElementById('connectionStatus');
            statusElement.className = 'connection-status disconnected';
            statusElement.innerHTML = `
                <i class="fas fa-circle"></i>
                <span>Disconnected</span>
            `;
        }
    }

    async loadLibraries() {
        const grid = document.getElementById('librariesGrid');
        grid.innerHTML = '<div class="loading">Loading libraries...</div>';

        try {
            const response = await fetch('/libraries');
            const data = await response.json();

            if (response.ok && data.Items) {
                this.renderLibraries(data.Items);
            } else {
                throw new Error(data.error || 'Failed to load libraries');
            }
        } catch (error) {
            grid.innerHTML = `<div class="error">Error loading libraries: ${error.message}</div>`;
        }
    }

    renderLibraries(libraries) {
        const grid = document.getElementById('librariesGrid');
        
        if (libraries.length === 0) {
            grid.innerHTML = '<div class="error">No libraries found</div>';
            return;
        }

        grid.innerHTML = libraries.map(library => {
            const icon = this.getLibraryIcon(library.CollectionType);
            const itemCount = library.ItemCount || 0;
            
            return `
                <div class="library-card" onclick="jellyfinClient.loadLibrary('${library.Id}', '${library.Name}')">
                    <i class="fas ${icon}"></i>
                    <h3>${library.Name}</h3>
                    <p>${itemCount} items</p>
                </div>
            `;
        }).join('');
    }

    getLibraryIcon(collectionType) {
        const icons = {
            'movies': 'fa-film',
            'tvshows': 'fa-tv',
            'music': 'fa-music',
            'books': 'fa-book',
            'photos': 'fa-images',
            'videos': 'fa-video',
            'mixed': 'fa-folder'
        };
        return icons[collectionType] || 'fa-folder';
    }

    async loadLibrary(libraryId, libraryName) {
        this.currentLibraryId = libraryId;
        const grid = document.getElementById('contentGrid');
        const title = document.getElementById('contentTitle');
        
        title.textContent = libraryName;
        grid.innerHTML = '<div class="loading">Loading content...</div>';
        
        this.showView('content');

        try {
            const response = await fetch(`/library/${libraryId}`);
            const data = await response.json();

            if (response.ok && data.Items) {
                this.renderContent(data.Items);
            } else {
                throw new Error(data.error || 'Failed to load content');
            }
        } catch (error) {
            grid.innerHTML = `<div class="error">Error loading content: ${error.message}</div>`;
        }
    }

    renderContent(items) {
        const grid = document.getElementById('contentGrid');
        
        if (items.length === 0) {
            grid.innerHTML = '<div class="error">No items found</div>';
            return;
        }

        grid.innerHTML = items.map(item => {
            const imageUrl = this.getImageUrl(item.ImageTags?.Primary, item.Id, 'Primary');
            const year = item.ProductionYear || '';
            const type = this.getItemTypeDisplay(item.Type);
            
            return `
                <div class="content-item" onclick="jellyfinClient.showItemDetails('${item.Id}')">
                    <img src="${imageUrl}" alt="${item.Name}" onerror="this.style.background='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'">
                    <div class="content-item-info">
                        <h4 title="${item.Name}">${item.Name}</h4>
                        <p>${type}</p>
                        ${year ? `<p class="year">${year}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    async showItemDetails(itemId) {
        const detailsContent = document.getElementById('detailsContent');
        detailsContent.innerHTML = '<div class="loading">Loading details...</div>';
        
        this.showView('details');

        try {
            const response = await fetch(`/item/${itemId}`);
            const item = await response.json();

            if (response.ok) {
                this.renderItemDetails(item);
            } else {
                throw new Error(item.error || 'Failed to load item details');
            }
        } catch (error) {
            detailsContent.innerHTML = `<div class="error">Error loading details: ${error.message}</div>`;
        }
    }

    renderItemDetails(item) {
        const detailsContent = document.getElementById('detailsContent');
        const posterUrl = this.getImageUrl(item.ImageTags?.Primary, item.Id, 'Primary');
        const year = item.ProductionYear || '';
        const runtime = item.RunTimeTicks ? this.formatTicks(item.RunTimeTicks) : '';
        const genres = item.Genres ? item.Genres.slice(0, 3).join(', ') : '';
        const overview = item.Overview || 'No description available.';
        
        detailsContent.innerHTML = `
            <div class="details-poster">
                <img src="${posterUrl}" alt="${item.Name}" onerror="this.style.background='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'">
            </div>
            <div class="details-info">
                <h3>${item.Name}</h3>
                <div class="meta">
                    ${year ? `<span>${year}</span>` : ''}
                    ${runtime ? `<span>• ${runtime}</span>` : ''}
                    ${genres ? `<span>• ${genres}</span>` : ''}
                </div>
                <div class="overview">
                    <p>${overview}</p>
                </div>
                <button class="play-btn" onclick="jellyfinClient.playItem('${item.Id}')">
                    <i class="fas fa-play"></i> Play
                </button>
            </div>
        `;
    }

    async performSearch() {
        const query = document.getElementById('searchInput').value.trim();
        
        if (!query) {
            this.showLibraries();
            return;
        }

        const grid = document.getElementById('searchGrid');
        grid.innerHTML = '<div class="loading">Searching...</div>';
        
        this.showView('search');

        try {
            const response = await fetch(`/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (response.ok && data.Items) {
                this.renderSearchResults(data.Items, query);
            } else {
                throw new Error(data.error || 'Search failed');
            }
        } catch (error) {
            grid.innerHTML = `<div class="error">Search error: ${error.message}</div>`;
        }
    }

    renderSearchResults(items, query) {
        const grid = document.getElementById('searchGrid');
        
        if (items.length === 0) {
            grid.innerHTML = `<div class="error">No results found for "${query}"</div>`;
            return;
        }

        grid.innerHTML = items.map(item => {
            const imageUrl = this.getImageUrl(item.ImageTags?.Primary, item.Id, 'Primary');
            const year = item.ProductionYear || '';
            const type = this.getItemTypeDisplay(item.Type);
            
            return `
                <div class="content-item" onclick="jellyfinClient.showItemDetails('${item.Id}')">
                    <img src="${imageUrl}" alt="${item.Name}" onerror="this.style.background='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'">
                    <div class="content-item-info">
                        <h4 title="${item.Name}">${item.Name}</h4>
                        <p>${type}</p>
                        ${year ? `<p class="year">${year}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    playItem(itemId) {
        // This would typically open Jellyfin's web client or use a video player
        // For now, we'll open the item in a new tab pointing to the Jellyfin server
        window.open(`http://localhost:8096/web/index.html#!/item?id=${itemId}`, '_blank');
    }

    getImageUrl(imageTag, itemId, imageType) {
        if (!imageTag || !itemId) return '';
        return `http://localhost:8096/Items/${itemId}/Images/${imageType}?tag=${imageTag}`;
    }

    getItemTypeDisplay(type) {
        const types = {
            'Movie': 'Movie',
            'Series': 'TV Series',
            'Episode': 'Episode',
            'MusicAlbum': 'Album',
            'MusicArtist': 'Artist',
            'Audio': 'Track',
            'Book': 'Book',
            'Photo': 'Photo',
            'Video': 'Video'
        };
        return types[type] || type;
    }

    formatTicks(ticks) {
        const seconds = Math.floor(ticks / 10000000);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    showView(viewName) {
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.style.display = 'none';
        });

        // Show the requested section
        switch(viewName) {
            case 'libraries':
                document.querySelector('.libraries-section').style.display = 'block';
                break;
            case 'content':
                document.querySelector('.content-section').style.display = 'block';
                break;
            case 'search':
                document.querySelector('.search-results').style.display = 'block';
                break;
            case 'details':
                document.querySelector('.item-details').style.display = 'block';
                break;
        }

        this.currentView = viewName;
    }

    showLibraries() {
        this.showView('libraries');
        document.getElementById('searchInput').value = '';
    }

    showContent() {
        if (this.currentLibraryId) {
            this.showView('content');
        } else {
            this.showLibraries();
        }
    }
}

// Initialize the client when the page loads
let jellyfinClient;
document.addEventListener('DOMContentLoaded', () => {
    jellyfinClient = new JellyfinClient();
});
