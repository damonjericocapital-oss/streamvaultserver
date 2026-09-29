import { motion } from 'framer-motion';
import { Sparkles, Play, Clock, TrendingUp, Star, Film, Tv, Music, Sparkle, Heart } from 'lucide-react';
import HeroBanner from './HeroBanner';
import ContentRow from './ContentRow';
import { MediaItem, mediaLibrary } from '../data/mediaLibrary';
import { useUser } from '../context/UserContext';
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
  const { currentUser } = useUser();
  const featured = getFeatured();

  // Personalized continue watching based on user's watch history
  const continueWatching: MediaItem[] = (() => {
    if (!currentUser || currentUser.watchHistory.length === 0) {
      return getContinueWatching();
    }
    // Merge user watch history with media data
    const fromHistory: MediaItem[] = currentUser.watchHistory
      .filter((h) => h.progress > 0 && h.progress < 100)
      .map((h): MediaItem | null => {
        const media = mediaLibrary.find((m) => m.id === h.mediaId);
        if (!media) return null;
        return { ...media, progress: h.progress, lastWatched: h.watchedAt } as MediaItem;
      })
      .filter((m): m is MediaItem => m !== null);
    
    const remaining = getContinueWatching()
      .filter((m) => !currentUser.watchHistory.some((h) => h.mediaId === m.id));
    
    return [...fromHistory, ...remaining].slice(0, 10);
  })();

  // User's watchlist
  const watchlist = currentUser
    ? currentUser.watchlist
        .map((id) => mediaLibrary.find((m) => m.id === id))
        .filter((m): m is MediaItem => m !== null)
    : [];

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
            title={`Continue Watching for ${currentUser?.username || 'You'}`}
            items={continueWatching}
            onPlay={onPlay}
            onDetail={onDetail}
            icon={<Clock className="w-4 h-4" />}
            size="large"
          />
        )}

        {/* User's Watchlist */}
        {watchlist.length > 0 && (
          <ContentRow
            title="My Watchlist"
            items={watchlist}
            onPlay={onPlay}
            onDetail={onDetail}
            icon={<Heart className="w-4 h-4" />}
          />
        )}

        {/* AI Recommendations */}
        <ContentRow
          title={`${currentUser?.username || 'Your'} Recommendations`}
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
