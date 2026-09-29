import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Users,
  MessageSquare,
  Copy,
  Share2,
  Crown,
  Send,
  Smile,
  Settings,
  UserPlus,
} from 'lucide-react';
import { TheaterRoom, TheaterParticipant, VoiceChatState, ChatMessage } from '../types/advanced';

interface GroupTheaterProps {
  room: TheaterRoom;
  onClose: () => void;
}

export default function GroupTheater({ room, onClose }: GroupTheaterProps) {
  const [voiceState, setVoiceState] = useState<VoiceChatState>({
    isConnected: true,
    isMuted: false,
    isDeafened: false,
    inputDevice: 'Default Microphone',
    outputDevice: 'Default Speakers',
    volume: 100,
    noiseSuppression: true,
    echoCancellation: true,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'system',
      username: 'System',
      message: 'Welcome to the theater! Enjoy the show together.',
      timestamp: new Date().toISOString(),
      type: 'system',
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [showReactions, setShowReactions] = useState(false);

  // Simulate participant speaking
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly make participants speak
      const speakingIndex = Math.floor(Math.random() * room.participants.length);
      // This would update participant.isSpeaking in real implementation
    }, 2000);

    return () => clearInterval(interval);
  }, [room.participants]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'You',
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleReaction = (emoji: string) => {
    const reaction: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'You',
      message: '',
      timestamp: new Date().toISOString(),
      type: 'reaction',
      reaction: emoji,
    };

    setMessages([...messages, reaction]);
    setShowReactions(false);
  };

  const copyInviteLink = () => {
    const link = `https://streamvault.app/theater/${room.id}`;
    navigator.clipboard.writeText(link);
    // Show toast notification
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">{room.name}</h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400">
                {room.participants.length} watching
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyInviteLink}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Invite
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Video Area */}
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black relative">
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/30 flex items-center justify-center mb-6"
              >
                <Users className="w-16 h-16 text-amber-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">{room.mediaTitle}</h3>
              <p className="text-gray-400">Watching together with {room.participants.length} people</p>
              <p className="text-sm text-gray-500 mt-2">Synchronized playback • Low latency</p>
            </div>

            {/* Reactions Overlay */}
            <AnimatePresence>
              {messages
                .filter((m) => m.type === 'reaction')
                .slice(-5)
                .map((reaction, index) => (
                  <motion.div
                    key={reaction.id}
                    initial={{ opacity: 0, y: 100, scale: 0 }}
                    animate={{ opacity: 1, y: -100 - index * 50, scale: 1 }}
                    exit={{ opacity: 0, y: -200 }}
                    transition={{ duration: 2 }}
                    className="absolute text-6xl"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      bottom: '20%',
                    }}
                  >
                    {reaction.reaction}
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-900/50 border-l border-gray-800 flex flex-col">
            {/* Participants */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Participants ({room.participants.length})
                </h3>
                <button className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white">
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {room.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white relative"
                      style={{
                        background: `linear-gradient(135deg, ${participant.avatar.colors[0]}, ${participant.avatar.colors[1]})`,
                      }}
                    >
                      {participant.avatar.initial}
                      {participant.isSpeaking && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="absolute inset-0 rounded-full border-2 border-emerald-400"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate flex items-center gap-1">
                        {participant.username}
                        {participant.isHost && <Crown className="w-3 h-3 text-amber-400" />}
                      </p>
                    </div>
                    {participant.isMuted ? (
                      <MicOff className="w-4 h-4 text-red-400" />
                    ) : (
                      <Mic className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Voice Controls */}
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Voice Chat
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVoiceState({ ...voiceState, isMuted: !voiceState.isMuted })}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    voiceState.isMuted
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {voiceState.isMuted ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span className="text-xs">Unmute</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span className="text-xs">Mute</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setVoiceState({ ...voiceState, isDeafened: !voiceState.isDeafened })}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    voiceState.isDeafened
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {voiceState.isDeafened ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span className="text-xs">Undeafen</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span className="text-xs">Deafen</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Chat */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.type === 'system' ? (
                      <div className="text-center">
                        <p className="text-xs text-gray-500 italic">{message.message}</p>
                      </div>
                    ) : message.type === 'reaction' ? null : (
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {message.username.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400">
                            <span className="font-semibold text-white">{message.username}</span>
                            <span className="ml-2 text-gray-600">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </p>
                          <p className="text-sm text-gray-300 mt-0.5">{message.message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowReactions(!showReactions)}
                    className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 rounded-lg bg-amber-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-600 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                {/* Reactions Picker */}
                <AnimatePresence>
                  {showReactions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-2 p-2 rounded-lg bg-gray-800 border border-gray-700 flex items-center gap-2 flex-wrap"
                    >
                      {['👍', '❤️', '😂', '😮', '😢', '😡', '🔥', '🎉'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(emoji)}
                          className="text-2xl hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
