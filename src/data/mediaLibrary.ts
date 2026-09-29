export interface MediaItem {
  id: string;
  title: string;
  year: number;
  rating: number;
  duration: string;
  genre: string[];
  type: 'movie' | 'show' | 'music' | 'documentary';
  poster: string;
  backdrop: string;
  description: string;
  director?: string;
  cast?: string[];
  seasons?: number;
  episodes?: number;
  progress?: number; // 0-100 watch progress
  lastWatched?: string;
  addedDate: string;
  quality: string;
  torrentId: string;
  matchScore?: number; // AI match score for recommendations
  mood?: string[];
}

// Image URLs from generated assets
const IMAGES = {
  hero: 'https://image.qwenlm.ai/generated-images/7607afe3-2b07-4a55-af1a-2059e628a381/_result.png',
  poster1: 'https://image.qwenlm.ai/generated-images/c97ce691-fcba-44f7-ae2f-875c505a4fe4/_result.png',
  poster2: 'https://image.qwenlm.ai/generated-images/7b01c682-a529-467a-89e2-ae103f3593cc/_result.png',
  poster3: 'https://image.qwenlm.ai/generated-images/ff7ba7b5-348f-4acf-b03b-3d248c9fb5b2/_result.png',
  poster4: 'https://image.qwenlm.ai/generated-images/f7cbc06e-111c-4a29-8604-53a01104dc5e/_result.png',
  poster5: 'https://image.qwenlm.ai/generated-images/05620ab7-6d3d-4ace-b0d9-81b5546ec89a/_result.png',
  poster6: 'https://image.qwenlm.ai/generated-images/a578bdc7-3395-4026-bf9f-67a16bc35999/_result.png',
  poster7: 'https://image.qwenlm.ai/generated-images/1be7156f-ee70-43de-a279-9aeb3f377ef6/_result.png',
};

export const mediaLibrary: MediaItem[] = [
  {
    id: 'm1',
    title: 'Stellar Odyssey',
    year: 2024,
    rating: 8.7,
    duration: '2h 28m',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    type: 'movie',
    poster: IMAGES.poster1,
    backdrop: IMAGES.hero,
    description: 'A lone astronaut discovers an ancient alien civilization on a distant planet, forcing humanity to reconsider its place in the cosmos. An epic journey of discovery, loss, and redemption across the stars.',
    director: 'Elena Vasquez',
    cast: ['Marcus Chen', 'Aria Blackwood', 'James Okafor'],
    quality: '4K HDR',
    torrentId: '3',
    progress: 45,
    lastWatched: '2 hours ago',
    addedDate: '2024-01-17',
    matchScore: 98,
    mood: ['Epic', 'Thought-provoking', 'Visual spectacle'],
  },
  {
    id: 'm2',
    title: 'Kingdom of Shadows',
    year: 2024,
    rating: 9.1,
    duration: '2h 15m',
    genre: ['Fantasy', 'Action', 'Drama'],
    type: 'movie',
    poster: IMAGES.poster2,
    backdrop: IMAGES.poster2,
    description: 'In a realm where dragons once ruled, a young queen must unite the fractured kingdoms against an ancient evil rising from the shadows. Epic battles, political intrigue, and dark magic collide.',
    director: 'Thorfinn Arneson',
    cast: ['Isabella Storm', 'Derek Ironforge', 'Yuki Tanaka'],
    quality: '4K Dolby Vision',
    torrentId: '8',
    progress: 72,
    lastWatched: 'Yesterday',
    addedDate: '2024-01-14',
    matchScore: 95,
    mood: ['Epic', 'Dark', 'Adventure'],
  },
  {
    id: 'm3',
    title: 'Neon Requiem',
    year: 2023,
    rating: 8.4,
    duration: '1h 58m',
    genre: ['Thriller', 'Neo-Noir', 'Cyberpunk'],
    type: 'movie',
    poster: IMAGES.poster3,
    backdrop: IMAGES.poster3,
    description: 'In a rain-drenched megacity of 2087, a disgraced detective hunts a serial killer whose crimes reveal a conspiracy that could topple the corporate overlords who rule the world.',
    director: 'Kai Nakamura',
    cast: ['Vincent Ghost', 'Neon Lee', 'Marcus Blade'],
    quality: '1080p',
    torrentId: '2',
    progress: 0,
    addedDate: '2024-01-16',
    matchScore: 92,
    mood: ['Dark', 'Suspenseful', 'Stylish'],
  },
  {
    id: 'm4',
    title: 'WALL-E: New Dawn',
    year: 2024,
    rating: 8.9,
    duration: '1h 45m',
    genre: ['Animation', 'Family', 'Adventure'],
    type: 'movie',
    poster: IMAGES.poster4,
    backdrop: IMAGES.poster4,
    description: 'A small robot with a big heart discovers a hidden garden in the ruins of civilization and embarks on a journey to bring life back to a forgotten world. Heartwarming and visually stunning.',
    director: 'Pixar Collective',
    cast: ['Voice: Emma Stone', 'Voice: Pedro Pascal'],
    quality: '4K HDR',
    torrentId: '1',
    progress: 100,
    lastWatched: '3 days ago',
    addedDate: '2024-01-15',
    matchScore: 88,
    mood: ['Heartwarming', 'Beautiful', 'Family'],
  },
  {
    id: 'm5',
    title: 'The Corridor',
    year: 2023,
    rating: 7.8,
    duration: '1h 52m',
    genre: ['Horror', 'Psychological', 'Thriller'],
    type: 'movie',
    poster: IMAGES.poster5,
    backdrop: IMAGES.poster5,
    description: 'A nurse takes a night shift at an abandoned hospital, only to discover that the building has a consciousness of its own — and it remembers everything that happened within its walls.',
    director: 'Sarah Blackwell',
    cast: ['Lily Chen', 'Robert Graves', 'Ana Martinez'],
    quality: '1080p',
    torrentId: '7',
    progress: 0,
    addedDate: '2024-01-19',
    matchScore: 75,
    mood: ['Scary', 'Psychological', 'Atmospheric'],
  },
  {
    id: 'm6',
    title: 'Deep Blue Planet',
    year: 2024,
    rating: 9.4,
    duration: '6 Episodes',
    genre: ['Documentary', 'Nature', 'Ocean'],
    type: 'documentary',
    poster: IMAGES.poster6,
    backdrop: IMAGES.poster6,
    description: 'An unprecedented journey into the deepest oceans of Earth, revealing creatures and ecosystems never before filmed. Narrated by David Attenborough with groundbreaking underwater cinematography.',
    director: 'James Honeycutt',
    cast: ['Narrator: David Attenborough'],
    quality: '4K HDR',
    torrentId: '7',
    seasons: 1,
    episodes: 6,
    progress: 33,
    lastWatched: '5 hours ago',
    addedDate: '2024-01-12',
    matchScore: 96,
    mood: ['Awe-inspiring', 'Educational', 'Beautiful'],
  },
  {
    id: 'm7',
    title: 'Last Sunset',
    year: 2023,
    rating: 8.2,
    duration: '2h 05m',
    genre: ['Romance', 'Drama', 'Indie'],
    type: 'movie',
    poster: IMAGES.poster7,
    backdrop: IMAGES.poster7,
    description: 'Two strangers meet at a rooftop bar during the last sunset of the year and spend one magical night exploring the city, sharing secrets, and discovering that sometimes the most important connections are the briefest.',
    director: 'Sofia Moreau',
    cast: ['Alex Rivera', 'Jordan Kim'],
    quality: '1080p',
    torrentId: '4',
    progress: 0,
    addedDate: '2024-01-10',
    matchScore: 82,
    mood: ['Romantic', 'Melancholic', 'Beautiful'],
  },
  {
    id: 's1',
    title: 'The Signal',
    year: 2024,
    rating: 9.0,
    duration: '45m episodes',
    genre: ['Sci-Fi', 'Thriller', 'Mystery'],
    type: 'show',
    poster: IMAGES.poster1,
    backdrop: IMAGES.hero,
    description: 'When a mysterious signal from deep space begins affecting people around the world, a team of scientists races to decode its message before it\'s too late. Each episode reveals another layer of the conspiracy.',
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Zendaya', 'Oscar Isaac'],
    quality: '4K HDR',
    torrentId: '8',
    seasons: 2,
    episodes: 16,
    progress: 60,
    lastWatched: 'Last night',
    addedDate: '2024-01-14',
    matchScore: 97,
    mood: ['Mind-bending', 'Suspenseful', 'Epic'],
  },
  {
    id: 's2',
    title: 'Shadow Realm',
    year: 2023,
    rating: 8.8,
    duration: '55m episodes',
    genre: ['Fantasy', 'Drama', 'Adventure'],
    type: 'show',
    poster: IMAGES.poster2,
    backdrop: IMAGES.poster2,
    description: 'In a world where magic is dying, the last sorcerers must find the mythical Shadow Realm to restore balance. Political intrigue, ancient prophecies, and epic battles across stunning landscapes.',
    director: 'R.R. Martin',
    cast: ['Emilia Clarke', 'Jason Momoa', 'Pedro Pascal'],
    quality: '4K Dolby Vision',
    torrentId: '8',
    seasons: 3,
    episodes: 24,
    progress: 85,
    lastWatched: '2 days ago',
    addedDate: '2024-01-12',
    matchScore: 94,
    mood: ['Epic', 'Dark fantasy', 'Complex'],
  },
];

export const getContinueWatching = () => mediaLibrary.filter((m) => m.progress && m.progress > 0 && m.progress < 100);
export const getRecentlyAdded = () => [...mediaLibrary].sort((a, b) => b.addedDate.localeCompare(a.addedDate));
export const getTopRated = () => [...mediaLibrary].sort((a, b) => b.rating - a.rating);
export const getMovies = () => mediaLibrary.filter((m) => m.type === 'movie');
export const getShows = () => mediaLibrary.filter((m) => m.type === 'show');
export const getDocumentaries = () => mediaLibrary.filter((m) => m.type === 'documentary');
export const getAIRecommended = () => [...mediaLibrary].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
export const getFeatured = () => mediaLibrary[0]; // Top match for hero

export { IMAGES };
