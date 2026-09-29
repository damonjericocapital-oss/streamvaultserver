import { SubtitleCue, SubtitleTrack } from '../types/player';

/**
 * Parse VTT or SRT subtitle content into an array of cues
 */
export function parseSubtitles(content: string, type: 'vtt' | 'srt' | 'ass' = 'vtt'): SubtitleCue[] {
  if (!content || !content.trim()) {
    return [];
  }

  const cues: SubtitleCue[] = [];

  if (type === 'ass') {
    return parseASS(content);
  }

  // Parse VTT/SRT format
  const lines = content.trim().split('\n');
  let currentCue: Partial<SubtitleCue> | null = null;
  let textBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines and WEBVTT header
    if (!line || line === 'WEBVTT' || line.startsWith('NOTE') || line.startsWith('Kind:') || line.startsWith('Language:')) {
      if (currentCue && textBuffer.length > 0) {
        currentCue.text = textBuffer.join('\n').trim();
        if (currentCue.startTime !== undefined && currentCue.endTime !== undefined && currentCue.text) {
          cues.push({
            id: `cue-${cues.length}`,
            startTime: currentCue.startTime,
            endTime: currentCue.endTime,
            text: currentCue.text,
          });
        }
        currentCue = null;
        textBuffer = [];
      }
      continue;
    }

    // Check if this is a timestamp line
    const timestampMatch = line.match(/(\d{1,2}:)?\d{2}:\d{2}[.,]\d{3}\s*-->\s*(\d{1,2}:)?\d{2}:\d{2}[.,]\d{3}/);
    
    if (timestampMatch) {
      // Save previous cue if exists
      if (currentCue && textBuffer.length > 0) {
        currentCue.text = textBuffer.join('\n').trim();
        if (currentCue.startTime !== undefined && currentCue.endTime !== undefined && currentCue.text) {
          cues.push({
            id: `cue-${cues.length}`,
            startTime: currentCue.startTime,
            endTime: currentCue.endTime,
            text: currentCue.text,
          });
        }
      }

      // Parse timestamps
      const [startStr, endStr] = line.split('-->').map(s => s.trim());
      currentCue = {
        startTime: parseTimestamp(startStr),
        endTime: parseTimestamp(endStr),
      };
      textBuffer = [];
    } else if (currentCue && !/^\d+$/.test(line)) {
      // This is subtitle text (skip numeric cue indices)
      textBuffer.push(line);
    }
  }

  // Handle last cue
  if (currentCue && textBuffer.length > 0) {
    currentCue.text = textBuffer.join('\n').trim();
    if (currentCue.startTime !== undefined && currentCue.endTime !== undefined && currentCue.text) {
      cues.push({
        id: `cue-${cues.length}`,
        startTime: currentCue.startTime,
        endTime: currentCue.endTime,
        text: currentCue.text,
      });
    }
  }

  return cues;
}

/**
 * Parse ASS/SSA subtitle format
 */
function parseASS(content: string): SubtitleCue[] {
  const cues: SubtitleCue[] = [];
  const lines = content.split('\n');
  let inEvents = false;

  for (const line of lines) {
    if (line.trim() === '[Events]') {
      inEvents = true;
      continue;
    }

    if (line.startsWith('[') && line.endsWith(']')) {
      inEvents = false;
      continue;
    }

    if (inEvents && line.startsWith('Dialogue:')) {
      const parts = line.substring(9).split(',');
      if (parts.length >= 10) {
        const startTime = parseASSTimestamp(parts[1].trim());
        const endTime = parseASSTimestamp(parts[2].trim());
        const text = parts.slice(9).join(',').replace(/\{[^}]*\}/g, '').trim();

        if (startTime !== null && endTime !== null && text) {
          cues.push({
            id: `cue-${cues.length}`,
            startTime,
            endTime,
            text,
          });
        }
      }
    }
  }

  return cues;
}

/**
 * Parse timestamp string (HH:MM:SS.mmm or MM:SS.mmm) to seconds
 */
function parseTimestamp(timestamp: string): number {
  const parts = timestamp.split(':');
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (parts.length === 3) {
    hours = parseInt(parts[0], 10);
    minutes = parseInt(parts[1], 10);
    seconds = parseFloat(parts[2].replace(',', '.'));
  } else if (parts.length === 2) {
    minutes = parseInt(parts[0], 10);
    seconds = parseFloat(parts[1].replace(',', '.'));
  }

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Parse ASS timestamp (H:MM:SS.cc) to seconds
 */
function parseASSTimestamp(timestamp: string): number | null {
  const match = timestamp.match(/(\d+):(\d{2}):(\d{2})\.(\d{2})/);
  if (!match) return null;

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3], 10);
  const centiseconds = parseInt(match[4], 10);

  return hours * 3600 + minutes * 60 + seconds + centiseconds / 100;
}

/**
 * Find the active subtitle cue for a given time
 */
export function getActiveCue(cues: SubtitleCue[], currentTime: number): SubtitleCue | null {
  for (const cue of cues) {
    if (currentTime >= cue.startTime && currentTime <= cue.endTime) {
      return cue;
    }
  }
  return null;
}

/**
 * Format seconds to HH:MM:SS or MM:SS
 */
export function formatTime(seconds: number, showHours = false): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (showHours || hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generate sample subtitle cues for demo purposes
 */
export function generateSampleCues(): SubtitleCue[] {
  return [
    { id: '1', startTime: 1, endTime: 4, text: 'In a world where technology has advanced beyond our wildest dreams...' },
    { id: '2', startTime: 5, endTime: 8.5, text: 'One hero must rise to face the greatest challenge of our time.' },
    { id: '3', startTime: 10, endTime: 13, text: 'The journey begins now.' },
    { id: '4', startTime: 15, endTime: 18.5, text: 'Across the vast expanse of space and time...' },
    { id: '5', startTime: 20, endTime: 23, text: 'We discover that we are not alone.' },
    { id: '6', startTime: 25, endTime: 28.5, text: 'The stars hold secrets older than humanity itself.' },
    { id: '7', startTime: 30, endTime: 33, text: 'And the truth will change everything we know.' },
    { id: '8', startTime: 35, endTime: 38.5, text: 'Prepare for an adventure like no other.' },
    { id: '9', startTime: 40, endTime: 43, text: 'The future is in our hands.' },
    { id: '10', startTime: 45, endTime: 48.5, text: 'Together, we will shape destiny.' },
  ];
}
