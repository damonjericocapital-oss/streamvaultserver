import { motion } from 'framer-motion';
import { Play, Info, Star, Clock, CheckCircle } from 'lucide-react';
import { MediaItem } from '../data/mediaLibrary';

interface MediaCardProps {
  item: MediaItem;
  index: number;
  onPlay: (item: MediaItem) => void;
  onDetail: (item: MediaItem) => void;
  size?: 'normal' | 'large';
}

export default function MediaCard({ item, index, onPlay, onDetail, size = 'normal' }: MediaCardProps) {
  const isLarge = size === 'large';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      className={`relative group cursor-pointer flex-shrink-0 ${
        isLarge ? 'w-52' : 'w-40'
      }`}
      onClick={() => onDetail(item)}
    >
      {/* Poster */}
      <div className={`relative overflow-hidden rounded-xl ${isLarge ? 'aspect-[2/3]' : 'aspect-[2/3]'} bg-gray-800`}>
        <img
          src={item.poster}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quality Badge */}
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white border border-white/10">
          {item.quality}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm">
          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-bold text-white">{item.rating}</span>
        </div>

        {/* Progress Bar (if partially watched) */}
        {item.progress && item.progress > 0 && item.progress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}

        {/* Completed Badge */}
        {item.progress === 100 && (
          <div className="absolute top-2 left-2">
            <CheckCircle className="w-5 h-5 text-emerald-400 fill-gray-900" />
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onPlay(item);
            }}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          </motion.button>
        </div>

        {/* Bottom Info on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 text-[10px] text-gray-300">
            <span className="flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              {item.duration}
            </span>
            <span>•</span>
            <span>{item.year}</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {item.year} • {item.genre[0]}
        </p>
      </div>
    </motion.div>
  );
}
