import { motion } from 'framer-motion';
import { Play, Info, Star, Clock, Sparkles } from 'lucide-react';
import { MediaItem } from '../data/mediaLibrary';

interface HeroBannerProps {
  item: MediaItem;
  onPlay: (item: MediaItem) => void;
  onDetail: (item: MediaItem) => void;
}

export default function HeroBanner({ item, onPlay, onDetail }: HeroBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden rounded-2xl mb-8"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={item.backdrop}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/30" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end pb-16 px-12">
        <div className="max-w-2xl">
          {/* AI Recommendation Badge */}
          {item.matchScore && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">
                  NEXUS recommends • {item.matchScore}% match
                </span>
              </div>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-white mb-3 leading-tight"
          >
            {item.title}
          </motion.h1>

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-4 text-sm"
          >
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              {item.rating}
            </span>
            <span className="text-gray-400">{item.year}</span>
            <span className="text-gray-400">{item.duration}</span>
            <span className="px-2 py-0.5 rounded border border-gray-600 text-xs text-gray-300">
              {item.quality}
            </span>
            {item.genre.map((g) => (
              <span key={g} className="text-gray-400 text-xs">{g}</span>
            ))}
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3 max-w-xl"
          >
            {item.description}
          </motion.p>

          {/* Progress (if partially watched) */}
          {item.progress && item.progress > 0 && item.progress < 100 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-4"
            >
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <Clock className="w-3 h-3" />
                <span>Continue watching • {item.progress}% completed</span>
              </div>
              <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPlay(item)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors shadow-lg"
            >
              <Play className="w-5 h-5" fill="black" />
              {item.progress && item.progress > 0 ? 'Continue' : 'Play'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDetail(item)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold text-sm border border-white/20 hover:bg-white/20 transition-colors"
            >
              <Info className="w-5 h-5" />
              More Info
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
