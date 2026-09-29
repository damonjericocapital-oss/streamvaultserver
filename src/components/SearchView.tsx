import { motion } from 'framer-motion';
import { Search, Download, Star, Calendar, HardDrive, Users, Magnet, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface SearchResult {
  id: string;
  name: string;
  size: string;
  seeds: number;
  peers: number;
  date: string;
  category: string;
  rating: number;
}

const mockResults: SearchResult[] = [
  { id: '1', name: 'Big Buck Bunny (2008) [1080p] [BluRay] [x264] [5.1]', size: '2.1 GB', seeds: 456, peers: 89, date: '2024-01-15', category: 'Movies', rating: 4.5 },
  { id: '2', name: 'Sintel (2010) [720p] [WEB-DL] [AAC2.0] [x264]', size: '850 MB', seeds: 234, peers: 45, date: '2024-01-16', category: 'Movies', rating: 4.2 },
  { id: '3', name: 'Tears of Steel (2012) [2160p] [4K] [HDR] [DTS-HD MA]', size: '8.5 GB', seeds: 678, peers: 123, date: '2024-01-17', category: 'Movies', rating: 4.8 },
  { id: '4', name: 'Ubuntu 24.04 LTS Desktop [amd64] [ISO]', size: '4.7 GB', seeds: 1234, peers: 567, date: '2024-01-18', category: 'Software', rating: 4.7 },
  { id: '5', name: 'Creative Commons Music Pack Vol.1-10 [FLAC 24bit]', size: '12.3 GB', seeds: 89, peers: 23, date: '2024-01-14', category: 'Music', rating: 4.3 },
  { id: '6', name: 'Blender Open Movies Complete Collection [4K Remaster]', size: '22.7 GB', seeds: 890, peers: 234, date: '2024-01-12', category: 'Movies', rating: 4.9 },
  { id: '7', name: 'Linux Kernel Source 6.8 [tar.gz]', size: '145 MB', seeds: 2345, peers: 890, date: '2024-01-19', category: 'Software', rating: 4.6 },
  { id: '8', name: 'Open Source Documentary - The Code Revolution [1080p]', size: '3.2 GB', seeds: 156, peers: 45, date: '2024-01-13', category: 'Documentaries', rating: 4.4 },
];

export default function SearchView() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>(mockResults);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setResults(mockResults.filter((r) => r.name.toLowerCase().includes(query.toLowerCase())));
      setIsSearching(false);
    }, 800);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Torrent Search</h2>
        <p className="text-gray-400 text-sm mt-1">Search across multiple torrent indexes</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          <Search className="w-5 h-5 text-gray-400 ml-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search torrents by name, category, or magnet link..."
            className="flex-1 bg-transparent text-white px-4 py-4 outline-none placeholder-gray-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {['All', 'Movies', 'TV Shows', 'Music', 'Software', 'Games', 'Documentaries', 'Anime'].map((cat) => (
          <button
            key={cat}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700 transition-all"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-2">
        {results.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 hover:border-gray-600/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
                    {result.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-700 text-gray-400">
                    {result.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3" /> {result.size}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Users className="w-3 h-3" /> {result.seeds} seeds
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {result.date}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3 h-3" /> {result.rating}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition-colors"
                >
                  <Download className="w-3 h-3" /> Download
                </motion.button>
                <button className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                  <Magnet className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
