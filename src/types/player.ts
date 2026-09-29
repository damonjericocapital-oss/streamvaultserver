export interface SubtitleTrack {
  id: string;
  label: string;
  language: string;
  type: 'srt' | 'vtt' | 'ass';
  url?: string;
  content?: string;
  isDefault?: boolean;
}

export interface AudioTrack {
  id: string;
  label: string;
  language: string;
  channels: string;
  codec: string;
  isDefault?: boolean;
}

export interface SubtitleCue {
  id: string;
  startTime: number; // seconds
  endTime: number; // seconds
  text: string;
}

export interface PlayerSettings {
  playbackSpeed: number;
  subtitleSize: 'small' | 'medium' | 'large' | 'xlarge';
  subtitleColor: string;
  subtitleBackground: string;
  subtitleOpacity: number;
  subtitlePosition: 'bottom' | 'top';
  autoPlay: boolean;
  autoNext: boolean;
  skipIntro: boolean;
  skipRecap: boolean;
}

export const DEFAULT_PLAYER_SETTINGS: PlayerSettings = {
  playbackSpeed: 1,
  subtitleSize: 'medium',
  subtitleColor: '#ffffff',
  subtitleBackground: '#000000',
  subtitleOpacity: 0.75,
  subtitlePosition: 'bottom',
  autoPlay: true,
  autoNext: false,
  skipIntro: false,
  skipRecap: false,
};

// Sample subtitle tracks
export const SAMPLE_SUBTITLE_TRACKS: SubtitleTrack[] = [
  {
    id: 'sub-en',
    label: 'English',
    language: 'en',
    type: 'vtt',
    isDefault: true,
    content: `WEBVTT

00:00:01.000 --> 00:00:04.000
In a world where technology has advanced beyond our wildest dreams...

00:00:05.000 --> 00:00:08.500
One hero must rise to face the greatest challenge of our time.

00:00:10.000 --> 00:00:13.000
The journey begins now.

00:00:15.000 --> 00:00:18.500
Across the vast expanse of space and time...

00:00:20.000 --> 00:00:23.000
We discover that we are not alone.

00:00:25.000 --> 00:00:28.500
The stars hold secrets older than humanity itself.

00:00:30.000 --> 00:00:33.000
And the truth will change everything we know.

00:00:35.000 --> 00:00:38.500
Prepare for an adventure like no other.

00:00:40.000 --> 00:00:43.000
The future is in our hands.

00:00:45.000 --> 00:00:48.500
Together, we will shape destiny.`,
  },
  {
    id: 'sub-es',
    label: 'Spanish',
    language: 'es',
    type: 'vtt',
    content: `WEBVTT

00:00:01.000 --> 00:00:04.000
En un mundo donde la tecnología ha avanzado más allá de nuestros sueños...

00:00:05.000 --> 00:00:08.500
Un héroe debe alzarse para enfrentar el mayor desafío de nuestro tiempo.

00:00:10.000 --> 00:00:13.000
El viaje comienza ahora.

00:00:15.000 --> 00:00:18.500
A través de la vasta extensión del espacio y el tiempo...

00:00:20.000 --> 00:00:23.000
Descubrimos que no estamos solos.`,
  },
  {
    id: 'sub-fr',
    label: 'French',
    language: 'fr',
    type: 'vtt',
    content: `WEBVTT

00:00:01.000 --> 00:00:04.000
Dans un monde où la technologie a dépassé nos rêves les plus fous...

00:00:05.000 --> 00:00:08.500
Un héros doit se lever pour relever le plus grand défi de notre temps.

00:00:10.000 --> 00:00:13.000
Le voyage commence maintenant.`,
  },
];

export const SAMPLE_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'audio-en',
    label: 'English',
    language: 'en',
    channels: '5.1 Surround',
    codec: 'DTS-HD MA',
    isDefault: true,
  },
  {
    id: 'audio-en-desc',
    label: 'English (Descriptive)',
    language: 'en',
    channels: '2.0 Stereo',
    codec: 'AAC',
  },
  {
    id: 'audio-es',
    label: 'Spanish',
    language: 'es',
    channels: '5.1 Surround',
    codec: 'DTS',
  },
  {
    id: 'audio-fr',
    label: 'French',
    language: 'fr',
    channels: '2.0 Stereo',
    codec: 'AAC',
  },
];
