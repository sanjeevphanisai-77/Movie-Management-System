import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'data', 'movies.json');

// Ensure database directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure public uploads directory exists for image uploads
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 20 Seed Movies as per specification with actors and streaming metadata
const SEED_MOVIES = [
  {
    id: "mov-1",
    title: "Interstellar",
    genre: "Sci-Fi",
    language: "English",
    releaseYear: 2014,
    rating: 8.7,
    duration: "169 min",
    actors: "Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine",
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
    actors: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy, Marion Cotillard",
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
    actors: "Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine, Gary Oldman, Morgan Freeman",
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
    actors: "Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson, Paul Rudd",
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
    actors: "Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem, Austin Butler, Florence Pugh",
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
    actors: "Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong, Choi Woo-shik, Park So-dam",
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
    actors: "Aamir Khan, R. Madhavan, Sharman Joshi, Kareena Kapoor, Boman Irani, Omi Vaidya",
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
    actors: "N. T. Rama Rao Jr., Ram Charan, Ajay Devgn, Alia Bhatt, Shriya Saran, Ray Stevenson",
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
    actors: "Yash, Sanjay Dutt, Raveena Tandon, Srinidhi Shetty, Prakash Raj, Rao Ramesh",
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
    actors: "Prabhas, Rana Daggubati, Anushka Shetty, Tamannaah Bhatia, Ramya Krishna, Sathyaraj",
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
    actors: "Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler, Clancy Brown",
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
    actors: "Tom Hanks, Robin Wright, Gary Sinise, Sally Field, Mykelti Williamson",
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
    actors: "Tom Holland, Zendaya, Benedict Cumberbatch, Jacob Batalon, Willem Dafoe, Alfred Molina",
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
    actors: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, Joe Pantoliano",
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
    actors: "Joaquin Phoenix, Robert De Niro, Zazie Beetz, Frances Conroy, Brett Cullen",
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
    actors: "Tom Cruise, Miles Teller, Jennifer Connelly, Jon Hamm, Glen Powell, Ed Harris",
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
    actors: "Sam Worthington, Zoe Saldana, Sigourney Weaver, Stephen Lang, Michelle Rodriguez",
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
    actors: "Tom Hanks, Tim Allen, Don Rickles, Jim Varney, Wallace Shawn, John Ratzenberger",
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
    actors: "Hugh Jackman, Christian Bale, Michael Caine, Scarlett Johansson, David Bowie, Andy Serkis",
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
    actors: "Miles Teller, J.K. Simmons, Paul Reiser, Melissa Benoist, Austin Stowell",
    description: "An ambitious young drummer faces an intense instructor who demands extraordinary performance.",
    poster: "/posters/whiplash.jpg",
    favourite: false,
    streamingPlatform: "Netflix",
    streamingUrl: "https://www.netflix.com/title/70299275"
  }
];

// Helper functions for reading and writing to JSON database
function readMovies() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(SEED_MOVIES, null, 2), 'utf8');
      return [...SEED_MOVIES];
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      fs.writeFileSync(DB_PATH, JSON.stringify(SEED_MOVIES, null, 2), 'utf8');
      return [...SEED_MOVIES];
    }
    return parsed;
  } catch (err) {
    console.error('Error reading movies database, restoring seed data:', err);
    fs.writeFileSync(DB_PATH, JSON.stringify(SEED_MOVIES, null, 2), 'utf8');
    return [...SEED_MOVIES];
  }
}

function writeMovies(movies) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(movies, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing to movies database:', err);
    return false;
  }
}

// Middleware with generous payload limit for image data uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// POST /api/upload - Handle image uploads (base64 data URL)
app.post('/api/upload', (req, res) => {
  try {
    const { data, filename } = req.body;
    if (!data || typeof data !== 'string') {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Match data:[<mediatype>];base64,<data>
    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 image data' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Determine extension
    let ext = 'jpg';
    if (mimeType === 'image/png') ext = 'png';
    else if (mimeType === 'image/webp') ext = 'webp';
    else if (mimeType === 'image/gif') ext = 'gif';
    else if (mimeType === 'image/svg+xml') ext = 'svg';

    const safeName = `poster-${Date.now()}-${Math.floor(Math.random() * 10000)}.${ext}`;
    const filePath = path.join(uploadsDir, safeName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;
    return res.status(201).json({
      success: true,
      url: publicUrl,
      filename: safeName,
      size: buffer.length
    });
  } catch (err) {
    console.error('Failed to save uploaded image:', err);
    return res.status(500).json({ error: 'Failed to save uploaded image' });
  }
});

// GET /api/movies - Advanced Query, filter, search (title, actor, genre, language, year), sort
app.get('/api/movies', (req, res) => {
  try {
    let movies = readMovies();
    const { search, title, actor, genre, language, year, minYear, maxYear, sort, favourite } = req.query;

    // Filter by generic search query (searches title, actors, genre, language, description)
    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      movies = movies.filter(m => {
        const t = (m.title || '').toLowerCase();
        const a = (m.actors || '').toLowerCase();
        const g = (m.genre || '').toLowerCase();
        const l = (m.language || '').toLowerCase();
        const d = (m.description || '').toLowerCase();
        return t.includes(q) || a.includes(q) || g.includes(q) || l.includes(q) || d.includes(q);
      });
    }

    // Specific field: Title search
    if (title && typeof title === 'string' && title.trim() !== '') {
      const qTitle = title.trim().toLowerCase();
      movies = movies.filter(m => (m.title || '').toLowerCase().includes(qTitle));
    }

    // Specific field: Actor search
    if (actor && typeof actor === 'string' && actor.trim() !== '') {
      const qActor = actor.trim().toLowerCase();
      movies = movies.filter(m => (m.actors || '').toLowerCase().includes(qActor));
    }

    // Specific field: Genre filter
    if (genre && typeof genre === 'string' && genre.trim() !== '' && genre.toLowerCase() !== 'all' && genre.toLowerCase() !== 'all genres') {
      const g = genre.trim().toLowerCase();
      movies = movies.filter(m => (m.genre || '').toLowerCase() === g);
    }

    // Specific field: Language filter
    if (language && typeof language === 'string' && language.trim() !== '' && language.toLowerCase() !== 'all' && language.toLowerCase() !== 'all languages') {
      const l = language.trim().toLowerCase();
      movies = movies.filter(m => (m.language || '').toLowerCase() === l);
    }

    // Specific field: Exact Year
    if (year && !isNaN(Number(year))) {
      const y = Number(year);
      movies = movies.filter(m => Number(m.releaseYear) === y);
    }

    // Specific field: Min Year
    if (minYear && !isNaN(Number(minYear))) {
      const minY = Number(minYear);
      movies = movies.filter(m => Number(m.releaseYear) >= minY);
    }

    // Specific field: Max Year
    if (maxYear && !isNaN(Number(maxYear))) {
      const maxY = Number(maxYear);
      movies = movies.filter(m => Number(m.releaseYear) <= maxY);
    }

    // Filter by favourite
    if (favourite === 'true') {
      movies = movies.filter(m => m.favourite === true);
    }

    // Sorting
    if (sort) {
      if (sort === 'rating-desc') {
        movies.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
      } else if (sort === 'rating-asc') {
        movies.sort((a, b) => (Number(a.rating) || 0) - (Number(b.rating) || 0));
      } else if (sort === 'year-desc') {
        movies.sort((a, b) => (Number(b.releaseYear) || 0) - (Number(a.releaseYear) || 0));
      } else if (sort === 'year-asc') {
        movies.sort((a, b) => (Number(a.releaseYear) || 0) - (Number(b.releaseYear) || 0));
      } else if (sort === 'title-asc') {
        movies.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      }
    }

    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve movies' });
  }
});

// GET /api/analytics - Comprehensive analytics for genres, ratings, and release years
app.get('/api/analytics', (req, res) => {
  try {
    const movies = readMovies();
    const total = movies.length;
    if (total === 0) {
      return res.json({
        total: 0,
        favouritesCount: 0,
        averageRating: 0,
        minYear: 0,
        maxYear: 0,
        genres: {},
        ratingBuckets: {},
        years: {},
        decades: {},
        topRated: []
      });
    }

    const genres = {};
    const ratingBuckets = {
      '9.0 - 10.0 (Masterpiece)': 0,
      '8.5 - 8.9 (Excellent)': 0,
      '8.0 - 8.4 (Great)': 0,
      '7.5 - 7.9 (Good)': 0,
      '< 7.5 (Average)': 0
    };
    const years = {};
    const decades = {};

    let totalRating = 0;
    let minYear = Infinity;
    let maxYear = -Infinity;

    movies.forEach(m => {
      // Genre count
      const g = m.genre ? m.genre.trim() : 'Unknown';
      genres[g] = (genres[g] || 0) + 1;

      // Rating buckets
      const r = Number(m.rating) || 0;
      totalRating += r;
      if (r >= 9.0) ratingBuckets['9.0 - 10.0 (Masterpiece)']++;
      else if (r >= 8.5) ratingBuckets['8.5 - 8.9 (Excellent)']++;
      else if (r >= 8.0) ratingBuckets['8.0 - 8.4 (Great)']++;
      else if (r >= 7.5) ratingBuckets['7.5 - 7.9 (Good)']++;
      else ratingBuckets['< 7.5 (Average)']++;

      // Year distribution
      const y = Number(m.releaseYear);
      if (!isNaN(y) && y > 1800) {
        years[y] = (years[y] || 0) + 1;
        if (y < minYear) minYear = y;
        if (y > maxYear) maxYear = y;
        const decade = `${Math.floor(y / 10) * 10}s`;
        decades[decade] = (decades[decade] || 0) + 1;
      }
    });

    const averageRating = parseFloat((totalRating / total).toFixed(2));

    // Top rated movies
    const topRated = [...movies]
      .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
      .slice(0, 5)
      .map(m => ({
        id: m.id,
        title: m.title,
        rating: m.rating,
        genre: m.genre,
        releaseYear: m.releaseYear,
        poster: m.poster
      }));

    res.json({
      total,
      favouritesCount: movies.filter(m => m.favourite).length,
      averageRating,
      minYear: minYear === Infinity ? 0 : minYear,
      maxYear: maxYear === -Infinity ? 0 : maxYear,
      genres,
      ratingBuckets,
      years,
      decades,
      topRated
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute analytics' });
  }
});

// GET /api/movies/:id - Get single movie
app.get('/api/movies/:id', (req, res) => {
  const movies = readMovies();
  const movie = movies.find(m => String(m.id) === String(req.params.id));
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  res.json(movie);
});

// POST /api/movies - Add new movie with validation
app.post('/api/movies', (req, res) => {
  const {
    title,
    genre,
    language,
    releaseYear,
    rating,
    duration,
    actors,
    description,
    poster,
    favourite,
    streamingPlatform,
    streamingUrl
  } = req.body;

  // Validation
  const errors = [];
  if (!title || !String(title).trim()) errors.push('Title is required');
  if (!genre || !String(genre).trim()) errors.push('Genre is required');
  if (!language || !String(language).trim()) errors.push('Language is required');

  const yearNum = Number(releaseYear);
  if (!releaseYear || isNaN(yearNum) || yearNum < 1888 || yearNum > 2100) {
    errors.push('Release year must be a valid year between 1888 and 2100');
  }

  const ratingNum = Number(rating);
  if (rating === undefined || rating === null || isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
    errors.push('Rating must be a number between 0 and 10');
  }

  if (!duration || !String(duration).trim()) errors.push('Duration is required (e.g. 120 min)');
  if (!description || !String(description).trim()) errors.push('Description is required');

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const cleanTitle = String(title).trim();
  const defaultPlatform = streamingPlatform && String(streamingPlatform).trim() 
    ? String(streamingPlatform).trim() 
    : 'Online Streaming';
  const defaultStreamUrl = streamingUrl !== undefined && String(streamingUrl).trim() 
    ? String(streamingUrl).trim() 
    : '';

  const movies = readMovies();
  const newMovie = {
    id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: cleanTitle,
    genre: String(genre).trim(),
    language: String(language).trim(),
    releaseYear: Math.floor(yearNum),
    rating: parseFloat(ratingNum.toFixed(1)),
    duration: String(duration).trim(),
    actors: actors && String(actors).trim() ? String(actors).trim() : 'Ensemble Cast',
    description: String(description).trim(),
    poster: poster && String(poster).trim() ? String(poster).trim() : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    favourite: Boolean(favourite),
    streamingPlatform: defaultPlatform,
    streamingUrl: defaultStreamUrl
  };

  movies.unshift(newMovie);
  writeMovies(movies);

  res.status(201).json(newMovie);
});

// PUT /api/movies/:id - Update existing movie with validation
app.put('/api/movies/:id', (req, res) => {
  const movies = readMovies();
  const index = movies.findIndex(m => String(m.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  const {
    title,
    genre,
    language,
    releaseYear,
    rating,
    duration,
    actors,
    description,
    poster,
    favourite,
    streamingPlatform,
    streamingUrl
  } = req.body;

  const errors = [];
  if (!title || !String(title).trim()) errors.push('Title is required');
  if (!genre || !String(genre).trim()) errors.push('Genre is required');
  if (!language || !String(language).trim()) errors.push('Language is required');

  const yearNum = Number(releaseYear);
  if (!releaseYear || isNaN(yearNum) || yearNum < 1888 || yearNum > 2100) {
    errors.push('Release year must be a valid year between 1888 and 2100');
  }

  const ratingNum = Number(rating);
  if (rating === undefined || rating === null || isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
    errors.push('Rating must be a number between 0 and 10');
  }

  if (!duration || !String(duration).trim()) errors.push('Duration is required');
  if (!description || !String(description).trim()) errors.push('Description is required');

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const current = movies[index];
  const cleanTitle = String(title).trim();
  const updatedMovie = {
    ...current,
    title: cleanTitle,
    genre: String(genre).trim(),
    language: String(language).trim(),
    releaseYear: Math.floor(yearNum),
    rating: parseFloat(ratingNum.toFixed(1)),
    duration: String(duration).trim(),
    actors: actors !== undefined && String(actors).trim() ? String(actors).trim() : (current.actors || 'Ensemble Cast'),
    description: String(description).trim(),
    poster: poster && String(poster).trim() ? String(poster).trim() : current.poster,
    favourite: favourite !== undefined ? Boolean(favourite) : current.favourite,
    streamingPlatform: streamingPlatform !== undefined && String(streamingPlatform).trim()
      ? String(streamingPlatform).trim()
      : (current.streamingPlatform || 'Online Streaming'),
    streamingUrl: streamingUrl !== undefined
      ? String(streamingUrl).trim()
      : (current.streamingUrl || '')
  };

  movies[index] = updatedMovie;
  writeMovies(movies);

  res.json(updatedMovie);
});

// PATCH /api/movies/:id/favourite - Toggle or set favourite status
app.patch('/api/movies/:id/favourite', (req, res) => {
  const movies = readMovies();
  const index = movies.findIndex(m => String(m.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  const current = movies[index];
  const newFav = req.body && typeof req.body.favourite === 'boolean'
    ? req.body.favourite
    : !current.favourite;

  movies[index].favourite = newFav;
  writeMovies(movies);

  res.json({ id: current.id, favourite: newFav, movie: movies[index] });
});

// DELETE /api/movies/:id - Delete movie
app.delete('/api/movies/:id', (req, res) => {
  const movies = readMovies();
  const index = movies.findIndex(m => String(m.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  const deletedMovie = movies.splice(index, 1)[0];
  writeMovies(movies);

  res.json({ success: true, message: `Movie "${deletedMovie.title}" deleted`, deletedMovie });
});

// POST /api/movies/reset - Reset to the initial 20 seed movies
app.post('/api/movies/reset', (req, res) => {
  writeMovies(SEED_MOVIES);
  res.json({ success: true, message: 'Database reset to initial 20 seed movies', movies: SEED_MOVIES });
});

// Static assets
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Fallback to index.html for single-page app behavior
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Movie Management System backend running on http://0.0.0.0:${PORT}`);
});
