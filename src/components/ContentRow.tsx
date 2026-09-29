import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../data/mediaLibrary';
import MediaCard from './MediaCard';

interface ContentRowProps {
  title: string;
  items: MediaItem[];
  onPlay: (item: MediaItem) => void;
  onDetail: (item: MediaItem) => void;
  icon?: React.ReactNode;
  size?: 'normal' | 'large';
}

export default function ContentRow({ title, items, onPlay, onDetail, icon, size = 'normal' }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -400 : 400;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
  };

  if (items.length === 0) return null;

  return (
    <div className="relative group/row mb-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        {icon && <span className="text-emerald-400">{icon}</span>}
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <span className="text-xs text-gray-500 ml-1">{items.length} titles</span>
      </div>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-8 z-10 w-12 bg-gradient-to-r from-gray-950/90 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
              <ChevronLeft className="w-5 h-5 text-white" />
            </div>
          </motion.button>
        )}

        {/* Content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, index) => (
            <MediaCard
              key={item.id}
              item={item}
              index={index}
              onPlay={onPlay}
              onDetail={onDetail}
              size={size}
            />
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-8 z-10 w-12 bg-gradient-to-l from-gray-950/90 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </motion.button>
        )}
      </div>
    </div>
  );
}
