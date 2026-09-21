/**
 * MOVIE MANAGEMENT SYSTEM - Client-side Application
 * Pure JavaScript (ES6+), Zero TypeScript.
 * Handles full CRUD operations, real-time search, multi-criteria filtering,
 * sorting, modal controllers, favourites toggling, and fallback poster synthesis.
 */

// Global State
const state = {
  movies: [],
  searchQuery: '',
  selectedGenre: 'all',
  sortBy: 'rating-desc',
  filterTab: 'all', // 'all' | 'favourites'
  viewMode: 'grid', // 'grid' | 'list'
  editingMovieId: null,
  deletingMovieId: null,
  viewingMovieId: null,
  // New features state
  theme: localStorage.getItem('mms_theme') || 'dark',
  advancedSearchOpen: false,
  advancedFilters: {
    title: '',
    actor: '',
    genre: 'all',
    language: 'all',
    minYear: '',
    maxYear: ''
  },
  posterUploadMode: 'upload', // 'upload' | 'url'
  uploadedPosterUrl: '',
  isListening: false
};

// Fallback seed data in case backend is offline or loading first time
const FALLBACK_SEED = [
  {
    id: "mov-1",
    title: "Interstellar",
    genre: "Sci-Fi",
    language: "English",
    releaseYear: 2014,
    rating: 8.7,
    duration: "169 min",
    description: "A team of explorers travels through a wormhole in space in search of a new home for humanity.",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    favourite: false,
    streamingPlatform: "Paramount+",
    streamingUrl: "https://www.paramountplus.com/movies/interstellar/"
  },
  {
    id: "mov-2",
    title: "Inception",
    genre: "Sci-Fi",
    language: "English",
    releaseYear: 2010,
    rating: 8.8,
    duration: "148 min",
    description: "A skilled extractor who steals secrets through dreams is given a chance to erase his past.",
    poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    favourite: true,
    streamingPlatform: "Netflix",
    streamingUrl: "https://www.netflix.com/title/70131314"
  },
  {
    id: "mov-3",
    title: "The Dark Knight",
    genre: "Action",
    language: "English",
    releaseYear: 2008,
    rating: 9.0,
    duration: "152 min",
    description: "Batman faces a criminal mastermind who pushes Gotham into chaos.",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    favourite: true,
    streamingPlatform: "Max",
    streamingUrl: "https://www.max.com/movies/dark-knight/67c8be57-f64e-4f0f-8f81-2292f759c2bb"
  },
  {
    id: "mov-4",
    title: "Avengers: Endgame",
    genre: "Action",
    language: "English",
    releaseYear: 2019,
    rating: 8.4,
    duration: "181 min",
    description: "The Avengers attempt to reverse the devastating events that changed the universe.",
    poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    favourite: false,
    streamingPlatform: "Disney+",
    streamingUrl: "https://www.disneyplus.com/movies/marvel-studios-avengers-endgame/aRbVJUb2m9Rf"
  },
  {
    id: "mov-5",
    title: "Dune: Part Two",
    genre: "Sci-Fi",
    language: "English",
    releaseYear: 2024,
    rating: 8.5,
    duration: "166 min",
    description: "Paul Atreides joins Chani and the Fremen while seeking revenge against those who destroyed his family.",
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    favourite: false,
    streamingPlatform: "Max",
    streamingUrl: "https://www.max.com/movies/dune-part-two/7d92842d-2092-4fcf-847e-a0e28f37eb9a"
  },
  {
    id: "mov-6",
    title: "Parasite",
    genre: "Thriller",
    language: "Korean",
    releaseYear: 2019,
    rating: 8.5,
    duration: "132 min",
    description: "A struggling family gradually becomes involved with a wealthy household.",
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    favourite: false,
    streamingPlatform: "Max",
    streamingUrl: "https://www.max.com/movies/parasite/0e909e73-b3c9-4a94-ba5f-b5dc43346d5c"
  },
  {
    id: "mov-7",
    title: "3 Idiots",
    genre: "Comedy",
    language: "Hindi",
    releaseYear: 2009,
    rating: 8.4,
    duration: "170 min",
    description: "Three engineering students navigate friendship, pressure and expectations while searching for their own paths.",
    poster: "/posters/3-idiots.jpg",
    favourite: true,
    streamingPlatform: "Netflix",
    streamingUrl: "https://www.netflix.com/title/70121522"
  },
  {
    id: "mov-8",
    title: "RRR",
    genre: "Action",
    language: "Telugu",
    releaseYear: 2022,
    rating: 7.8,
    duration: "182 min",
    description: "Two revolutionaries form an extraordinary friendship while fighting against oppression.",
    poster: "/posters/rrr.jpg",
    favourite: false,
    streamingPlatform: "Netflix",
    streamingUrl: "https://www.netflix.com/title/81476453"
  },
  {
    id: "mov-9",
    title: "KGF: Chapter 2",
    genre: "Action",
    language: "Kannada",
    releaseYear: 2022,
    rating: 8.3,
    duration: "168 min",
    description: "Rocky continues his rise while facing powerful enemies determined to destroy his empire.",
    poster: "https://image.tmdb.org/t/p/w500/khNVygolU0TxLIDWff5tQlAhZ23.jpg",
    favourite: false,
    streamingPlatform: "Prime Video",
    streamingUrl: "https://www.primevideo.com/detail/KGF-Chapter-2/0H3D9DYY9OD8X4V6M5V23I4O5V"
  },
  {
    id: "mov-10",
    title: "Baahubali 2: The Conclusion",
    genre: "Action",
    language: "Telugu",
    releaseYear: 2017,
    rating: 8.2,
    duration: "167 min",
    description: "Mahendra Baahubali discovers the truth about his family and seeks to reclaim his kingdom.",
    poster: "/posters/baahubali-2.jpg",
    favourite: false,
    streamingPlatform: "Netflix",
    streamingUrl: "https://www.netflix.com/title/80203996"
  },
  {
    id: "mov-11",
    title: "The Shawshank Redemption",
    genre: "Drama",
    language: "English",
    releaseYear: 1994,
    rating: 9.3,
    duration: "142 min",
    description: "A banker sentenced to prison forms an unlikely friendship and quietly holds onto hope.",
    poster: "/posters/the-shawshank-redemption.jpg",
    favourite: true,
    streamingPlatform: "Max",
    streamingUrl: "https://www.max.com/movies/shawshank-redemption/84d26dc6-d4f1-4770-985a-0d85ec157a3e"
  },
  {
    id: "mov-12",
    title: "Forrest Gump",
    genre: "Drama",
    language: "English",
    releaseYear: 1994,
    rating: 8.8,
    duration: "142 min",
    description: "A kind-hearted man experiences remarkable moments across several decades of American history.",
    poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    favourite: false,
    streamingPlatform: "Paramount+",
    streamingUrl: "https://www.paramountplus.com/movies/forrest-gump/"
  },
  {
    id: "mov-13",
    title: "Spider-Man: No Way Home",
    genre: "Action",
    language: "English",
    releaseYear: 2021,
    rating: 8.2,
    duration: "148 min",
    description: "Spider-Man faces dangerous consequences after his identity becomes public.",
    poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    favourite: false,
    streamingPlatform: "Netflix",
    streamingUrl: "https://www.netflix.com/title/81436447"
  },
  {
    id: "mov-14",
    title: "The Matrix",
    genre: "Sci-Fi",
    language: "English",
    releaseYear: 1999,
    rating: 8.7,
    duration: "136 min",
    description: "A hacker discovers that reality is not what it appears to be.",
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    favourite: false,
    streamingPlatform: "Max",
    streamingUrl: "https://www.max.com/movies/matrix/d76503c5-9276-47bf-939e-4c7b8c8d2bb2"
  },
  {
    id: "mov-15",
    title: "Joker",
    genre: "Crime",
    language: "English",
    releaseYear: 2019,
    rating: 8.3,
    duration: "122 min",
    description: "A troubled comedian's life takes a dark turn as he becomes a symbol of chaos.",
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    favourite: false,
    streamingPlatform: "Max",
    streamingUrl: "https://www.max.com/movies/joker/1328325a-9a99-4d64-8fb3-e6593a19dc1d"
  },
  {
    id: "mov-16",
    title: "Top Gun: Maverick",
    genre: "Action",
    language: "English",
    releaseYear: 2022,
    rating: 8.2,
    duration: "131 min",
    description: "A veteran pilot trains a new generation of elite aviators for a dangerous mission.",
    poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    favourite: false,
    streamingPlatform: "Paramount+",
    streamingUrl: "https://www.paramountplus.com/movies/top-gun-maverick/"
  },
  {
    id: "mov-17",
    title: "Avatar",
    genre: "Adventure",
    language: "English",
    releaseYear: 2009,
    rating: 7.9,
    duration: "162 min",
    description: "A former Marine becomes involved in the conflict between humans and the inhabitants of Pandora.",
    poster: "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    favourite: false,
    streamingPlatform: "Disney+",
    streamingUrl: "https://www.disneyplus.com/movies/avatar/2MCWeGlXsqAe"
  },
  {
    id: "mov-18",
    title: "Toy Story",
    genre: "Animation",
    language: "English",
    releaseYear: 1995,
    rating: 8.3,
    duration: "81 min",
    description: "A group of toys comes to life when their owner is away.",
    poster: "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
    favourite: false,
    streamingPlatform: "Disney+",
    streamingUrl: "https://www.disneyplus.com/movies/toy-story/6v0mXF8p2o7B"
  },
  {
    id: "mov-19",
    title: "The Prestige",
    genre: "Thriller",
    language: "English",
    releaseYear: 2006,
    rating: 8.5,
    duration: "130 min",
    description: "Two rival magicians become obsessed with creating the ultimate illusion.",
    poster: "/posters/the-prestige.jpg",
    favourite: false,
    streamingPlatform: "Apple TV",
    streamingUrl: "https://tv.apple.com/us/movie/the-prestige/umc.cmc.2c6s5s3u5t3r8w5y"
  },
  {
    id: "mov-20",
    title: "Whiplash",
    genre: "Drama",
    language: "English",
    releaseYear: 2014,
    rating: 8.5,
    duration: "106 min",
    description: "An ambitious young drummer faces an intense instructor who demands extraordinary performance.",
    poster: "/posters/whiplash.jpg",
    favourite: false,
    streamingPlatform: "Netflix",
    streamingUrl: "https://www.netflix.com/title/70299275"
  }
];

// Available standard genres
const POPULAR_GENRES = [
  'Action',
  'Sci-Fi',
  'Drama',
  'Thriller',
  'Comedy',
  'Adventure',
  'Animation',
  'Crime'
];

/**
 * Generates an SVG Data URI poster when a remote image fails or is unavailable.
 * This ensures no movie card ever shows a broken image icon.
 */
function createFallbackPoster(title, genre, year) {
  const safeTitle = (title || 'Movie').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeGenre = (genre || 'Cinema').replace(/&/g, '&amp;');
  const safeYear = year || '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 750" width="100%" height="100%">
    <defs>
      <linearGradient id="posterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="50%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#090d16"/>
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#e50914"/>
      </linearGradient>
    </defs>
    <rect width="500" height="750" fill="url(#posterGrad)"/>
    <circle cx="250" cy="240" r="110" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
    <circle cx="250" cy="240" r="80" fill="rgba(245,158,11,0.08)"/>
    
    <!-- Film Slate / Clapperboard Icon -->
    <path d="M210 200 L290 200 L280 280 L200 280 Z" fill="none" stroke="#f59e0b" stroke-width="4" stroke-linejoin="round"/>
    <line x1="225" y1="200" x2="220" y2="280" stroke="#f59e0b" stroke-width="3"/>
    <line x1="250" y1="200" x2="245" y2="280" stroke="#f59e0b" stroke-width="3"/>
    <line x1="275" y1="200" x2="270" y2="280" stroke="#f59e0b" stroke-width="3"/>
    <polygon points="235,225 235,255 265,240" fill="#fff"/>

    <!-- Accent strip -->
    <rect x="50" y="440" width="400" height="3" fill="url(#accentGrad)"/>
    
    <!-- Title and Metadata text -->
    <text x="250" y="485" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">
      ${safeTitle.length > 22 ? safeTitle.substring(0, 20) + '...' : safeTitle}
    </text>
    <text x="250" y="525" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" font-weight="600" fill="#f59e0b" text-anchor="middle" letter-spacing="2">
      ${safeGenre.toUpperCase()} ${safeYear ? '• ' + safeYear : ''}
    </text>
    <text x="250" y="690" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" fill="#64748b" text-anchor="middle" letter-spacing="3">
      CINEMA COLLECTION
    </text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Global Image Error Handler registered for dynamic cards
window.handlePosterError = function(imgElement, title, genre, year) {
  imgElement.onerror = null; // Prevent loop
  imgElement.src = createFallbackPoster(title, genre, year);
};

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  }

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3200);
}

// ==========================================================================
// DATA PERSISTENCE & API COMMUNICATION
// ==========================================================================
async function fetchMovies() {
  try {
    const res = await fetch('/api/movies');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      state.movies = data;
      localStorage.setItem('mms_movies', JSON.stringify(data));
      renderApp();
      return;
    }
  } catch (err) {
    console.warn('API fetch failed or offline, loading from localStorage fallback:', err);
  }

  // Fallback to localStorage
  const localData = localStorage.getItem('mms_movies');
  if (localData) {
    try {
      state.movies = JSON.parse(localData);
      renderApp();
      return;
    } catch (e) {
      console.error('Invalid localStorage data', e);
    }
  }

  // Last resort: Seed
  state.movies = [...FALLBACK_SEED];
  localStorage.setItem('mms_movies', JSON.stringify(FALLBACK_SEED));
  renderApp();
}

function syncLocalStorage() {
  try {
    localStorage.setItem('mms_movies', JSON.stringify(state.movies));
  } catch (e) {
    console.error('Failed to sync to localStorage:', e);
  }
}

// ==========================================================================
// CRUD OPERATIONS
// ==========================================================================

// Add Movie
async function handleCreateMovie(formData) {
  try {
    const res = await fetch('/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    let created;
    if (res.ok) {
      created = await res.json();
    } else {
      // Local creation fallback
      created = {
        ...formData,
        id: `mov-${Date.now()}`,
        favourite: Boolean(formData.favourite)
      };
    }

    state.movies.unshift(created);
    syncLocalStorage();
    closeAllModals();
    renderApp();
    showToast(`"${created.title}" added to catalog!`, 'success');
  } catch (err) {
    console.error('Error creating movie:', err);
    // Offline add
    const created = {
      ...formData,
      id: `mov-${Date.now()}`,
      favourite: Boolean(formData.favourite)
    };
    state.movies.unshift(created);
    syncLocalStorage();
    closeAllModals();
    renderApp();
    showToast(`"${created.title}" added (offline saved)!`, 'success');
  }
}

// Update Movie
async function handleUpdateMovie(id, formData) {
  try {
    const res = await fetch(`/api/movies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    let updated;
    if (res.ok) {
      updated = await res.json();
    } else {
      const idx = state.movies.findIndex(m => String(m.id) === String(id));
      if (idx !== -1) {
        updated = { ...state.movies[idx], ...formData };
      }
    }

    if (updated) {
      const idx = state.movies.findIndex(m => String(m.id) === String(id));
      if (idx !== -1) {
        state.movies[idx] = updated;
      }
    }

    syncLocalStorage();
    closeAllModals();
    renderApp();
    showToast(`"${formData.title}" updated successfully!`, 'success');

    // If details modal was open for this movie, refresh details
    if (state.viewingMovieId === id) {
      openDetailsModal(id);
    }
  } catch (err) {
    console.error('Error updating movie:', err);
    const idx = state.movies.findIndex(m => String(m.id) === String(id));
    if (idx !== -1) {
      state.movies[idx] = { ...state.movies[idx], ...formData };
      syncLocalStorage();
      closeAllModals();
      renderApp();
      showToast(`"${formData.title}" updated (offline saved)!`, 'success');
    }
  }
}

// Delete Movie
async function handleDeleteMovie(id) {
  const movieToDelete = state.movies.find(m => String(m.id) === String(id));
  const movieTitle = movieToDelete ? movieToDelete.title : 'Movie';

  try {
    await fetch(`/api/movies/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('API delete error, proceeding with local deletion:', err);
  }

  state.movies = state.movies.filter(m => String(m.id) !== String(id));
  syncLocalStorage();
  closeAllModals();
  renderApp();
  showToast(`"${movieTitle}" was deleted.`, 'error');
}

// Toggle Favourite
async function handleToggleFavourite(id, event) {
  if (event) {
    event.stopPropagation();
  }

  const movie = state.movies.find(m => String(m.id) === String(id));
  if (!movie) return;

  const newStatus = !movie.favourite;
  movie.favourite = newStatus;
  syncLocalStorage();
  renderApp();

  // If details modal is open, update details modal favourite button state
  updateDetailsModalFavButton(newStatus);

  showToast(
    newStatus ? `Added "${movie.title}" to Favourites!` : `Removed "${movie.title}" from Favourites`,
    newStatus ? 'info' : 'info'
  );

  // Send update to server in background
  try {
    await fetch(`/api/movies/${id}/favourite`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favourite: newStatus })
    });
  } catch (err) {
    console.warn('Backend favourite sync error:', err);
  }
}

// Reset Database to Seed 20
async function handleResetData() {
  if (!confirm('Are you sure you want to reset all movies back to the initial 20 seed movies? Any custom additions or edits will be reset.')) {
    return;
  }

  try {
    const res = await fetch('/api/movies/reset', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      state.movies = data.movies;
    } else {
      state.movies = [...FALLBACK_SEED];
    }
  } catch (err) {
    state.movies = [...FALLBACK_SEED];
  }

  syncLocalStorage();
  state.searchQuery = '';
  state.selectedGenre = 'all';
  state.filterTab = 'all';
  document.getElementById('headerSearchInput').value = '';
  document.getElementById('genreSelect').value = 'all';
  document.getElementById('sortSelect').value = 'rating-desc';
  document.getElementById('clearSearchBtn').classList.remove('active');
  
  renderApp();
  showToast('Database reset to initial 20 seed movies!', 'success');
}

// ==========================================================================
// SEARCH, FILTER, AND SORT LOGIC
// ==========================================================================
function getFilteredAndSortedMovies() {
  let list = [...state.movies];

  // 1. Dynamic / Voice Search Query (Searches title, actors, genre, language)
  if (state.searchQuery && state.searchQuery.trim() !== '') {
    const q = state.searchQuery.trim().toLowerCase();
    list = list.filter(m => {
      const matchTitle = m.title && m.title.toLowerCase().includes(q);
      const matchActors = m.actors && m.actors.toLowerCase().includes(q);
      const matchGenre = m.genre && m.genre.toLowerCase().includes(q);
      const matchLang = m.language && m.language.toLowerCase().includes(q);
      return matchTitle || matchActors || matchGenre || matchLang;
    });
  }

  // 2. Multi-Criteria Advanced Search Filters
  const adv = state.advancedFilters;
  if (adv) {
    // Advanced: Title
    if (adv.title && adv.title.trim() !== '') {
      const t = adv.title.trim().toLowerCase();
      list = list.filter(m => m.title && m.title.toLowerCase().includes(t));
    }

    // Advanced: Actor / Cast
    if (adv.actor && adv.actor.trim() !== '') {
      const a = adv.actor.trim().toLowerCase();
      list = list.filter(m => m.actors && m.actors.toLowerCase().includes(a));
    }

    // Advanced: Genre
    if (adv.genre && adv.genre !== 'all') {
      const g = adv.genre.toLowerCase();
      list = list.filter(m => m.genre && m.genre.toLowerCase() === g);
    }

    // Advanced: Language
    if (adv.language && adv.language !== 'all') {
      const l = adv.language.toLowerCase();
      list = list.filter(m => m.language && m.language.toLowerCase() === l);
    }

    // Advanced: Year Range
    if (adv.minYear && !isNaN(Number(adv.minYear))) {
      list = list.filter(m => Number(m.releaseYear) >= Number(adv.minYear));
    }
    if (adv.maxYear && !isNaN(Number(adv.maxYear))) {
      list = list.filter(m => Number(m.releaseYear) <= Number(adv.maxYear));
    }
  }

  // 3. Genre Dropdown Filter (Toolbar)
  if (state.selectedGenre && state.selectedGenre !== 'all') {
    const g = state.selectedGenre.toLowerCase();
    list = list.filter(m => m.genre && m.genre.toLowerCase() === g);
  }

  // 4. Tab Filter (All vs Favourites)
  if (state.filterTab === 'favourites') {
    list = list.filter(m => m.favourite === true);
  }

  // 5. Sorting
  if (state.sortBy === 'rating-desc') {
    list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
  } else if (state.sortBy === 'rating-asc') {
    list.sort((a, b) => (Number(a.rating) || 0) - (Number(b.rating) || 0));
  } else if (state.sortBy === 'year-desc') {
    list.sort((a, b) => (Number(b.releaseYear) || 0) - (Number(a.releaseYear) || 0));
  } else if (state.sortBy === 'year-asc') {
    list.sort((a, b) => (Number(a.releaseYear) || 0) - (Number(b.releaseYear) || 0));
  } else if (state.sortBy === 'title-asc') {
    list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  }

  return list;
}

// ==========================================================================
// DOM RENDERING
// ==========================================================================
function renderApp() {
  const filtered = getFilteredAndSortedMovies();
  renderCounters();
  renderActiveFilters(filtered.length);
  renderMovieGrid(filtered);
}

function renderCounters() {
  const total = state.movies.length;
  const favs = state.movies.filter(m => m.favourite).length;

  const totalCountEl = document.getElementById('statTotalMovies');
  if (totalCountEl) totalCountEl.textContent = total;

  const favCountEl = document.getElementById('statFavMovies');
  if (favCountEl) favCountEl.textContent = favs;

  const tabAllCount = document.getElementById('tabAllCount');
  if (tabAllCount) tabAllCount.textContent = total;

  const tabFavCount = document.getElementById('tabFavCount');
  if (tabFavCount) tabFavCount.textContent = favs;
}

function renderActiveFilters(matchCount) {
  const summaryEl = document.getElementById('filterSummaryText');
  const tagsContainer = document.getElementById('activeFilterTags');
  if (!summaryEl || !tagsContainer) return;

  summaryEl.textContent = `Showing ${matchCount} of ${state.movies.length} movies`;

  let tagsHtml = '';

  if (state.searchQuery) {
    tagsHtml += `
      <span class="active-tag">
        Search: "${escapeHtml(state.searchQuery)}"
        <button onclick="clearSearchFilter()" title="Remove search filter">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </span>
    `;
  }

  // Advanced Search Active Tags
  const adv = state.advancedFilters;
  if (adv) {
    if (adv.title) {
      tagsHtml += `
        <span class="active-tag">
          Adv Title: "${escapeHtml(adv.title)}"
          <button onclick="clearSingleAdvFilter('title')" title="Remove title filter">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </span>
      `;
    }
    if (adv.actor) {
      tagsHtml += `
        <span class="active-tag">
          Actor: "${escapeHtml(adv.actor)}"
          <button onclick="clearSingleAdvFilter('actor')" title="Remove actor filter">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </span>
      `;
    }
    if (adv.genre && adv.genre !== 'all') {
      tagsHtml += `
        <span class="active-tag">
          Adv Genre: ${escapeHtml(adv.genre)}
          <button onclick="clearSingleAdvFilter('genre')" title="Remove genre filter">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </span>
      `;
    }
    if (adv.language && adv.language !== 'all') {
      tagsHtml += `
        <span class="active-tag">
          Language: ${escapeHtml(adv.language)}
          <button onclick="clearSingleAdvFilter('language')" title="Remove language filter">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </span>
      `;
    }
    if (adv.minYear || adv.maxYear) {
      const yearLabel = adv.minYear && adv.maxYear 
        ? `${adv.minYear} - ${adv.maxYear}` 
        : (adv.minYear ? `≥ ${adv.minYear}` : `≤ ${adv.maxYear}`);
      tagsHtml += `
        <span class="active-tag">
          Years: ${yearLabel}
          <button onclick="clearSingleAdvFilter('year')" title="Remove year filter">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </span>
      `;
    }
  }

  if (state.selectedGenre !== 'all') {
    tagsHtml += `
      <span class="active-tag">
        Genre: ${escapeHtml(state.selectedGenre)}
        <button onclick="clearGenreFilter()" title="Remove genre filter">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </span>
    `;
  }

  if (state.filterTab === 'favourites') {
    tagsHtml += `
      <span class="active-tag">
        ⭐ Favourites Only
        <button onclick="setFilterTab('all')" title="Show all movies">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </span>
    `;
  }

  tagsContainer.innerHTML = tagsHtml;
}

function renderMovieGrid(movies) {
  const gridContainer = document.getElementById('movieGrid');
  const emptyState = document.getElementById('emptyState');
  if (!gridContainer || !emptyState) return;

  if (movies.length === 0) {
    gridContainer.style.display = 'none';
    emptyState.style.display = 'flex';
    return;
  }

  emptyState.style.display = 'none';
  gridContainer.style.display = 'grid';

  // Toggle list/grid view class
  if (state.viewMode === 'list') {
    gridContainer.classList.add('list-view');
  } else {
    gridContainer.classList.remove('list-view');
  }

  gridContainer.innerHTML = movies.map(movie => createMovieCardHtml(movie)).join('');
}

function getPlatformClass(platform) {
  if (!platform) return 'platform-default';
  const p = String(platform).toLowerCase();
  if (p.includes('netflix')) return 'platform-netflix';
  if (p.includes('prime') || p.includes('amazon')) return 'platform-prime';
  if (p.includes('disney')) return 'platform-disney';
  if (p.includes('max') || p.includes('hbo')) return 'platform-max';
  if (p.includes('paramount')) return 'platform-paramount';
  if (p.includes('apple')) return 'platform-appletv';
  if (p.includes('peacock')) return 'platform-peacock';
  if (p.includes('youtube')) return 'platform-youtube';
  if (p.includes('hulu')) return 'platform-hulu';
  return 'platform-default';
}

function createMovieCardHtml(movie) {
  const isFav = Boolean(movie.favourite);
  const ratingFormatted = Number(movie.rating || 0).toFixed(1);
  const safeTitle = escapeHtml(movie.title);
  const safeGenre = escapeHtml(movie.genre);
  const safeLang = escapeHtml(movie.language);
  const safeYear = escapeHtml(String(movie.releaseYear));
  const safeDuration = escapeHtml(movie.duration);
  const platform = movie.streamingPlatform || 'Streaming';
  const safePlatform = escapeHtml(platform);
  const platformClass = getPlatformClass(platform);

  // Direct redirection URL to respective streaming platform (if provided)
  const hasStreamUrl = Boolean(movie.streamingUrl && movie.streamingUrl.trim());
  const streamUrl = hasStreamUrl ? escapeHtml(movie.streamingUrl.trim()) : '';

  // Setup poster and fallback handler
  const posterUrl = movie.poster && movie.poster.trim() 
    ? escapeHtml(movie.poster) 
    : createFallbackPoster(movie.title, movie.genre, movie.releaseYear);

  return `
    <article class="movie-card" id="card-${movie.id}">
      <div class="movie-poster-container" onclick="openDetailsModal('${movie.id}')">
        <img 
          src="${posterUrl}" 
          alt="${safeTitle} Poster" 
          class="movie-poster-img"
          loading="lazy"
          onerror="window.handlePosterError(this, '${escapeAttr(movie.title)}', '${escapeAttr(movie.genre)}', '${escapeAttr(String(movie.releaseYear))}')"
        />
        <div class="poster-gradient"></div>

        <div class="rating-badge" title="IMDb / Audience Rating">
          <svg class="star-icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <span>${ratingFormatted}</span>
        </div>

        ${hasStreamUrl ? `
        <!-- Floating Streaming Pill on Poster -->
        <a 
          href="${streamUrl}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="poster-stream-pill ${platformClass}" 
          onclick="event.stopPropagation();"
          title="Watch ${safeTitle} on ${safePlatform} (Opens in new tab)"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>${safePlatform}</span>
        </a>
        ` : ''}

        <button 
          type="button" 
          class="favourite-btn ${isFav ? 'active' : ''}" 
          id="fav-btn-${movie.id}"
          title="${isFav ? 'Remove from Favourites' : 'Mark as Favourite'}"
          onclick="handleToggleFavourite('${movie.id}', event)"
          aria-label="${isFav ? 'Remove from Favourites' : 'Mark as Favourite'}"
        >
          <svg class="heart-icon" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div class="movie-info-body">
        <div class="card-main-meta">
          <div class="card-tags">
            <span class="badge-genre">${safeGenre}</span>
            <span class="badge-lang">${safeLang}</span>
            <span class="badge-platform ${platformClass}" title="Available on ${safePlatform}">${safePlatform}</span>
          </div>

          <h3 class="movie-title" onclick="openDetailsModal('${movie.id}')" title="${safeTitle}">
            ${safeTitle}
          </h3>

          ${movie.actors ? `
          <div class="card-actors-snippet" title="Starring: ${escapeAttr(movie.actors)}">
            <strong>Cast:</strong> ${escapeHtml(movie.actors)}
          </div>
          ` : ''}

          <div class="movie-meta">
            <span>${safeYear}</span>
            <span class="separator">•</span>
            <span>${safeDuration}</span>
          </div>
        </div>

        <div class="card-actions">
          ${hasStreamUrl ? `
          <!-- Watch / Stream Redirection Link -->
          <a 
            href="${streamUrl}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="btn-card-action btn-stream" 
            onclick="event.stopPropagation();"
            title="Redirect to watch ${safeTitle} on ${safePlatform}"
          >
            <svg class="play-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span>Watch</span>
            <svg class="ext-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
          ` : ''}

          <button 
            type="button" 
            class="btn-card-action btn-view" 
            onclick="openDetailsModal('${movie.id}')"
            title="View full movie details"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <span>Details</span>
          </button>

          <button 
            type="button" 
            class="btn-icon-only btn-edit" 
            onclick="openEditModal('${movie.id}', event)"
            title="Edit movie"
            aria-label="Edit movie"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>

          <button 
            type="button" 
            class="btn-icon-only btn-delete" 
            onclick="openDeleteModal('${movie.id}', event)"
            title="Delete movie"
            aria-label="Delete movie"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

// ==========================================================================
// MODAL CONTROLLERS
// ==========================================================================

function openAddModal() {
  state.editingMovieId = null;
  const modal = document.getElementById('movieFormModal');
  const titleEl = document.getElementById('formModalTitle');
  const submitBtn = document.getElementById('movieFormSubmitBtn');
  const form = document.getElementById('movieForm');

  if (!modal || !form) return;

  form.reset();
  clearFormErrors();

  titleEl.textContent = 'Add New Movie';
  submitBtn.textContent = 'Save Movie';

  // Set default streaming fields
  const platformInput = document.getElementById('moviePlatformInput');
  if (platformInput) platformInput.value = 'Netflix';
  const streamUrlInput = document.getElementById('movieStreamUrlInput');
  if (streamUrlInput) streamUrlInput.value = '';

  // Reset poster upload state
  state.uploadedPosterUrl = '';
  setPosterUploadMode('upload');
  const fileInput = document.getElementById('moviePosterFileInput');
  if (fileInput) fileInput.value = '';
  const removeBtn = document.getElementById('posterRemoveBtn');
  if (removeBtn) removeBtn.style.display = 'none';

  const actorsInput = document.getElementById('movieActorsInput');
  if (actorsInput) actorsInput.value = '';

  // Set default poster preview
  updatePosterPreview('');

  modal.classList.add('open');
  document.getElementById('movieTitleInput').focus();
}

function openEditModal(id, event) {
  if (event) event.stopPropagation();

  const movie = state.movies.find(m => String(m.id) === String(id));
  if (!movie) return;

  state.editingMovieId = id;
  const modal = document.getElementById('movieFormModal');
  const titleEl = document.getElementById('formModalTitle');
  const submitBtn = document.getElementById('movieFormSubmitBtn');

  if (!modal) return;

  clearFormErrors();

  titleEl.textContent = `Edit Movie: ${movie.title}`;
  submitBtn.textContent = 'Update Movie';

  document.getElementById('movieTitleInput').value = movie.title || '';
  document.getElementById('movieGenreInput').value = movie.genre || '';
  document.getElementById('movieLangInput').value = movie.language || '';
  document.getElementById('movieYearInput').value = movie.releaseYear || '';
  document.getElementById('movieRatingInput').value = movie.rating !== undefined ? movie.rating : '';
  document.getElementById('movieDurationInput').value = movie.duration || '';
  document.getElementById('movieDescInput').value = movie.description || '';
  document.getElementById('moviePosterInput').value = movie.poster || '';
  document.getElementById('movieFavInput').checked = Boolean(movie.favourite);

  // Set actors
  const actorsInput = document.getElementById('movieActorsInput');
  if (actorsInput) actorsInput.value = movie.actors || '';

  // Set poster mode
  state.uploadedPosterUrl = movie.poster || '';
  if (movie.poster && movie.poster.startsWith('/uploads/')) {
    setPosterUploadMode('upload');
  } else if (movie.poster && movie.poster.startsWith('http')) {
    setPosterUploadMode('url');
  } else {
    setPosterUploadMode('upload');
  }

  const removeBtn = document.getElementById('posterRemoveBtn');
  if (removeBtn) removeBtn.style.display = movie.poster ? 'flex' : 'none';

  // Set streaming fields
  const platformInput = document.getElementById('moviePlatformInput');
  if (platformInput) platformInput.value = movie.streamingPlatform || 'Netflix';
  const streamUrlInput = document.getElementById('movieStreamUrlInput');
  if (streamUrlInput) streamUrlInput.value = movie.streamingUrl || '';

  updatePosterPreview(movie.poster, movie.title, movie.genre, movie.releaseYear);

  modal.classList.add('open');
  document.getElementById('movieTitleInput').focus();
}

function openDetailsModal(id) {
  const movie = state.movies.find(m => String(m.id) === String(id));
  if (!movie) return;

  state.viewingMovieId = id;
  const modal = document.getElementById('movieDetailsModal');
  if (!modal) return;

  document.getElementById('detailsMovieTitle').textContent = movie.title;
  document.getElementById('detailsMovieGenre').textContent = movie.genre;
  document.getElementById('detailsMovieLang').textContent = movie.language;
  document.getElementById('detailsMovieYear').textContent = movie.releaseYear;
  document.getElementById('detailsMovieDuration').textContent = movie.duration;
  document.getElementById('detailsMovieRating').textContent = Number(movie.rating || 0).toFixed(1);
  document.getElementById('detailsMovieDesc').textContent = movie.description;

  // Starring Cast
  const actorsEl = document.getElementById('detailsMovieActors');
  if (actorsEl) {
    actorsEl.textContent = movie.actors && movie.actors.trim() ? movie.actors : 'Ensemble Cast';
  }

  // Streaming platform badge, name, and redirection URL
  const platform = movie.streamingPlatform ? movie.streamingPlatform.trim() : 'Streaming';
  const platformClass = getPlatformClass(platform);
  const streamUrl = movie.streamingUrl ? String(movie.streamingUrl).trim() : '';
  const hasStreamingUrl = Boolean(streamUrl);

  const platformBadge = document.getElementById('detailsMoviePlatformBadge');
  if (platformBadge) {
    if (movie.streamingPlatform && movie.streamingPlatform.trim()) {
      platformBadge.style.display = 'inline-flex';
      platformBadge.textContent = platform;
      platformBadge.className = `badge-platform ${platformClass}`;
    } else {
      platformBadge.style.display = 'none';
    }
  }

  const platformNameEl = document.getElementById('detailsMoviePlatformName');
  if (platformNameEl) {
    platformNameEl.textContent = platform || 'Not specified';
  }

  // Gracefully handle 'Streaming Redirection' section:
  // Hide the section if no URL is provided for the movie
  const streamingCard = document.getElementById('detailsStreamingCard');
  if (streamingCard) {
    if (hasStreamingUrl) {
      streamingCard.style.display = 'flex';

      const platformHighlight = document.getElementById('detailsStreamPlatformHighlight');
      if (platformHighlight) {
        platformHighlight.textContent = platform;
      }

      const watchBtn = document.getElementById('detailsWatchRedirectBtn');
      if (watchBtn) {
        watchBtn.href = streamUrl;
        watchBtn.setAttribute('title', `Watch ${movie.title} on ${platform} (Opens in new tab)`);
      }
    } else {
      streamingCard.style.display = 'none';
    }
  }

  const posterImg = document.getElementById('detailsMoviePoster');
  posterImg.src = movie.poster && movie.poster.trim()
    ? movie.poster
    : createFallbackPoster(movie.title, movie.genre, movie.releaseYear);

  posterImg.onerror = function() {
    this.onerror = null;
    this.src = createFallbackPoster(movie.title, movie.genre, movie.releaseYear);
  };

  // Configure action buttons in details modal
  const favBtn = document.getElementById('detailsFavBtn');
  favBtn.className = `btn btn-secondary ${movie.favourite ? 'active' : ''}`;
  favBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="${movie.favourite ? '#e50914' : 'none'}" stroke="${movie.favourite ? '#e50914' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
    <span>${movie.favourite ? 'Favourited' : 'Mark Favourite'}</span>
  `;
  favBtn.onclick = () => handleToggleFavourite(movie.id);

  const editBtn = document.getElementById('detailsEditBtn');
  editBtn.onclick = () => {
    closeDetailsModal();
    openEditModal(movie.id);
  };

  const deleteBtn = document.getElementById('detailsDeleteBtn');
  deleteBtn.onclick = () => {
    closeDetailsModal();
    openDeleteModal(movie.id);
  };

  modal.classList.add('open');
}

function updateDetailsModalFavButton(isFav) {
  const favBtn = document.getElementById('detailsFavBtn');
  if (!favBtn) return;

  favBtn.className = `btn btn-secondary ${isFav ? 'active' : ''}`;
  favBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? '#e50914' : 'none'}" stroke="${isFav ? '#e50914' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
    <span>${isFav ? 'Favourited' : 'Mark Favourite'}</span>
  `;
}

function openDeleteModal(id, event) {
  if (event) event.stopPropagation();

  const movie = state.movies.find(m => String(m.id) === String(id));
  if (!movie) return;

  state.deletingMovieId = id;
  const modal = document.getElementById('deleteConfirmModal');
  const titleSpan = document.getElementById('deleteMovieTitle');

  if (titleSpan) titleSpan.textContent = movie.title;
  if (modal) modal.classList.add('open');
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.classList.remove('open');
  });
  state.editingMovieId = null;
  state.deletingMovieId = null;
  state.viewingMovieId = null;
}

function closeFormModal() {
  document.getElementById('movieFormModal').classList.remove('open');
  state.editingMovieId = null;
}

function closeDetailsModal() {
  document.getElementById('movieDetailsModal').classList.remove('open');
  state.viewingMovieId = null;
}

function closeDeleteModal() {
  document.getElementById('deleteConfirmModal').classList.remove('open');
  state.deletingMovieId = null;
}

// Poster Preview inside Add/Edit Form
function updatePosterPreview(url, title, genre, year) {
  const previewImg = document.getElementById('formPosterPreview');
  if (!previewImg) return;

  if (url && url.trim()) {
    previewImg.src = url.trim();
    previewImg.onerror = function() {
      this.onerror = null;
      this.src = createFallbackPoster(title || 'Preview', genre || 'Cinema', year || 2024);
    };
  } else {
    previewImg.src = createFallbackPoster(title || 'New Movie', genre || 'Cinema', year || 2024);
  }
}

// Form validation
function validateMovieForm(values) {
  let isValid = true;
  clearFormErrors();

  if (!values.title || !values.title.trim()) {
    setFieldError('movieTitleGroup', 'Movie title is required.');
    isValid = false;
  }

  if (!values.genre || !values.genre.trim()) {
    setFieldError('movieGenreGroup', 'Genre is required.');
    isValid = false;
  }

  if (!values.language || !values.language.trim()) {
    setFieldError('movieLangGroup', 'Language is required.');
    isValid = false;
  }

  const yearNum = Number(values.releaseYear);
  if (!values.releaseYear || isNaN(yearNum) || yearNum < 1888 || yearNum > 2100) {
    setFieldError('movieYearGroup', 'Enter a valid year between 1888 and 2100.');
    isValid = false;
  }

  const ratingNum = Number(values.rating);
  if (values.rating === '' || isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
    setFieldError('movieRatingGroup', 'Rating must be between 0.0 and 10.0.');
    isValid = false;
  }

  if (!values.duration || !values.duration.trim()) {
    setFieldError('movieDurationGroup', 'Duration is required (e.g. 120 min).');
    isValid = false;
  }

  if (!values.description || !values.description.trim()) {
    setFieldError('movieDescGroup', 'Movie description is required.');
    isValid = false;
  }

  return isValid;
}

function setFieldError(groupId, message) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.classList.add('has-error');
  const errorEl = group.querySelector('.form-error-msg');
  if (errorEl) errorEl.textContent = message;
}

function clearFormErrors() {
  document.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('has-error');
  });
}

// ==========================================================================
// FILTER CONTROLS HELPERS
// ==========================================================================
function clearSearchFilter() {
  state.searchQuery = '';
  const searchInput = document.getElementById('headerSearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  if (searchInput) searchInput.value = '';
  if (clearBtn) clearBtn.classList.remove('active');
  renderApp();
}

function clearGenreFilter() {
  state.selectedGenre = 'all';
  const select = document.getElementById('genreSelect');
  if (select) select.value = 'all';
  renderApp();
}

function setFilterTab(tabName) {
  state.filterTab = tabName;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  if (tabName === 'all') {
    document.getElementById('tabAllMovies').classList.add('active');
  } else if (tabName === 'favourites') {
    document.getElementById('tabFavourites').classList.add('active');
  }

  renderApp();
}

function setViewMode(mode) {
  state.viewMode = mode;
  document.getElementById('viewModeGrid').classList.toggle('active', mode === 'grid');
  document.getElementById('viewModeList').classList.toggle('active', mode === 'list');
  renderApp();
}

// ==========================================================================
// STRING & HTML UTILITIES
// ==========================================================================
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ==========================================================================
// INITIALIZATION AND EVENT LISTENERS
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Data Fetch
  fetchMovies();

  // 2. Search Bar Event Listeners
  const searchInput = document.getElementById('headerSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      state.searchQuery = val;
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('active', val.length > 0);
      }
      renderApp();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      clearSearchFilter();
      searchInput.focus();
    });
  }

  // 3. Genre Select Event
  const genreSelect = document.getElementById('genreSelect');
  if (genreSelect) {
    genreSelect.addEventListener('change', (e) => {
      state.selectedGenre = e.target.value;
      renderApp();
    });
  }

  // 4. Sort Select Event
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderApp();
    });
  }

  // 5. Header Add Movie Button
  const addMovieBtn = document.getElementById('headerAddMovieBtn');
  if (addMovieBtn) {
    addMovieBtn.addEventListener('click', openAddModal);
  }

  // 6. Poster URL Input Live Preview
  const posterInput = document.getElementById('moviePosterInput');
  if (posterInput) {
    posterInput.addEventListener('input', (e) => {
      const titleVal = document.getElementById('movieTitleInput').value;
      const genreVal = document.getElementById('movieGenreInput').value;
      const yearVal = document.getElementById('movieYearInput').value;
      updatePosterPreview(e.target.value, titleVal, genreVal, yearVal);
    });
  }

  // 7. Form Submit Listener (Add or Edit)
  const movieForm = document.getElementById('movieForm');
  if (movieForm) {
    movieForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const rawValues = {
        title: document.getElementById('movieTitleInput').value,
        genre: document.getElementById('movieGenreInput').value,
        language: document.getElementById('movieLangInput').value,
        releaseYear: document.getElementById('movieYearInput').value,
        rating: document.getElementById('movieRatingInput').value,
        duration: document.getElementById('movieDurationInput').value,
        description: document.getElementById('movieDescInput').value,
        actors: document.getElementById('movieActorsInput') ? document.getElementById('movieActorsInput').value : '',
        poster: document.getElementById('moviePosterInput').value,
        favourite: document.getElementById('movieFavInput').checked,
        streamingPlatform: document.getElementById('moviePlatformInput') ? document.getElementById('moviePlatformInput').value : 'Netflix',
        streamingUrl: document.getElementById('movieStreamUrlInput') ? document.getElementById('movieStreamUrlInput').value : ''
      };

      if (!validateMovieForm(rawValues)) {
        return;
      }

      const cleanStreamingUrl = rawValues.streamingUrl && rawValues.streamingUrl.trim()
        ? rawValues.streamingUrl.trim()
        : '';

      const finalPoster = (rawValues.poster && rawValues.poster.trim()) ||
        state.uploadedPosterUrl ||
        createFallbackPoster(rawValues.title, rawValues.genre, rawValues.releaseYear);

      const formattedValues = {
        title: rawValues.title.trim(),
        genre: rawValues.genre.trim(),
        language: rawValues.language.trim(),
        releaseYear: parseInt(rawValues.releaseYear, 10),
        rating: parseFloat(parseFloat(rawValues.rating).toFixed(1)),
        duration: rawValues.duration.trim(),
        description: rawValues.description.trim(),
        actors: rawValues.actors && rawValues.actors.trim() ? rawValues.actors.trim() : 'Ensemble Cast',
        poster: finalPoster,
        favourite: Boolean(rawValues.favourite),
        streamingPlatform: rawValues.streamingPlatform ? rawValues.streamingPlatform.trim() : 'Netflix',
        streamingUrl: cleanStreamingUrl
      };

      if (state.editingMovieId) {
        handleUpdateMovie(state.editingMovieId, formattedValues);
      } else {
        handleCreateMovie(formattedValues);
      }
    });
  }

  // 8. Delete Confirmation Button
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      if (state.deletingMovieId) {
        handleDeleteMovie(state.deletingMovieId);
      }
    });
  }

  // 9. Reset Seed Data Button
  const resetBtn = document.getElementById('resetSeedDataBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', handleResetData);
  }

  const emptyResetBtn = document.getElementById('emptyResetBtn');
  if (emptyResetBtn) {
    emptyResetBtn.addEventListener('click', () => {
      clearSearchFilter();
      clearGenreFilter();
      setFilterTab('all');
    });
  }

  // 10. Close Modal Backdrops & Escape Key
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  const welcomeBackdrop = document.getElementById('welcomeModalBackdrop');
  if (welcomeBackdrop) {
    welcomeBackdrop.addEventListener('click', (e) => {
      if (e.target === welcomeBackdrop) {
        closeWelcomeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const welcomeEl = document.getElementById('welcomeModalBackdrop');
      if (welcomeEl && welcomeEl.classList.contains('active')) {
        closeWelcomeModal();
      } else {
        closeAllModals();
      }
    } else if (e.key === 'Enter') {
      const welcomeEl = document.getElementById('welcomeModalBackdrop');
      if (welcomeEl && welcomeEl.classList.contains('active')) {
        // If welcome pop-up is active, Enter dismisses it to explore catalog
        closeWelcomeModal();
      }
    }
  });

  // 11. New Feature Initializers
  initTheme();
  initVoiceSearch();
  initAdvancedSearch();
  initImageUpload();

  // 12. Trigger Attractive Opening Pop-up Animation on Website Load
  setTimeout(() => {
    openWelcomeModal(false);
  }, 350);

  // Make globally available functions for inline HTML calls
  window.openWelcomeModal = openWelcomeModal;
  window.closeWelcomeModal = closeWelcomeModal;
  window.openAddMovieModal = openAddMovieModal;
  window.openAddModal = openAddModal;
  window.openEditModal = openEditModal;
  window.openDetailsModal = openDetailsModal;
  window.openDeleteModal = openDeleteModal;
  window.closeFormModal = closeFormModal;
  window.closeDetailsModal = closeDetailsModal;
  window.closeDeleteModal = closeDeleteModal;
  window.handleToggleFavourite = handleToggleFavourite;
  window.clearSearchFilter = clearSearchFilter;
  window.clearGenreFilter = clearGenreFilter;
  window.setFilterTab = setFilterTab;
  window.setViewMode = setViewMode;
  // New features
  window.toggleTheme = toggleTheme;
  window.setTheme = setTheme;
  window.toggleAdvancedSearch = toggleAdvancedSearch;
  window.applyAdvancedSearch = applyAdvancedSearch;
  window.resetAdvancedSearch = resetAdvancedSearch;
  window.clearSingleAdvFilter = clearSingleAdvFilter;
  window.setPosterUploadMode = setPosterUploadMode;
  window.removeUploadedPoster = removeUploadedPoster;
});

// ============================================================================
// THEME SWITCHER CONTROLLER (Dark / Light Theme)
// ============================================================================
function initTheme() {
  const savedTheme = localStorage.getItem('mms_theme') || 'dark';
  setTheme(savedTheme);

  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
}

function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem('mms_theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  if (document.body) {
    document.body.classList.toggle('light-theme', theme === 'light');
  }

  const label = document.getElementById('themeLabelText');
  if (label) {
    label.textContent = theme === 'light' ? 'Light' : 'Dark';
  }
  
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.setAttribute('title', `Switch theme (Current: ${theme})`);
    themeBtn.setAttribute('aria-label', `Switch theme (Current: ${theme})`);
  }
}

function toggleTheme() {
  const newTheme = state.theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  showToast(`Switched to ${newTheme === 'light' ? 'Light' : 'Dark'} theme`, 'info');
}

// ============================================================================
// VOICE SEARCH CONTROLLER (Web Speech API)
// ============================================================================
function initVoiceSearch() {
  const voiceBtn = document.getElementById('voiceSearchBtn');
  if (!voiceBtn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceBtn.title = 'Voice search not supported in this browser';
    voiceBtn.addEventListener('click', () => {
      showToast('Voice search is not supported by your current browser. Please use Chrome/Edge or type into search.', 'warning');
    });
    return;
  }

  let recognition;
  try {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  } catch (err) {
    console.warn('Could not initialize SpeechRecognition:', err);
    return;
  }

  recognition.onstart = () => {
    state.isListening = true;
    voiceBtn.classList.add('listening');
    voiceBtn.setAttribute('title', 'Listening... Speak a movie title or actor now!');
    showToast('Listening... Speak a movie title, actor, or genre!', 'info');
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (transcript && transcript.trim()) {
      const cleanText = transcript.trim().replace(/\.$/, '');
      const searchInput = document.getElementById('headerSearchInput');
      const clearBtn = document.getElementById('clearSearchBtn');
      if (searchInput) {
        searchInput.value = cleanText;
        state.searchQuery = cleanText;
        if (clearBtn) clearBtn.classList.add('active');
        renderApp();
        showToast(`Heard: "${cleanText}"`, 'success');
      }
    }
  };

  recognition.onerror = (event) => {
    console.warn('Speech recognition error:', event.error);
    state.isListening = false;
    voiceBtn.classList.remove('listening');
    if (event.error === 'not-allowed') {
      showToast('Microphone access denied. Please enable microphone permissions in your browser.', 'error');
    } else if (event.error !== 'no-speech') {
      showToast(`Voice search: ${event.error}`, 'error');
    }
  };

  recognition.onend = () => {
    state.isListening = false;
    voiceBtn.classList.remove('listening');
    voiceBtn.setAttribute('title', 'Voice Search (Click to speak)');
  };

  voiceBtn.addEventListener('click', () => {
    if (state.isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  });
}

// ============================================================================
// ADVANCED SEARCH CONTROLLER
// ============================================================================
function initAdvancedSearch() {
  const toggleBtn = document.getElementById('advancedSearchToggleBtn');
  const panel = document.getElementById('advancedSearchPanel');
  const closeBtn = document.getElementById('advSearchCloseBtn');
  const applyBtn = document.getElementById('advSearchApplyBtn');
  const resetBtn = document.getElementById('advSearchResetBtn');

  if (toggleBtn && panel) {
    toggleBtn.addEventListener('click', () => {
      toggleAdvancedSearch();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      toggleAdvancedSearch(false);
    });
  }

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      applyAdvancedSearch();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetAdvancedSearch();
    });
  }

  const advInputs = [
    'advSearchTitle',
    'advSearchActor',
    'advSearchYearMin',
    'advSearchYearMax'
  ];
  advInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyAdvancedSearch();
        }
      });
    }
  });
}

function toggleAdvancedSearch(force) {
  const panel = document.getElementById('advancedSearchPanel');
  const toggleBtn = document.getElementById('advancedSearchToggleBtn');
  if (!panel) return;

  const willOpen = force !== undefined ? force : panel.style.display === 'none';
  panel.style.display = willOpen ? 'block' : 'none';
  state.advancedSearchOpen = willOpen;

  if (toggleBtn) {
    toggleBtn.classList.toggle('active', willOpen);
  }

  if (willOpen) {
    const titleInput = document.getElementById('advSearchTitle');
    if (titleInput) titleInput.focus();
  }
}

function applyAdvancedSearch() {
  const title = (document.getElementById('advSearchTitle')?.value || '').trim();
  const actor = (document.getElementById('advSearchActor')?.value || '').trim();
  const genre = document.getElementById('advSearchGenre')?.value || 'all';
  const language = document.getElementById('advSearchLanguage')?.value || 'all';
  const minYear = (document.getElementById('advSearchYearMin')?.value || '').trim();
  const maxYear = (document.getElementById('advSearchYearMax')?.value || '').trim();

  state.advancedFilters = {
    title,
    actor,
    genre,
    language,
    minYear,
    maxYear
  };

  renderApp();
  showToast('Advanced search filters applied!', 'info');
}

function resetAdvancedSearch() {
  state.advancedFilters = {
    title: '',
    actor: '',
    genre: 'all',
    language: 'all',
    minYear: '',
    maxYear: ''
  };

  const titleEl = document.getElementById('advSearchTitle');
  if (titleEl) titleEl.value = '';
  const actorEl = document.getElementById('advSearchActor');
  if (actorEl) actorEl.value = '';
  const genreEl = document.getElementById('advSearchGenre');
  if (genreEl) genreEl.value = 'all';
  const langEl = document.getElementById('advSearchLanguage');
  if (langEl) langEl.value = 'all';
  const minEl = document.getElementById('advSearchYearMin');
  if (minEl) minEl.value = '';
  const maxEl = document.getElementById('advSearchYearMax');
  if (maxEl) maxEl.value = '';

  renderApp();
  showToast('Advanced search criteria cleared', 'info');
}

function clearSingleAdvFilter(key) {
  if (key === 'title') {
    state.advancedFilters.title = '';
    const el = document.getElementById('advSearchTitle');
    if (el) el.value = '';
  } else if (key === 'actor') {
    state.advancedFilters.actor = '';
    const el = document.getElementById('advSearchActor');
    if (el) el.value = '';
  } else if (key === 'genre') {
    state.advancedFilters.genre = 'all';
    const el = document.getElementById('advSearchGenre');
    if (el) el.value = 'all';
  } else if (key === 'language') {
    state.advancedFilters.language = 'all';
    const el = document.getElementById('advSearchLanguage');
    if (el) el.value = 'all';
  } else if (key === 'year') {
    state.advancedFilters.minYear = '';
    state.advancedFilters.maxYear = '';
    const minEl = document.getElementById('advSearchYearMin');
    if (minEl) minEl.value = '';
    const maxEl = document.getElementById('advSearchYearMax');
    if (maxEl) maxEl.value = '';
  }
  renderApp();
}

// ============================================================================
// IMAGE UPLOAD & POSTER PREVIEW CONTROLLER
// ============================================================================
function initImageUpload() {
  const dropzone = document.getElementById('posterDropzone');
  const fileInput = document.getElementById('moviePosterFileInput');
  const removeBtn = document.getElementById('posterRemoveBtn');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', (e) => {
      fileInput.click();
    });

    dropzone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-over');
    });

    dropzone.addEventListener('dragend', () => {
      dropzone.classList.remove('drag-over');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        processPosterFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        processPosterFile(e.target.files[0]);
      }
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeUploadedPoster();
    });
  }
}

function setPosterUploadMode(mode) {
  state.posterUploadMode = mode;
  const uploadSec = document.getElementById('posterUploadSection');
  const urlSec = document.getElementById('posterUrlSection');
  const uploadBtn = document.getElementById('posterModeUploadBtn');
  const urlBtn = document.getElementById('posterModeUrlBtn');

  if (mode === 'upload') {
    if (uploadSec) uploadSec.style.display = 'block';
    if (urlSec) urlSec.style.display = 'none';
    if (uploadBtn) uploadBtn.classList.add('active');
    if (urlBtn) urlBtn.classList.remove('active');
  } else {
    if (uploadSec) uploadSec.style.display = 'none';
    if (urlSec) urlSec.style.display = 'block';
    if (uploadBtn) uploadBtn.classList.remove('active');
    if (urlBtn) urlBtn.classList.add('active');
  }
}

async function processPosterFile(file) {
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file (PNG, JPG, WEBP, GIF)', 'error');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    showToast('Image file size must be less than 10MB', 'error');
    return;
  }

  showToast(`Uploading ${file.name}...`, 'info');

  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64Data = e.target.result;
    
    // Immediate local visual preview
    const previewImg = document.getElementById('formPosterPreview');
    if (previewImg) previewImg.src = base64Data;

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Data,
          filename: file.name
        })
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      const finalUrl = result.url || base64Data;
      state.uploadedPosterUrl = finalUrl;

      const posterInput = document.getElementById('moviePosterInput');
      if (posterInput) posterInput.value = finalUrl;

      const removeBtn = document.getElementById('posterRemoveBtn');
      if (removeBtn) removeBtn.style.display = 'flex';

      const statusText = document.getElementById('posterPreviewStatusText');
      if (statusText) statusText.textContent = 'Poster Uploaded Successfully';

      const detailText = document.getElementById('posterPreviewDetailText');
      if (detailText) detailText.textContent = `File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

      showToast(`Poster "${file.name}" uploaded successfully!`, 'success');
    } catch (err) {
      console.warn('Backend image upload endpoint failed, falling back to data URL:', err);
      state.uploadedPosterUrl = base64Data;
      const posterInput = document.getElementById('moviePosterInput');
      if (posterInput) posterInput.value = base64Data;
      
      const removeBtn = document.getElementById('posterRemoveBtn');
      if (removeBtn) removeBtn.style.display = 'flex';

      showToast('Image attached and ready!', 'success');
    }
  };

  reader.readAsDataURL(file);
}

function removeUploadedPoster() {
  state.uploadedPosterUrl = '';
  const fileInput = document.getElementById('moviePosterFileInput');
  if (fileInput) fileInput.value = '';

  const posterInput = document.getElementById('moviePosterInput');
  if (posterInput) posterInput.value = '';

  const removeBtn = document.getElementById('posterRemoveBtn');
  if (removeBtn) removeBtn.style.display = 'none';

  const statusText = document.getElementById('posterPreviewStatusText');
  if (statusText) statusText.textContent = 'Live Poster Preview';

  const detailText = document.getElementById('posterPreviewDetailText');
  if (detailText) detailText.textContent = 'Upload an image file from your device or specify an image URL.';

  const titleVal = document.getElementById('movieTitleInput')?.value;
  const genreVal = document.getElementById('movieGenreInput')?.value;
  const yearVal = document.getElementById('movieYearInput')?.value;
  updatePosterPreview('', titleVal, genreVal, yearVal);

  showToast('Poster image removed', 'info');
}

// ============================================================================
// OPENING WELCOME POP-UP ANIMATION CONTROLLER
// ============================================================================
function openWelcomeModal(force = false) {
  const backdrop = document.getElementById('welcomeModalBackdrop');
  if (!backdrop) return;

  // If not explicitly requested via "Welcome Tour" button, check if suppressed
  if (!force) {
    const suppressed = localStorage.getItem('cinemanage_suppress_welcome');
    if (suppressed === 'true') {
      return;
    }
  }

  backdrop.classList.remove('closing');
  backdrop.classList.add('active');

  // Focus primary action button for accessibility & keyboard users
  setTimeout(() => {
    const exploreBtn = document.getElementById('welcomeExploreBtn');
    if (exploreBtn) exploreBtn.focus();
  }, 220);
}

function closeWelcomeModal() {
  const backdrop = document.getElementById('welcomeModalBackdrop');
  if (!backdrop || !backdrop.classList.contains('active')) return;

  // Check if "Don't show again" checkbox was marked
  const checkbox = document.getElementById('dontShowWelcomeAgain');
  if (checkbox && checkbox.checked) {
    localStorage.setItem('cinemanage_suppress_welcome', 'true');
  }

  backdrop.classList.add('closing');
  setTimeout(() => {
    backdrop.classList.remove('active', 'closing');
  }, 350);
}

function openAddMovieModal() {
  closeWelcomeModal();
  setTimeout(() => {
    openAddModal();
  }, 200);
}

