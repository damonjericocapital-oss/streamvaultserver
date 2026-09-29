import { motion } from 'framer-motion';
import {
  Folder,
  FileVideo,
  FileAudio,
  FileText,
  File,
  ChevronRight,
  HardDrive,
  Play,
  Download,
  Trash2,
  Search,
  Grid3X3,
  List,
} from 'lucide-react';
import { useState } from 'react';
import { Torrent } from '../types';

interface FileBrowserProps {
  torrents: Torrent[];
}

interface FileNode {
  name: string;
  type: 'folder' | 'video' | 'audio' | 'subtitle' | 'other';
  size: string;
  sizeBytes: number;
  path: string;
  children?: FileNode[];
}

export default function FileBrowser({ torrents }: FileBrowserProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPath, setCurrentPath] = useState('/downloads/torrents');
  const [searchQuery, setSearchQuery] = useState('');

  // Build file tree from torrents
  const fileTree: FileNode[] = [
    {
      name: 'Movies',
      type: 'folder',
      size: '35.2 GB',
      sizeBytes: 35200000000,
      path: '/downloads/torrents/Movies',
      children: [
        {
          name: 'Big Buck Bunny (2008)',
          type: 'folder',
          size: '2.1 GB',
          sizeBytes: 2147483648,
          path: '/downloads/torrents/Movies/Big Buck Bunny',
          children: [
            { name: 'Big.Buck.Bunny.2008.1080p.mkv', type: 'video', size: '2.0 GB', sizeBytes: 2000000000, path: '' },
            { name: 'Big.Buck.Bunny.2008.srt', type: 'subtitle', size: '45 KB', sizeBytes: 45000, path: '' },
            { name: 'NFO.nfo', type: 'other', size: '12 KB', sizeBytes: 12000, path: '' },
          ],
        },
        {
          name: 'Sintel (2010)',
          type: 'folder',
          size: '850 MB',
          sizeBytes: 891289600,
          path: '/downloads/torrents/Movies/Sintel',
          children: [
            { name: 'Sintel.2010.720p.mkv', type: 'video', size: '820 MB', sizeBytes: 820000000, path: '' },
            { name: 'Sintel.2010.en.srt', type: 'subtitle', size: '32 KB', sizeBytes: 32000, path: '' },
          ],
        },
        {
          name: 'Tears of Steel (2012)',
          type: 'folder',
          size: '8.5 GB',
          sizeBytes: 9126805504,
          path: '/downloads/torrents/Movies/Tears of Steel',
          children: [
            { name: 'Tears.of.Steel.2012.2160p.mkv', type: 'video', size: '8.2 GB', sizeBytes: 8200000000, path: '' },
            { name: 'Tears.of.Steel.2012.en.srt', type: 'subtitle', size: '56 KB', sizeBytes: 56000, path: '' },
            { name: 'Tears.of.Steel.2012.es.srt', type: 'subtitle', size: '48 KB', sizeBytes: 48000, path: '' },
          ],
        },
        {
          name: 'Elephants Dream (2006)',
          type: 'folder',
          size: '1.8 GB',
          sizeBytes: 1932735283,
          path: '/downloads/torrents/Movies/Elephants Dream',
          children: [
            { name: 'Elephants.Dream.2006.1080p.mkv', type: 'video', size: '1.7 GB', sizeBytes: 1700000000, path: '' },
          ],
        },
      ],
    },
    {
      name: 'Music',
      type: 'folder',
      size: '3.2 GB',
      sizeBytes: 3435973837,
      path: '/downloads/torrents/Music',
      children: [
        {
          name: 'CC Music Collection',
          type: 'folder',
          size: '3.2 GB',
          sizeBytes: 3435973837,
          path: '/downloads/torrents/Music/CC Collection',
          children: [
            { name: 'track01.flac', type: 'audio', size: '45 MB', sizeBytes: 45000000, path: '' },
            { name: 'track02.flac', type: 'audio', size: '52 MB', sizeBytes: 52000000, path: '' },
            { name: 'track03.flac', type: 'audio', size: '48 MB', sizeBytes: 48000000, path: '' },
          ],
        },
      ],
    },
    {
      name: 'Software',
      type: 'folder',
      size: '4.7 GB',
      sizeBytes: 5046411264,
      path: '/downloads/torrents/Software',
      children: [
        { name: 'ubuntu-24.04-desktop-amd64.iso', type: 'other', size: '4.7 GB', sizeBytes: 5046411264, path: '' },
      ],
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return <Folder className="w-5 h-5 text-amber-400" />;
      case 'video':
        return <FileVideo className="w-5 h-5 text-emerald-400" />;
      case 'audio':
        return <FileAudio className="w-5 h-5 text-cyan-400" />;
      case 'subtitle':
        return <FileText className="w-5 h-5 text-amber-400" />;
      default:
        return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">File Browser</h2>
          <p className="text-gray-400 text-sm mt-1">Browse downloaded files and folders</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Breadcrumb & Search */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 flex-1 bg-gray-800/50 rounded-xl border border-gray-700/50 px-3 py-2">
          <HardDrive className="w-4 h-4 text-gray-400" />
          {currentPath.split('/').filter(Boolean).map((segment, i, arr) => (
            <span key={i} className="flex items-center">
              {i > 0 && <ChevronRight className="w-3 h-3 text-gray-600 mx-1" />}
              <span className={`text-sm ${i === arr.length - 1 ? 'text-white' : 'text-gray-400'}`}>
                {segment}
              </span>
            </span>
          ))}
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="pl-9 pr-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700/50 text-white text-sm outline-none focus:border-emerald-500 w-48"
          />
        </div>
      </div>

      {/* Storage Info */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Storage Usage</span>
          <span className="text-sm text-white font-mono">1.4 TB / 2 TB</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full w-[70%] bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span>Videos: 35.2 GB</span>
          <span>Audio: 3.2 GB</span>
          <span>Other: 4.7 GB</span>
        </div>
      </div>

      {/* File List */}
      {viewMode === 'list' ? (
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-700/50 text-xs text-gray-500 font-medium">
            <span className="col-span-6">Name</span>
            <span className="col-span-2">Size</span>
            <span className="col-span-2">Type</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>
          {/* Files */}
          {fileTree.map((node, index) => (
            <FileRow key={index} node={node} getFileIcon={getFileIcon} depth={0} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {fileTree.map((node, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -2 }}
              className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 text-center cursor-pointer hover:border-gray-600/50 transition-all"
            >
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                {getFileIcon(node.type)}
              </div>
              <p className="text-xs text-white truncate">{node.name}</p>
              <p className="text-xs text-gray-500 mt-1">{node.size}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function FileRow({
  node,
  getFileIcon,
  depth,
}: {
  node: FileNode;
  getFileIcon: (type: string) => React.ReactNode;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-12 gap-4 px-4 py-2.5 hover:bg-gray-700/20 transition-colors items-center cursor-pointer"
        style={{ paddingLeft: `${16 + depth * 20}px` }}
        onClick={() => node.type === 'folder' && setExpanded(!expanded)}
      >
        <div className="col-span-6 flex items-center gap-2">
          {node.type === 'folder' && (
            <ChevronRight
              className={`w-3 h-3 text-gray-500 transition-transform ${expanded ? 'rotate-90' : ''}`}
            />
          )}
          {getFileIcon(node.type)}
          <span className="text-sm text-white truncate">{node.name}</span>
        </div>
        <span className="col-span-2 text-xs text-gray-400">{node.size}</span>
        <span className="col-span-2 text-xs text-gray-500 capitalize">{node.type}</span>
        <div className="col-span-2 flex items-center justify-end gap-1">
          {node.type === 'video' && (
            <button className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-emerald-400 transition-colors">
              <Play className="w-3 h-3" />
            </button>
          )}
          <button className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
            <Download className="w-3 h-3" />
          </button>
          <button className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400 transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
      {expanded && node.children?.map((child, i) => (
        <FileRow key={i} node={child} getFileIcon={getFileIcon} depth={depth + 1} />
      ))}
    </>
  );
}
