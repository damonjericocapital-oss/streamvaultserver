import { motion } from 'framer-motion';
import {
  X, Play, Plus, Download, Share2, Star, Clock, Calendar,
  Film, Users, Sparkles, CheckCircle, ChevronRight
} from 'lucide-react';
import { MediaItem } from '../data/mediaLibrary';

interface MediaDetailProps {
  item: MediaItem;
  onClose: () => void;
  onPlay: (item: MediaItem) => void;
}

export default function MediaDetail({ item, onClose, onPlay }: MediaDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl mx-auto mt-8 mb-8 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
      >
        {/* Backdrop */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={item.backdrop}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content over backdrop */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-end gap-6">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-40 h-60 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-700 flex-shrink-0"
              >
                <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
              </motion.div>

              {/* Title & Meta */}
              <div className="flex-1 pb-2">
                <h1 className="text-4xl font-bold text-white mb-2">{item.title}</h1>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    {item.rating}
                  </span>
                  <span className="text-gray-400">{item.year}</span>
                  <span className="text-gray-400">{item.duration}</span>
                  <span className="px-2 py-0.5 rounded border border-gray-600 text-xs text-gray-300 font-mono">
                    {item.quality}
                  </span>
                  {item.type === 'show' && (
                    <span className="text-gray-400">
                      {item.seasons} Season{item.seasons! > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {item.genre.map((g) => (
                    <span key={g} className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-gray-300">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPlay(item)}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
            >
              <Play className="w-5 h-5" fill="black" />
              {item.progress && item.progress > 0 && item.progress < 100 ? 'Continue Watching' : 'Play'}
            </motion.button>
            <button className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/10">
              <Plus className="w-5 h-5" />
            </button>
            {item.progress === 100 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">Watched</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {item.progress && item.progress > 0 && item.progress < 100 && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Continue from {Math.round(item.progress * 2.28)}min</span>
                <span>{item.progress}% complete</span>
              </div>
              <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Description */}
            <div className="md:col-span-2 space-y-6">
              {/* AI Match */}
              {item.matchScore && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400">
                    <strong>{item.matchScore}% match</strong> based on your viewing history and preferences
                  </span>
                </div>
              )}

              <p className="text-gray-300 leading-relaxed">{item.description}</p>

              {/* Mood Tags */}
              {item.mood && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Mood</h4>
                  <div className="flex items-center gap-2">
                    {item.mood.map((m) => (
                      <span key={m} className="px-3 py-1 rounded-full bg-gray-800 text-xs text-gray-300 border border-gray-700">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Episodes (for shows) */}
              {item.type === 'show' && item.episodes && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Episodes</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {Array.from({ length: Math.min(8, item.episodes) }, (_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer group"
                      >
                        <span className="text-sm text-gray-500 font-mono w-6">{i + 1}</span>
                        <div className="flex-1">
                          <p className="text-sm text-white">Episode {i + 1}</p>
                          <p className="text-xs text-gray-500">45 min</p>
                        </div>
                        <Play className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-4">
              {item.director && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Director</h4>
                  <p className="text-sm text-white">{item.director}</p>
                </div>
              )}
              {item.cast && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Cast</h4>
                  <div className="flex flex-wrap gap-1">
                    {item.cast.map((actor) => (
                      <span key={actor} className="text-sm text-gray-300">{actor}</span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Added</h4>
                <p className="text-sm text-gray-300 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> {item.addedDate}
                </p>
              </div>
              {item.lastWatched && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Last Watched</h4>
                  <p className="text-sm text-gray-300 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {item.lastWatched}
                  </p>
                </div>
              )}
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Source</h4>
                <div className="flex items-center gap-2">
                  <Film className="w-3 h-3 text-emerald-400" />
                  <span className="text-sm text-emerald-400">P2P Stream Ready</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Streaming via {Math.floor(Math.random() * 100 + 50)} peers</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
