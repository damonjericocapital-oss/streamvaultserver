import { motion } from 'framer-motion';
import { Sparkles, Play, Clock, TrendingUp, Star, Film, Tv, Music, Sparkle } from 'lucide-react';
import HeroBanner from './HeroBanner';
import ContentRow from './ContentRow';
import { MediaItem } from '../data/mediaLibrary';
import {
  getContinueWatching,
  getRecentlyAdded,
  getTopRated,
  getMovies,
  getShows,
  getDocumentaries,
  getAIRecommended,
  getFeatured,
} from '../data/mediaLibrary';

interface MediaHomeProps {
  onPlay: (item: MediaItem) => void;
  onDetail: (item: MediaItem) => void;
}

export default function MediaHome({ onPlay, onDetail }: MediaHomeProps) {
  const featured = getFeatured();
  const continueWatching = getContinueWatching();
  const aiRecommended = getAIRecommended();
  const recentlyAdded = getRecentlyAdded();
  const topRated = getTopRated();
  const movies = getMovies();
  const shows = getShows();
  const docs = getDocumentaries();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
      {/* Hero Banner */}
      <HeroBanner item={featured} onPlay={onPlay} onDetail={onDetail} />

      {/* Content Rows */}
      <div className="px-1">
        {/* Continue Watching - Priority row */}
        {continueWatching.length > 0 && (
          <ContentRow
            title="Continue Watching"
            items={continueWatching}
            onPlay={onPlay}
            onDetail={onDetail}
            icon={<Clock className="w-4 h-4" />}
            size="large"
          />
        )}

        {/* AI Recommendations */}
        <ContentRow
          title="Recommended for You"
          items={aiRecommended}
          onPlay={onPlay}
          onDetail={onDetail}
          icon={<Sparkles className="w-4 h-4" />}
          size="large"
        />

        {/* Recently Added */}
        <ContentRow
          title="Recently Added"
          items={recentlyAdded}
          onPlay={onPlay}
          onDetail={onDetail}
          icon={<TrendingUp className="w-4 h-4" />}
        />

        {/* Top Rated */}
        <ContentRow
          title="Top Rated"
          items={topRated}
          onPlay={onPlay}
          onDetail={onDetail}
          icon={<Star className="w-4 h-4" />}
        />

        {/* Movies */}
        <ContentRow
          title="Movies"
          items={movies}
          onPlay={onPlay}
          onDetail={onDetail}
          icon={<Film className="w-4 h-4" />}
        />

        {/* TV Shows */}
        {shows.length > 0 && (
          <ContentRow
            title="TV Shows"
            items={shows}
            onPlay={onPlay}
            onDetail={onDetail}
            icon={<Tv className="w-4 h-4" />}
          />
        )}

        {/* Documentaries */}
        {docs.length > 0 && (
          <ContentRow
            title="Documentaries"
            items={docs}
            onPlay={onPlay}
            onDetail={onDetail}
            icon={<Sparkle className="w-4 h-4" />}
          />
        )}
      </div>
    </motion.div>
  );
}
