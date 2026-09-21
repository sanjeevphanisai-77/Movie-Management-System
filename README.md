# 🎬 CineManage — Movie Management System

<div align="center">

### A Professional Movie Catalog & Management Platform

Search. Filter. Organize. Curate. Manage.

A cinematic web application for managing a movie catalog with full CRUD operations, advanced discovery, favourites, analytics, poster uploads, and streaming redirection.

</div>

---

## 📌 Overview

**CineManage** is a modern Movie Management System designed to provide a professional interface for organizing and managing a movie collection.

The application combines a cinematic movie-card interface with a backend-powered management system.

Users can:

- Add movies
- Edit movie information
- Delete movies
- Search movies
- Search by actors
- Filter movies
- Sort movies
- View detailed movie information
- Mark movies as favourites
- Upload movie posters
- View movie analytics
- Access streaming-platform links
- Reset the catalog to the original seed dataset

The application starts with **20 preloaded movies** covering multiple genres, languages, ratings, actors, and streaming platforms.

---

## ✨ Key Features

### 🎬 Movie Management

Complete CRUD functionality for the movie catalog.

- Add a new movie
- View movie details
- Update movie information
- Delete movies
- Mark/unmark favourites
- Reset the catalog to the original 20 seed movies

---

### 🔎 Advanced Search

Movies can be searched using multiple fields.

The backend supports searching through:

- Movie title
- Actors
- Genre
- Language
- Description

Example:

```text
Search: Inter
→ Interstellar

Search: Christian Bale
→ The Dark Knight

🎭 Filtering
Movies can be filtered using:
- Genre
- Language
- Exact release year
- Minimum release year
- Maximum release year
- Favourite status
📊 Sorting
The catalog supports:
- Rating — High to Low
- Rating — Low to High
- Release Year — Newest
- Release Year — Oldest
- Title — A-Z
❤️ Favourite Movies
Movies can be marked as favourites.
The application provides:
- Favourite status on movies
- Favourite movie filtering
- Favourite count
- Favourite management through the movie details interface
📈 Movie Analytics
The backend provides an analytics endpoint for the movie collection.
Analytics include:
- Total number of movies
- Number of favourite movies
- Average movie rating
- Minimum release year
- Maximum release year
- Movies grouped by genre
- Rating distribution
- Movies grouped by release year
- Movies grouped by decade
- Top-rated movies
🖼️ Poster Management
The system supports movie poster URLs as well as poster uploads.
Uploaded images are processed by the backend and stored inside the public uploads directory.
Supported image formats include:
- JPG
- PNG
- WebP
- GIF
- SVG
📺 Streaming Platform Integration
Movies can contain streaming information including:
- Streaming platform
- Streaming URL
The movie details interface provides a direct redirection option to the configured streaming platform.
Supported platforms in the seed data include:
- Netflix
- Prime Video
- Disney+
- Max
- Paramount+
- Apple TV
Streaming availability and links depend on the configured URLs and may change over time.

🪄 Cinematic User Interface
The frontend uses a movie-focused visual design featuring:
- Cinematic dark interface
- Movie cards
- Search interface
- Genre filters
- Sorting controls
- Grid/List view
- Favourite view
- Movie detail modal
- Add/Edit movie modal
- Delete confirmation modal
- Welcome tour
- Responsive layout
The interface is designed to feel like a professional movie platform rather than a basic CRUD application.

🛠️ Technology Stack
Frontend
- HTML5
- CSS3
- JavaScript
- Responsive UI
- SVG icons
Backend
- Node.js
- Express.js
Data Storage
- JSON-based local storage
- data/movies.json

movie-management-system/
│
├── public/
│   │
│   ├── index.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   └── app.js
│   │
│   ├── uploads/
│   │   └── uploaded posters
│   │
│   └── posters/
│       └── local movie posters
│
├── data/
│   └── movies.json
│
├── server.js
├── package.json
├── metadata.json
├── .env.example
├── .gitignore
└── README.md