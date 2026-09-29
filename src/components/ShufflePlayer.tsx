import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Play, SkipForward, Heart, X } from 'lucide-react';
import { ShuffleConfig } from '../types/ecosystem';
import { mediaLibrary, MediaItem } from '../data/mediaLibrary';

interface ShufflePlayerProps {
  config: ShuffleConfig;
  onConfigChange: (config: ShuffleConfig) => void;
  onPlay: (item: MediaItem) => void;
  onClose: () => void;
}

export default function ShufflePlayer({ config, onConfigChange, onPlay, onClose }: ShufflePlayerProps) {
  const [currentShuffle, setCurrentShuffle] = useState<MediaItem[]>([]);

  const handleGenerateShuffle = () => {
    let filtered = [...mediaLibrary];

    // Apply filters
    if (!config.includeWatched) {
      filtered = filtered.filter((m) => !config.history.includes(m.id));
    }
    if (config.minRating > 0) {
      filtered = filtered.filter((m) => m.rating >= config.minRating);
    }
    if (config.genres.length > 0) {
      filtered = filtered.filter((m) => m.genre.some((g) => config.genres.includes(g)));
    }
    if (config.moods.length > 0) {
      filtered = filtered.filter((m) => m.mood?.some((mood) => config.moods.includes(mood)));
    }

    // Shuffle based on mode
    let shuffled: MediaItem[];
    switch (config.mode) {
      case 'by_genre':
        // Pick random genre first, then shuffle within it
        const randomGenre = config.genres[0] || filtered[0]?.genre[0];
        shuffled = filtered.filter((m) => m.genre.includes(randomGenre));
        break;
      case 'by_mood':
        const randomMood = config.moods[0] || filtered[0]?.mood?.[0] || '';
        shuffled = filtered.filter((m) => m.mood?.includes(randomMood));
        break;
      case 'smart_ai':
        // Sort by match score (AI recommendation)
        shuffled = filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        break;
      default:
        shuffled = filtered;
    }

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setCurrentShuffle(shuffled.slice(0, 10));
  };

  const handlePlayItem = (item: MediaItem) => {
    onPlay(item);
    onConfigChange({
      ...config,
      history: [...config.history, item.id],
    });
  };

  const genres = ['Sci-Fi', 'Fantasy', 'Action', 'Drama', 'Thriller', 'Horror', 'Romance', 'Animation'];
  const moods = ['Epic', 'Dark', 'Heartwarming', 'Suspenseful', 'Beautiful', 'Family', 'Scary'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-[550px] bg-gray-900/98 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-pink-500/5 to-rose-500/5">
        <div className="flex items-center gap-2">
          <Shuffle className="w-5 h-5 text-pink-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Shuffle & Random Play</h3>
            <p className="text-xs text-gray-500">Discover content randomly</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {/* Shuffle Mode */}
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Shuffle Mode</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'complete_random', label: '🎲 Complete Random' },
              { value: 'by_genre', label: '🎭 By Genre' },
              { value: 'by_mood', label: '💭 By Mood' },
              { value: 'smart_ai', label: '🤖 Smart AI' },
            ].map((mode) => (
              <button
                key={mode.value}
                onClick={() =>
                  onConfigChange({ ...config, mode: mode.value as ShuffleConfig['mode'] })
                }
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  config.mode === mode.value
                    ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                    : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
            <div>
              <p className="text-sm font-medium text-white">Include Watched</p>
              <p className="text-xs text-gray-500">Show already watched content</p>
            </div>
            <button
              onClick={() =>
                onConfigChange({ ...config, includeWatched: !config.includeWatched })
              }
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config.includeWatched ? 'bg-pink-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: config.includeWatched ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Minimum Rating: {config.minRating}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={config.minRating}
              onChange={(e) =>
                onConfigChange({ ...config, minRating: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>

          {/* Genre Filter */}
          {(config.mode === 'by_genre' || config.mode === 'complete_random') && (
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Genres</label>
              <div className="flex flex-wrap gap-1">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => {
                      const newGenres = config.genres.includes(genre)
                        ? config.genres.filter((g) => g !== genre)
                        : [...config.genres, genre];
                      onConfigChange({ ...config, genres: newGenres });
                    }}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      config.genres.includes(genre)
                        ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mood Filter */}
          {(config.mode === 'by_mood' || config.mode === 'complete_random') && (
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Moods</label>
              <div className="flex flex-wrap gap-1">
                {moods.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => {
                      const newMoods = config.moods.includes(mood)
                        ? config.moods.filter((m) => m !== mood)
                        : [...config.moods, mood];
                      onConfigChange({ ...config, moods: newMoods });
                    }}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      config.moods.includes(mood)
                        ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerateShuffle}
          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium flex items-center justify-center gap-2"
        >
          <Shuffle className="w-5 h-5" />
          Generate Shuffle Queue
        </motion.button>

        {/* Shuffle Queue */}
        {currentShuffle.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              Shuffle Queue ({currentShuffle.length})
            </h4>
            <div className="space-y-2">
              {currentShuffle.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors group"
                >
                  <span className="text-xs text-gray-500 font-mono w-6">{index + 1}</span>
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-10 h-14 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {item.year} • {item.genre[0]} • ⭐ {item.rating}
                    </p>
                  </div>
                  <button
                    onClick={() => handlePlayItem(item)}
                    className="p-2 rounded-lg bg-pink-500/20 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
