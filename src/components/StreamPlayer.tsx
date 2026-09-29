import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Subtitles,
  SkipForward,
  SkipBack,
  X,
  ChevronDown,
  Check,
  Gauge,
} from 'lucide-react';
import { SubtitleTrack, AudioTrack, PlayerSettings, DEFAULT_PLAYER_SETTINGS } from '../types/player';
import { SAMPLE_SUBTITLE_TRACKS, SAMPLE_AUDIO_TRACKS } from '../types/player';
import { parseSubtitles, getActiveCue, formatTime, generateSampleCues } from '../utils/subtitleParser';
import type { SubtitleCue } from '../types/player';

interface StreamPlayerProps {
  onClose: () => void;
  title: string;
  backdrop?: string;
}

export default function StreamPlayer({ onClose, title, backdrop }: StreamPlayerProps) {
  // Player state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(120); // 2 minutes demo
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);

  // Subtitle state
  const [subtitles, setSubtitles] = useState<SubtitleCue[]>(generateSampleCues());
  const [activeSubtitleTrack, setActiveSubtitleTrack] = useState<SubtitleTrack | null>(SAMPLE_SUBTITLE_TRACKS[0]);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);

  // Audio state
  const [audioTracks] = useState<AudioTrack[]>(SAMPLE_AUDIO_TRACKS);
  const [activeAudioTrack, setActiveAudioTrack] = useState<AudioTrack>(SAMPLE_AUDIO_TRACKS[0]);
  const [showAudioMenu, setShowAudioMenu] = useState(false);

  // Settings
  const [playerSettings, setPlayerSettings] = useState<PlayerSettings>(DEFAULT_PLAYER_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);

  // Refs
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Simulate playback progress
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1 * playerSettings.playbackSpeed;
          if (next >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return next;
        });
        setBuffered((prev) => Math.min(prev + 0.5, duration));
      }, 100);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, duration, playerSettings.playbackSpeed]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          setIsMuted((prev) => !prev);
          break;
        case 'arrowleft':
          e.preventDefault();
          seekBackward(10);
          break;
        case 'arrowright':
          e.preventDefault();
          seekForward(10);
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume((prev) => Math.min(100, prev + 10));
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume((prev) => Math.max(0, prev - 10));
          break;
        case 'c':
          e.preventDefault();
          toggleSubtitles();
          break;
        case 'escape':
          if (isFullscreen) {
            toggleFullscreen();
          } else {
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onClose]);

  // Handlers
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const seekForward = useCallback((seconds: number) => {
    setCurrentTime((prev) => Math.min(duration, prev + seconds));
  }, [duration]);

  const seekBackward = useCallback((seconds: number) => {
    setCurrentTime((prev) => Math.max(0, prev - seconds));
  }, []);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setCurrentTime(percent * duration);
  };

  const toggleSubtitles = useCallback(() => {
    if (activeSubtitleTrack) {
      setActiveSubtitleTrack(null);
    } else {
      setActiveSubtitleTrack(SAMPLE_SUBTITLE_TRACKS[0]);
    }
  }, [activeSubtitleTrack]);

  const handleSubtitleTrackChange = (track: SubtitleTrack | null) => {
    setActiveSubtitleTrack(track);
    setShowSubtitleMenu(false);
  };

  const handleAudioTrackChange = (track: AudioTrack) => {
    setActiveAudioTrack(track);
    setShowAudioMenu(false);
  };

  // Get current subtitle
  const activeCue = activeSubtitleTrack ? getActiveCue(subtitles, currentTime) : null;

  // Calculate progress percentage
  const progressPercent = (currentTime / duration) * 100;
  const bufferedPercent = (buffered / duration) * 100;

  return (
    <motion.div
      ref={playerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
      onMouseMove={() => setShowControls(true)}
      onClick={togglePlay}
    >
      {/* Video Background */}
      <div className="absolute inset-0">
        {backdrop ? (
          <img src={backdrop} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Subtitle Display */}
      <AnimatePresence>
        {activeCue && (
          <motion.div
            key={activeCue.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute left-1/2 -translate-x-1/2 ${
              playerSettings.subtitlePosition === 'bottom' ? 'bottom-32' : 'top-20'
            } max-w-4xl px-4`}
          >
            <div
              className="px-4 py-2 rounded text-center"
              style={{
                backgroundColor: `${playerSettings.subtitleBackground}${Math.round(playerSettings.subtitleOpacity * 255).toString(16).padStart(2, '0')}`,
                color: playerSettings.subtitleColor,
                fontSize:
                  playerSettings.subtitleSize === 'small'
                    ? '1rem'
                    : playerSettings.subtitleSize === 'medium'
                    ? '1.25rem'
                    : playerSettings.subtitleSize === 'large'
                    ? '1.5rem'
                    : '2rem',
              }}
            >
              {activeCue.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{title}</h2>
                  <p className="text-sm text-gray-300 mt-1">
                    {activeAudioTrack.label} • {activeAudioTrack.channels}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence>
                {!isPlaying && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={togglePlay}
                    className="p-6 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    <Play className="w-16 h-16 text-white" fill="white" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div
                  className="relative h-1 bg-white/20 rounded-full cursor-pointer group hover:h-2 transition-all"
                  onClick={handleProgressClick}
                >
                  {/* Buffered */}
                  <div
                    className="absolute top-0 left-0 h-full bg-white/30 rounded-full"
                    style={{ width: `${bufferedPercent}%` }}
                  />
                  {/* Progress */}
                  <div
                    className="absolute top-0 left-0 h-full bg-amber-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" fill="white" />
                    ) : (
                      <Play className="w-8 h-8 text-white" fill="white" />
                    )}
                  </button>

                  {/* Skip Backward */}
                  <button
                    onClick={() => seekBackward(10)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <SkipBack className="w-6 h-6 text-white" />
                  </button>

                  {/* Skip Forward */}
                  <button
                    onClick={() => seekForward(10)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <SkipForward className="w-6 h-6 text-white" />
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-2 group">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-6 h-6 text-white" />
                      ) : (
                        <Volume2 className="w-6 h-6 text-white" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(Number(e.target.value));
                        if (isMuted) setIsMuted(false);
                      }}
                      className="w-0 group-hover:w-24 transition-all opacity-0 group-hover:opacity-100"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Subtitles */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowSubtitleMenu(!showSubtitleMenu);
                        setShowAudioMenu(false);
                        setShowSettings(false);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        activeSubtitleTrack ? 'bg-amber-500/20 text-amber-400' : 'hover:bg-white/10 text-white'
                      }`}
                    >
                      <Subtitles className="w-6 h-6" />
                    </button>
                    <AnimatePresence>
                      {showSubtitleMenu && (
                        <SubtitleMenu
                          tracks={SAMPLE_SUBTITLE_TRACKS}
                          activeTrack={activeSubtitleTrack}
                          onTrackChange={handleSubtitleTrackChange}
                          onClose={() => setShowSubtitleMenu(false)}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Audio Tracks */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowAudioMenu(!showAudioMenu);
                        setShowSubtitleMenu(false);
                        setShowSettings(false);
                      }}
                      className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                    >
                      <Gauge className="w-6 h-6" />
                    </button>
                    <AnimatePresence>
                      {showAudioMenu && (
                        <AudioMenu
                          tracks={audioTracks}
                          activeTrack={activeAudioTrack}
                          onTrackChange={handleAudioTrackChange}
                          onClose={() => setShowAudioMenu(false)}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Playback Speed */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
                        const currentIndex = speeds.indexOf(playerSettings.playbackSpeed);
                        const nextIndex = (currentIndex + 1) % speeds.length;
                        setPlayerSettings({ ...playerSettings, playbackSpeed: speeds[nextIndex] });
                      }}
                      className="px-3 py-1 rounded-full hover:bg-white/10 text-white text-sm font-medium transition-colors"
                    >
                      {playerSettings.playbackSpeed}x
                    </button>
                  </div>

                  {/* Settings */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowSettings(!showSettings);
                        setShowSubtitleMenu(false);
                        setShowAudioMenu(false);
                      }}
                      className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                    >
                      <Settings className="w-6 h-6" />
                    </button>
                    <AnimatePresence>
                      {showSettings && (
                        <PlayerSettingsMenu
                          settings={playerSettings}
                          onSettingsChange={setPlayerSettings}
                          onClose={() => setShowSettings(false)}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-6 h-6" />
                    ) : (
                      <Maximize className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Subtitle Menu Component
function SubtitleMenu({
  tracks,
  activeTrack,
  onTrackChange,
  onClose,
}: {
  tracks: SubtitleTrack[];
  activeTrack: SubtitleTrack | null;
  onTrackChange: (track: SubtitleTrack | null) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-white">Subtitles</h3>
      </div>
      <div className="max-h-64 overflow-y-auto">
        <button
          onClick={() => onTrackChange(null)}
          className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center justify-between ${
            !activeTrack ? 'text-amber-400' : 'text-gray-300'
          }`}
        >
          <span>Off</span>
          {!activeTrack && <Check className="w-4 h-4" />}
        </button>
        {tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => onTrackChange(track)}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center justify-between ${
              activeTrack?.id === track.id ? 'text-amber-400' : 'text-gray-300'
            }`}
          >
            <span>{track.label}</span>
            {activeTrack?.id === track.id && <Check className="w-4 h-4" />}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// Audio Menu Component
function AudioMenu({
  tracks,
  activeTrack,
  onTrackChange,
  onClose,
}: {
  tracks: AudioTrack[];
  activeTrack: AudioTrack;
  onTrackChange: (track: AudioTrack) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-full right-0 mb-2 w-72 bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-white">Audio</h3>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => onTrackChange(track)}
            className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors ${
              activeTrack.id === track.id ? 'bg-white/5' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${activeTrack.id === track.id ? 'text-amber-400' : 'text-white'}`}>
                  {track.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {track.codec} • {track.channels}
                </p>
              </div>
              {activeTrack.id === track.id && <Check className="w-4 h-4 text-amber-400" />}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// Player Settings Menu Component
function PlayerSettingsMenu({
  settings,
  onSettingsChange,
  onClose,
}: {
  settings: PlayerSettings;
  onSettingsChange: (settings: PlayerSettings) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-full right-0 mb-2 w-80 bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-white">Settings</h3>
      </div>
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {/* Subtitle Size */}
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Subtitle Size</label>
          <div className="grid grid-cols-4 gap-2">
            {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
              <button
                key={size}
                onClick={() => onSettingsChange({ ...settings, subtitleSize: size })}
                className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                  settings.subtitleSize === size
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Subtitle Color */}
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Subtitle Color</label>
          <div className="flex gap-2">
            {['#ffffff', '#ffff00', '#00ff00', '#00ffff'].map((color) => (
              <button
                key={color}
                onClick={() => onSettingsChange({ ...settings, subtitleColor: color })}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  settings.subtitleColor === color ? 'border-amber-500 scale-110' : 'border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Subtitle Background Opacity */}
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Background Opacity</label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.subtitleOpacity * 100}
            onChange={(e) =>
              onSettingsChange({ ...settings, subtitleOpacity: Number(e.target.value) / 100 })
            }
            className="w-full"
          />
        </div>

        {/* Subtitle Position */}
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Position</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSettingsChange({ ...settings, subtitlePosition: 'bottom' })}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                settings.subtitlePosition === 'bottom'
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Bottom
            </button>
            <button
              onClick={() => onSettingsChange({ ...settings, subtitlePosition: 'top' })}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                settings.subtitlePosition === 'top'
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Top
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
