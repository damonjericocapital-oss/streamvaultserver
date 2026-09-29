import { AIMessage, AIAction, AIInsight } from '../types/ai';
import { Torrent, ServerStats } from '../types';

const AI_NAME = 'NEXUS';

export function generateAIResponse(
  userMessage: string,
  torrents: Torrent[],
  stats: ServerStats
): AIMessage {
  const lowerMsg = userMessage.toLowerCase();

  // Analyze intent and generate contextual response
  if (lowerMsg.includes('help') || lowerMsg.includes('what can you do')) {
    return createHelpResponse();
  }

  if (lowerMsg.includes('status') || lowerMsg.includes('how') && lowerMsg.includes('doing')) {
    return createStatusResponse(torrents, stats);
  }

  if (lowerMsg.includes('optimize') || lowerMsg.includes('speed') || lowerMsg.includes('faster')) {
    return createOptimizationResponse(stats);
  }

  if (lowerMsg.includes('recommend') || lowerMsg.includes('suggest') || lowerMsg.includes('what should')) {
    return createRecommendationResponse(torrents);
  }

  if (lowerMsg.includes('download') && lowerMsg.includes('start')) {
    return createDownloadActionResponse(torrents);
  }

  if (lowerMsg.includes('stream') || lowerMsg.includes('watch') || lowerMsg.includes('play')) {
    return createStreamResponse(torrents);
  }

  if (lowerMsg.includes('storage') || lowerMsg.includes('space') || lowerMsg.includes('disk')) {
    return createStorageResponse(stats);
  }

  if (lowerMsg.includes('error') || lowerMsg.includes('problem') || lowerMsg.includes('issue')) {
    return createTroubleshootResponse(torrents, stats);
  }

  if (lowerMsg.includes('organize') || lowerMsg.includes('sort') || lowerMsg.includes('categorize')) {
    return createOrganizeResponse(torrents);
  }

  if (lowerMsg.includes('pause') || lowerMsg.includes('stop')) {
    return createPauseResponse(torrents);
  }

  if (lowerMsg.includes('security') || lowerMsg.includes('safe') || lowerMsg.includes('private')) {
    return createSecurityResponse();
  }

  // Default intelligent response
  return createGeneralResponse(userMessage, torrents, stats);
}

function createHelpResponse(): AIMessage {
  return {
    id: generateId(),
    role: 'assistant',
    content: `I'm **${AI_NAME}**, your AI-powered torrent management assistant. Here's what I can help you with:\n\n🎯 **Torrent Management**\n• Start, pause, or remove downloads\n• Monitor progress and ETA\n• Organize files by category\n\n⚡ **Performance Optimization**\n• Analyze and optimize download speeds\n• Suggest connection improvements\n• Balance upload/download ratios\n\n📺 **Streaming**\n• Find streamable content\n• Start playback on ready files\n• Quality recommendations\n\n🔒 **Security & Privacy**\n• Review encryption settings\n• Suggest privacy improvements\n• Monitor peer connections\n\n💡 **Smart Insights**\n• Storage management tips\n• Network health analysis\n• Auto-pilot mode for hands-free operation\n\nJust ask me anything! Try: *"What's my server status?"* or *"Optimize my speeds"*`,
    timestamp: new Date(),
    metadata: { type: 'insight' },
  };
}

function createStatusResponse(torrents: Torrent[], stats: ServerStats): AIMessage {
  const downloading = torrents.filter((t) => t.status === 'downloading').length;
  const seeding = torrents.filter((t) => t.status === 'seeding').length;
  const completed = torrents.filter((t) => t.status === 'completed').length;
  const avgProgress = torrents.reduce((sum, t) => sum + t.progress, 0) / torrents.length;

  const healthScore = calculateHealthScore(stats, torrents);

  return {
    id: generateId(),
    role: 'assistant',
    content: `## 📊 Server Status Report\n\n**Health Score: ${healthScore}/100** ${healthScore > 80 ? '🟢 Excellent' : healthScore > 60 ? '🟡 Good' : '🔴 Needs Attention'}\n\n### Current Activity\n• **Downloading:** ${downloading} torrents\n• **Seeding:** ${seeding} torrents\n• **Completed:** ${completed} torrents\n• **Average Progress:** ${avgProgress.toFixed(1)}%\n\n### Network Performance\n• **Download:** ${stats.downloadSpeed} MB/s ${stats.downloadSpeed > 30 ? '⚡' : '📶'}\n• **Upload:** ${stats.uploadSpeed} MB/s\n• **Ratio:** ${(stats.downloadSpeed / Math.max(stats.uploadSpeed, 0.1)).toFixed(1)}:1\n\n### System Resources\n• **CPU:** ${stats.cpuUsage}% ${stats.cpuUsage > 80 ? '⚠️ High' : '✅ Normal'}\n• **Memory:** ${stats.memoryUsage}% ${stats.memoryUsage > 80 ? '⚠️ High' : '✅ Normal'}\n• **Storage:** ${stats.diskUsed} / ${stats.diskSpace}\n• **Uptime:** ${stats.uptime}\n\n${healthScore < 70 ? '\n⚠️ **Recommendation:** Your server could benefit from optimization. Ask me to *"optimize performance"* for suggestions.' : '\n✅ Everything looks great! Your server is running smoothly.'}`,
    timestamp: new Date(),
    metadata: { type: 'analysis', confidence: 95 },
  };
}

function createOptimizationResponse(stats: ServerStats): AIMessage {
  const suggestions: string[] = [];
  const actions: AIAction[] = [];

  if (stats.cpuUsage > 70) {
    suggestions.push('• Reduce max connections to lower CPU load');
    actions.push({ id: generateId(), label: 'Reduce Connections', type: 'optimize', payload: { setting: 'maxConnections', value: 100 } });
  }

  if (stats.memoryUsage > 75) {
    suggestions.push('• Clear completed torrent cache to free memory');
    actions.push({ id: generateId(), label: 'Clear Cache', type: 'optimize', payload: { action: 'clearCache' } });
  }

  if (stats.downloadSpeed < 20) {
    suggestions.push('• Enable DHT and PeX for more peer discovery');
    suggestions.push('• Check if ISP is throttling — try enabling encryption');
    actions.push({ id: generateId(), label: 'Enable DHT + PeX', type: 'settings', payload: { dht: true, pex: true } });
  }

  suggestions.push('• Consider upgrading to sequential download for streaming torrents');
  suggestions.push('• Set upload limit to 80% of your connection to prioritize downloads');

  return {
    id: generateId(),
    role: 'assistant',
    content: `## ⚡ Performance Optimization\n\nBased on my analysis of your server, here are my recommendations:\n\n${suggestions.join('\n')}\n\n### Quick Actions\nI can apply these optimizations automatically. Would you like me to proceed?`,
    timestamp: new Date(),
    actions: actions.length > 0 ? actions : [
      { id: generateId(), label: 'Auto-Optimize All', type: 'optimize', payload: { mode: 'full' } },
      { id: generateId(), label: 'Optimize for Streaming', type: 'optimize', payload: { mode: 'streaming' } },
      { id: generateId(), label: 'Optimize for Speed', type: 'optimize', payload: { mode: 'speed' } },
    ],
    metadata: { type: 'recommendation', confidence: 88 },
  };
}

function createRecommendationResponse(torrents: Torrent[]): AIMessage {
  const streamable = torrents.filter((t) => t.streamable && t.progress >= 90);
  const highSeed = torrents.filter((t) => t.seeds > 100);
  const almostDone = torrents.filter((t) => t.progress > 80 && t.progress < 100);

  return {
    id: generateId(),
    role: 'assistant',
    content: `## 💡 Smart Recommendations\n\n### 🎬 Ready to Stream (${streamable.length} items)\n${streamable.length > 0 ? streamable.slice(0, 3).map((t) => `• **${t.name.substring(0, 40)}...** — ${t.progress}% ready`).join('\n') : '• No torrents ready for streaming yet'}\n\n### 🔥 High-Value Torrents\n${highSeed.length > 0 ? highSeed.slice(0, 3).map((t) => `• **${t.name.substring(0, 40)}...** — ${t.seeds} seeds available`).join('\n') : '• All torrents have healthy seed counts'}\n\n### ⏳ Almost Complete\n${almostDone.length > 0 ? almostDone.map((t) => `• **${t.name.substring(0, 40)}...** — ${t.progress}% done, ETA: ${t.eta}`).join('\n') : '• No torrents near completion'}\n\n### 📈 Suggested Actions\n• Prioritize "${almostDone[0]?.name.substring(0, 30) || 'near-complete'}" to finish quickly\n• Consider removing torrents with 0 seeds after completion\n• Enable auto-delete for completed torrents older than 7 days`,
    timestamp: new Date(),
    actions: [
      { id: generateId(), label: 'Stream Ready Content', type: 'stream', payload: { filter: 'ready' } },
      { id: generateId(), label: 'Prioritize Downloads', type: 'optimize', payload: { action: 'prioritize' } },
    ],
    metadata: { type: 'recommendation', confidence: 92 },
  };
}

function createDownloadActionResponse(torrents: Torrent[]): AIMessage {
  const queued = torrents.filter((t) => t.status === 'queued');
  const paused = torrents.filter((t) => t.status === 'paused');

  return {
    id: generateId(),
    role: 'assistant',
    content: `## 📥 Download Management\n\nI found ${queued.length} queued and ${paused.length} paused torrents.\n\n${queued.length > 0 ? `### Queued Torrents\n${queued.map((t) => `• ${t.name.substring(0, 45)}... (${t.size})`).join('\n')}\n` : ''}\n${paused.length > 0 ? `### Paused Torrents\n${paused.map((t) => `• ${t.name.substring(0, 45)}... (${t.progress}%)`).join('\n')}\n` : ''}\nWould you like me to start all queued downloads or selectively resume specific ones?`,
    timestamp: new Date(),
    actions: [
      { id: generateId(), label: 'Start All Queued', type: 'resume', payload: { filter: 'queued' } },
      { id: generateId(), label: 'Resume All Paused', type: 'resume', payload: { filter: 'paused' } },
      { id: generateId(), label: 'Smart Start (Priority)', type: 'resume', payload: { filter: 'smart' } },
    ],
    metadata: { type: 'action', confidence: 90 },
  };
}

function createStreamResponse(torrents: Torrent[]): AIMessage {
  const streamable = torrents.filter((t) => t.streamable && t.progress > 20);

  return {
    id: generateId(),
    role: 'assistant',
    content: `## 📺 Streaming Options\n\nI found **${streamable.length}** streamable torrents:\n\n${streamable.map((t) => {
      const videoFile = t.files.find((f) => f.type === 'video');
      return `• **${t.name.substring(0, 40)}**\n  ${videoFile ? `└ ${videoFile.name} (${videoFile.size})` : ''} — ${t.progress}% buffered`;
    }).join('\n\n')}\n\n💡 **Pro tip:** For the best streaming experience, I recommend torrents with >80% buffer. The content plays smoothly even while downloading!`,
    timestamp: new Date(),
    actions: streamable.slice(0, 3).map((t) => ({
      id: generateId(),
      label: `▶ ${t.name.substring(0, 25)}...`,
      type: 'stream' as const,
      payload: { torrentId: t.id },
    })),
    metadata: { type: 'action', confidence: 95 },
  };
}

function createStorageResponse(stats: ServerStats): AIMessage {
  const usedPercent = 70; // Mock calculation

  return {
    id: generateId(),
    role: 'assistant',
    content: `## 💾 Storage Analysis\n\n**Current Usage:** ${stats.diskUsed} / ${stats.diskSpace} (${usedPercent}%)\n\n### Breakdown\n• **Completed torrents:** ~420 GB\n• **In-progress downloads:** ~680 GB\n• **Seeding (keep ratio):** ~300 GB\n\n### Recommendations\n${usedPercent > 80 ? '⚠️ Storage is getting full! Consider:\n• Removing completed torrents you\'ve finished watching\n• Setting auto-delete for torrents seeded for >30 days\n• Moving older content to cold storage\n' : '✅ Storage levels are healthy. No immediate action needed.\n'}\n### Smart Cleanup Options\nI can help you free up space by identifying:\n• Duplicate files across torrents\n• Low-seed torrents that are unlikely to complete\n• Old completed torrents ready for removal`,
    timestamp: new Date(),
    actions: [
      { id: generateId(), label: 'Analyze Duplicates', type: 'organize', payload: { action: 'findDuplicates' } },
      { id: generateId(), label: 'Smart Cleanup', type: 'optimize', payload: { action: 'cleanup' } },
      { id: generateId(), label: 'Archive Old Torrents', type: 'organize', payload: { action: 'archive' } },
    ],
    metadata: { type: 'analysis', confidence: 85 },
  };
}

function createTroubleshootResponse(torrents: Torrent[], stats: ServerStats): AIMessage {
  const errors = torrents.filter((t) => t.status === 'error');
  const slowTorrents = torrents.filter((t) => t.status === 'downloading' && t.seeds < 5);

  return {
    id: generateId(),
    role: 'assistant',
    content: `## 🔧 Troubleshooting Report\n\n### Issues Detected\n${errors.length > 0 ? `\n**❌ Error Torrents (${errors.length}):**\n${errors.map((t) => `• ${t.name.substring(0, 40)}... — Possible tracker issue`).join('\n')}\n` : ''}\n${slowTorrents.length > 0 ? `\n**🐌 Slow Downloads (${slowTorrents.length}):**\n${slowTorrents.map((t) => `• ${t.name.substring(0, 40)}... — Only ${t.seeds} seeds`).join('\n')}\n` : ''}\n${errors.length === 0 && slowTorrents.length === 0 ? '✅ No issues detected! All torrents are running normally.\n' : ''}\n### Suggested Fixes\n• **For errors:** Reannounce to trackers or recheck torrent data\n• **For slow downloads:** Enable DHT, try finding alternative sources\n• **General:** Ensure port forwarding is configured correctly\n• **Network:** Check if your ISP is throttling BitTorrent traffic`,
    timestamp: new Date(),
    actions: [
      { id: generateId(), label: 'Reannounce All', type: 'optimize', payload: { action: 'reannounce' } },
      { id: generateId(), label: 'Run Diagnostics', type: 'optimize', payload: { action: 'diagnose' } },
      { id: generateId(), label: 'Check Port Forwarding', type: 'settings', payload: { action: 'checkPorts' } },
    ],
    metadata: { type: 'alert', confidence: 78 },
  };
}

function createOrganizeResponse(torrents: Torrent[]): AIMessage {
  const categories = torrents.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    id: generateId(),
    role: 'assistant',
    content: `## 📁 Organization Analysis\n\n### Current Categories\n${Object.entries(categories).map(([cat, count]) => `• **${cat}:** ${count} torrents`).join('\n')}\n\n### Smart Organization Suggestions\n• Auto-tag torrents by content type (Movies, TV, Music, Software)\n• Create smart playlists for media content\n• Set up automatic file renaming with consistent format\n• Group related torrents (e.g., seasons of a show)\n\n### Auto-Organize Rules I Can Apply\n1. **Movie naming:** [Year] [Quality] [Codec]\n2. **TV naming:** S01E01 - Episode Name [Quality]\n3. **Music:** Artist - Album - Track [Format]\n4. **Software:** Name [Version] [Arch]`,
    timestamp: new Date(),
    actions: [
      { id: generateId(), label: 'Auto-Organize Now', type: 'organize', payload: { action: 'autoOrganize' } },
      { id: generateId(), label: 'Setup Auto-Rules', type: 'settings', payload: { action: 'autoRules' } },
      { id: generateId(), label: 'Preview Changes', type: 'organize', payload: { action: 'preview' } },
    ],
    metadata: { type: 'recommendation', confidence: 90 },
  };
}

function createPauseResponse(torrents: Torrent[]): AIMessage {
  const active = torrents.filter((t) => t.status === 'downloading' || t.status === 'seeding');

  return {
    id: generateId(),
    role: 'assistant',
    content: `## ⏸️ Pause Control\n\nCurrently **${active.length}** torrents are active.\n\nWhich ones would you like to pause?\n\n${active.map((t) => `• **${t.name.substring(0, 40)}** — ${t.status} (${t.progress}%)`).join('\n')}\n\n💡 **Tip:** You can also set up auto-pause rules, like pausing downloads during peak hours or when streaming.`,
    timestamp: new Date(),
    actions: [
      { id: generateId(), label: 'Pause All Downloads', type: 'pause', payload: { filter: 'downloading' } },
      { id: generateId(), label: 'Pause All', type: 'pause', payload: { filter: 'all' } },
      { id: generateId(), label: 'Keep Streaming, Pause Rest', type: 'pause', payload: { filter: 'except-streaming' } },
    ],
    metadata: { type: 'action', confidence: 88 },
  };
}

function createSecurityResponse(): AIMessage {
  return {
    id: generateId(),
    role: 'assistant',
    content: `## 🔒 Security & Privacy Report\n\n### Current Status\n• **Encryption:** Protocol Encryption enabled ✅\n• **DHT:** Active (may reveal IP to DHT network) ⚠️\n• **PeX:** Enabled ⚠️\n• **Anonymous Mode:** Disabled ❌\n• **IP Filter:** Not configured ⚠️\n\n### Recommendations\n1. **Enable Anonymous Mode** — Strips identifying info from peer exchanges\n2. **Configure IP Filter** — Block known monitoring IPs\n3. **Force Encryption** — Prevents ISP throttling and deep packet inspection\n4. **Use a VPN** — Additional layer of privacy for all torrent traffic\n5. **Disable PeX** — Prevents peer info leakage (if privacy is priority)\n\n### Privacy Score: 45/100\nYour current setup has moderate privacy. I can harden it with one click.`,
    timestamp: new Date(),
    actions: [
      { id: generateId(), label: 'Enable Privacy Mode', type: 'settings', payload: { anonymous: true, forceEncryption: true } },
      { id: generateId(), label: 'Configure IP Filter', type: 'settings', payload: { action: 'ipFilter' } },
      { id: generateId(), label: 'Full Privacy Audit', type: 'optimize', payload: { action: 'privacyAudit' } },
    ],
    metadata: { type: 'alert', confidence: 92 },
  };
}

function createGeneralResponse(message: string, torrents: Torrent[], stats: ServerStats): AIMessage {
  const responses = [
    `I understand you're asking about "${message}". Let me analyze your server context to provide the best answer.\n\nYour server is currently running ${stats.activeTorrents} active torrents with a download speed of ${stats.downloadSpeed} MB/s. How can I help you further?`,
    `Interesting question! Based on your current setup:\n\n• **${torrents.length}** torrents managed\n• **${stats.downloadSpeed} MB/s** current throughput\n• **${stats.diskUsed}** storage used\n\nI can help with torrent management, optimization, streaming, or server configuration. What would you like to focus on?`,
    `I'm processing your request about "${message}".\n\nHere's what I can do for you right now:\n• Analyze your torrent performance\n• Suggest optimizations\n• Help with streaming setup\n• Manage your downloads\n\nCould you be more specific about what you need?`,
  ];

  return {
    id: generateId(),
    role: 'assistant',
    content: responses[Math.floor(Math.random() * responses.length)],
    timestamp: new Date(),
    actions: [
      { id: generateId(), label: 'Show Status', type: 'optimize', payload: { action: 'status' } },
      { id: generateId(), label: 'Get Recommendations', type: 'optimize', payload: { action: 'recommend' } },
    ],
    metadata: { type: 'insight', confidence: 65 },
  };
}

export function generateAutoInsights(torrents: Torrent[], stats: ServerStats): AIInsight[] {
  const insights: AIInsight[] = [];

  // Check for slow downloads
  const slowTorrents = torrents.filter((t) => t.status === 'downloading' && t.seeds < 3);
  if (slowTorrents.length > 0) {
    insights.push({
      id: generateId(),
      type: 'performance',
      title: 'Slow Downloads Detected',
      description: `${slowTorrents.length} torrent(s) have fewer than 3 seeds. Consider finding alternative sources.`,
      severity: 'warning',
      timestamp: new Date(),
    });
  }

  // Check storage
  if (stats.memoryUsage > 75) {
    insights.push({
      id: generateId(),
      type: 'storage',
      title: 'High Memory Usage',
      description: `Memory usage is at ${stats.memoryUsage}%. Consider clearing cache or reducing active connections.`,
      severity: 'warning',
      timestamp: new Date(),
    });
  }

  // Check for streamable content ready
  const readyToStream = torrents.filter((t) => t.streamable && t.progress > 90 && t.progress < 100);
  if (readyToStream.length > 0) {
    insights.push({
      id: generateId(),
      type: 'recommendation',
      title: 'Content Ready to Stream',
      description: `${readyToStream.length} torrent(s) are nearly complete and ready for streaming.`,
      severity: 'success',
      timestamp: new Date(),
    });
  }

  // CPU check
  if (stats.cpuUsage > 80) {
    insights.push({
      id: generateId(),
      type: 'performance',
      title: 'High CPU Usage',
      description: `CPU is at ${stats.cpuUsage}%. Consider reducing hash checks or active connections.`,
      severity: 'critical',
      timestamp: new Date(),
    });
  }

  // Good ratio
  if (stats.uploadSpeed > 0) {
    const ratio = stats.downloadSpeed / stats.uploadSpeed;
    if (ratio < 2) {
      insights.push({
        id: generateId(),
        type: 'network',
        title: 'Good Share Ratio',
        description: `Your upload ratio is healthy. Keep seeding to maintain community standing!`,
        severity: 'success',
        timestamp: new Date(),
      });
    }
  }

  return insights;
}

function calculateHealthScore(stats: ServerStats, torrents: Torrent[]): number {
  let score = 100;

  if (stats.cpuUsage > 80) score -= 15;
  else if (stats.cpuUsage > 60) score -= 5;

  if (stats.memoryUsage > 80) score -= 15;
  else if (stats.memoryUsage > 60) score -= 5;

  const errorTorrents = torrents.filter((t) => t.status === 'error').length;
  score -= errorTorrents * 10;

  const slowTorrents = torrents.filter((t) => t.status === 'downloading' && t.seeds < 3).length;
  score -= slowTorrents * 5;

  if (stats.downloadSpeed < 5) score -= 10;

  return Math.max(0, Math.min(100, score));
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
