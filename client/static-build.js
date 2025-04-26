// Script to build a static HTML version of the site
// This script is meant to be run after the regular build process

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const dataDir = path.join(distDir, 'data');

// Ensure the build exists
if (!fs.existsSync(distDir)) {
  console.error('Error: Build directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Create data directory for JSON files
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create sample game data
const sampleGames = [
  {
    id: 1,
    title: "Zoochosis",
    description: "**GAME DESCRIPTION:**\nZoochosis is a psychological horror game that explores the unsettling phenomena observed in captive animals. As Dr. Elena Kazan, you're tasked with analyzing disturbing behavioral patterns in a research facility where animals are developing eerie human-like traits.\n\nNavigate the increasingly dangerous facility, document your findings, and uncover the dark experiments that blurred the line between human and animal consciousness. But be warned - the deeper you go, the more the line between observer and subject begins to fade.\n\nYour choices will determine whether you expose the truth or become part of the experiment forever.",
    category: "horror",
    imageUrl: "/uploads/sample1.jpg",
    downloadUrl: "https://example.com/downloads/zoochosis.zip",
    fileSize: "2.7 GB",
    releaseDate: "2023-04-15",
    featured: true,
    createdAt: "2023-04-16T10:30:00Z"
  },
  {
    id: 2,
    title: "Orbital Mercenary",
    description: "**GAME DESCRIPTION:**\nOrbital Mercenary is a space combat simulation where you play as a gun-for-hire navigating the political tensions between mega-corporations that control the solar system.\n\nCustomize your spacecraft, take on contracts ranging from escort missions to full-scale assaults, and build your reputation across the various factions. Every decision affects your standing, equipment access, and mission opportunities.\n\nWith realistic orbital mechanics and a dynamic economy, your success depends on both combat skills and strategic planning. Will you remain neutral or help shape the future of humanity's expansion across the stars?",
    category: "action",
    imageUrl: "/uploads/sample2.jpg",
    downloadUrl: "https://example.com/downloads/orbital-mercenary.zip",
    fileSize: "3.4 GB",
    releaseDate: "2023-06-22",
    featured: false,
    createdAt: "2023-06-23T14:15:00Z"
  },
  {
    id: 3,
    title: "Pixel Kingdom",
    description: "**GAME DESCRIPTION:**\nPixel Kingdom is a retro-styled RPG with modern gameplay mechanics. As the rightful heir to the throne, you must reclaim your kingdom from the shadow cult that has taken control.\n\nExplore a vast world filled with unique towns, dungeons, and landscapes, all rendered in beautiful pixel art. Gather companions with distinct abilities, craft powerful equipment, and develop your character with an expansive skill tree.\n\nWith multiple endings based on your choices and a deep story exploring themes of power, corruption, and redemption, Pixel Kingdom offers a nostalgic yet fresh RPG experience.",
    category: "rpg",
    imageUrl: "/uploads/sample3.jpg",
    downloadUrl: "https://example.com/downloads/pixel-kingdom.zip",
    fileSize: "1.2 GB",
    releaseDate: "2023-02-10",
    featured: true,
    createdAt: "2023-02-12T08:45:00Z"
  }
];

// Create sample tags
const sampleTags = [
  { id: 1, name: "Action", createdAt: "2023-01-01T00:00:00Z" },
  { id: 2, name: "Adventure", createdAt: "2023-01-01T00:00:00Z" },
  { id: 3, name: "RPG", createdAt: "2023-01-01T00:00:00Z" },
  { id: 4, name: "Strategy", createdAt: "2023-01-01T00:00:00Z" },
  { id: 5, name: "Simulation", createdAt: "2023-01-01T00:00:00Z" },
  { id: 6, name: "Puzzle", createdAt: "2023-01-01T00:00:00Z" },
  { id: 7, name: "Horror", createdAt: "2023-01-01T00:00:00Z" },
  { id: 8, name: "FPS", createdAt: "2023-01-01T00:00:00Z" }
];

// Write the data files
console.log('Creating static data files...');

// All games
fs.writeFileSync(
  path.join(dataDir, 'games.json'),
  JSON.stringify(sampleGames, null, 2)
);

// Featured games
fs.writeFileSync(
  path.join(dataDir, 'featured-games.json'),
  JSON.stringify(sampleGames.filter(game => game.featured), null, 2)
);

// Tags
fs.writeFileSync(
  path.join(dataDir, 'tags.json'),
  JSON.stringify(sampleTags, null, 2)
);

// Create game detail endpoints for each game
const gameDetailsDir = path.join(dataDir, 'games');
if (!fs.existsSync(gameDetailsDir)) {
  fs.mkdirSync(gameDetailsDir, { recursive: true });
}

sampleGames.forEach(game => {
  fs.writeFileSync(
    path.join(gameDetailsDir, `${game.id}.json`),
    JSON.stringify(game, null, 2)
  );
});

// Create a uploads directory with sample images
const uploadsDir = path.join(distDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create placeholder image files
console.log('Creating placeholder images...');
const placeholderSvg = `<svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="225" fill="#333"/>
  <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Game Image Placeholder</text>
</svg>`;

['sample1.jpg', 'sample2.jpg', 'sample3.jpg'].forEach(filename => {
  fs.writeFileSync(path.join(uploadsDir, filename), placeholderSvg);
});

// Modify index.html to activate static mode
console.log('Updating index.html for static mode...');
const indexHtmlPath = path.join(distDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Add static mode attribute to html tag
indexHtml = indexHtml.replace('<html lang="en">', '<html lang="en" data-static-mode="true">');

// Add static mode notice
indexHtml = indexHtml.replace(
  '<body>',
  `<body>
    <!-- Static HTML Mode - No backend required -->
    <script>
      console.log('Running in static HTML mode - using local JSON data');
      window.GMG_STATIC_MODE = true;
    </script>`
);

fs.writeFileSync(indexHtmlPath, indexHtml);

// Create a downloads directory
const downloadsDir = path.join(distDir, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Create a README file
fs.writeFileSync(
  path.join(distDir, 'README.txt'),
  `GMG Underground - Static HTML Version

This is a static HTML version of the GMG Underground website.
To use it, simply upload all these files to any web hosting service.

Notes:
- This version uses local JSON files instead of a database
- To modify game data, edit the files in the /data directory
- For downloads, place your game files in the /downloads directory
- This version provides limited functionality compared to the full version
`
);

console.log('Static HTML build complete!');
console.log(`Output directory: ${distDir}`);
console.log('Upload the contents of this directory to any static web hosting service.');