import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  Brain,
  ChevronRight,
  RefreshCw,
  Shield,
  Activity,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { AIMessage, AIAction } from '../types/ai';
import { Torrent, ServerStats } from '../types';
import { generateAIResponse } from '../engine/aiEngine';

interface AIAgentProps {
  isOpen: boolean;
  onClose: () => void;
  torrents: Torrent[];
  stats: ServerStats;
  onAction: (action: AIAction) => void;
}

export default function AIAgent({ isOpen, onClose, torrents, stats, onAction }: AIAgentProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `## 👋 Hello! I'm **NEXUS**\n\nYour AI-powered torrent management assistant. I'm monitoring your server and ready to help.\n\n**Quick Stats:**\n• ${torrents.length} torrents managed\n• ${stats.downloadSpeed} MB/s download speed\n• ${stats.activeTorrents} active transfers\n\nHow can I assist you today?`,
      timestamp: new Date(),
      metadata: { type: 'insight' },
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: AIMessage = {
      id: Math.random().toString(36).substring(2, 11),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));

    const aiResponse = generateAIResponse(input, torrents, stats);
    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleAction = (action: AIAction) => {
    onAction(action);
    const actionMsg: AIMessage = {
      id: Math.random().toString(36).substring(2, 11),
      role: 'assistant',
      content: `✅ **Action executed:** ${action.label}\n\nI've applied the changes. Is there anything else you'd like me to do?`,
      timestamp: new Date(),
      metadata: { type: 'action' },
    };
    setMessages((prev) => [...prev, actionMsg]);
  };

  const quickPrompts = [
    { label: 'Server Status', icon: Activity },
    { label: 'Optimize Speeds', icon: Zap },
    { label: 'What to Stream?', icon: Sparkles },
    { label: 'Security Check', icon: Shield },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`fixed bottom-6 right-6 z-[80] ${
        isExpanded ? 'w-[600px] h-[700px]' : 'w-[420px] h-[600px]'
      } bg-gray-900/98 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl shadow-black/50 flex flex-col overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-gray-900 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              NEXUS AI
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                ONLINE
              </span>
            </h3>
            <p className="text-xs text-gray-500">Intelligent Torrent Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="px-4 py-3 border-b border-gray-800/50">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt.label}
                onClick={() => {
                  setInput(prompt.label);
                  setTimeout(() => handleSend(), 100);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700/50 text-xs text-gray-300 hover:text-white hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all whitespace-nowrap"
              >
                <prompt.icon className="w-3 h-3" />
                {prompt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-violet-500/20'
                    : 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-3.5 h-3.5 text-violet-400" />
                ) : (
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>

              {/* Content */}
              <div
                className={`flex-1 max-w-[85%] ${
                  message.role === 'user' ? 'flex flex-col items-end' : ''
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-violet-500/20 text-white border border-violet-500/20'
                      : 'bg-gray-800/50 text-gray-200 border border-gray-700/50'
                  }`}
                >
                  <MarkdownRenderer content={message.content} />
                </div>

                {/* Actions */}
                {message.actions && message.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.actions.map((action) => (
                      <motion.button
                        key={action.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAction(action)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      >
                        <ChevronRight className="w-3 h-3" />
                        {action.label}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Metadata */}
                {message.metadata?.confidence && (
                  <span className="text-[10px] text-gray-600 mt-1 block">
                    Confidence: {message.metadata.confidence}%
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="bg-gray-800/50 rounded-2xl px-4 py-3 border border-gray-700/50">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-2 bg-gray-800/50 rounded-xl border border-gray-700/50 px-4 py-2 focus-within:border-emerald-500/50 transition-colors">
          <Sparkles className="w-4 h-4 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask NEXUS anything..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
          </motion.button>
        </div>
        <p className="text-[10px] text-gray-600 mt-2 text-center">
          NEXUS AI • Powered by intelligent analysis • v2.0
        </p>
      </div>
    </motion.div>
  );
}

// Simple Markdown Renderer
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Headers
        if (line.startsWith('## ')) {
          return (
            <h3 key={i} className="text-base font-bold text-white mt-2 mb-1">
              {renderInline(line.substring(3))}
            </h3>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h4 key={i} className="text-sm font-semibold text-gray-200 mt-2 mb-1">
              {renderInline(line.substring(4))}
            </h4>
          );
        }
        // List items
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return (
            <div key={i} className="flex items-start gap-2 text-gray-300">
              <span className="text-emerald-400 mt-0.5">•</span>
              <span>{renderInline(line.substring(2))}</span>
            </div>
          );
        }
        // Numbered items
        if (/^\d+\./.test(line)) {
          return (
            <div key={i} className="flex items-start gap-2 text-gray-300">
              <span className="text-emerald-400 font-mono text-xs mt-0.5">{line.match(/^\d+\./)?.[0]}</span>
              <span>{renderInline(line.replace(/^\d+\.\s*/, ''))}</span>
            </div>
          );
        }
        // Empty line
        if (line.trim() === '') {
          return <div key={i} className="h-2" />;
        }
        // Regular text
        return (
          <p key={i} className="text-gray-300">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  // Bold
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Inline code
    const codeParts = part.split(/(`[^`]+`)/g);
    return codeParts.map((codePart, j) => {
      if (codePart.startsWith('`') && codePart.endsWith('`')) {
        return (
          <code key={`${i}-${j}`} className="px-1.5 py-0.5 rounded bg-gray-700 text-emerald-400 text-xs font-mono">
            {codePart.slice(1, -1)}
          </code>
        );
      }
      return <span key={`${i}-${j}`}>{codePart}</span>;
    });
  });
}
