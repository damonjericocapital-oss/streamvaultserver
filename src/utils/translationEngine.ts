import { TranslationConfig } from '../types/advanced';

// Mock translation dictionary for demo
const TRANSLATIONS: Record<string, Record<string, string>> = {
  'In a world where technology has advanced': {
    es: 'En un mundo donde la tecnología ha avanzado',
    fr: 'Dans un monde où la technologie a progressé',
    de: 'In einer Welt, in der die Technologie fortgeschritten ist',
    ja: 'テクノロジーが進化した世界で',
    ko: '기술이 발전한 세계에서',
    zh: '在技术先进的世界里',
  },
  'One hero must rise': {
    es: 'Un héroe debe levantarse',
    fr: 'Un héros doit se lever',
    de: 'Ein Held muss aufstehen',
    ja: '一人のヒーローが立ち上がる',
    ko: '한 명의 영웅이 일어나야 합니다',
    zh: '一个英雄必须崛起',
  },
  'The journey begins now': {
    es: 'El viaje comienza ahora',
    fr: 'Le voyage commence maintenant',
    de: 'Die Reise beginnt jetzt',
    ja: '旅は今始まる',
    ko: '여정이 지금 시작됩니다',
    zh: '旅程现在开始',
  },
};

/**
 * Simulates live translation with realistic delay
 */
export async function translateText(
  text: string,
  targetLanguage: string,
  config: TranslationConfig
): Promise<string> {
  // Simulate API delay based on quality setting
  const delay = config.quality === 'premium' ? 100 : config.quality === 'high' ? 200 : 300;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Check mock translations
  for (const [key, translations] of Object.entries(TRANSLATIONS)) {
    if (text.includes(key)) {
      return translations[targetLanguage] || text;
    }
  }

  // Fallback: add language prefix for demo
  const langPrefix: Record<string, string> = {
    es: '[ES] ',
    fr: '[FR] ',
    de: '[DE] ',
    ja: '[JA] ',
    ko: '[KO] ',
    zh: '[ZH] ',
  };

  return (langPrefix[targetLanguage] || '') + text;
}

/**
 * Detects language from text (simplified demo)
 */
export function detectLanguage(text: string): string {
  // Simple heuristic detection
  if (/[а-яА-Я]/.test(text)) return 'ru';
  if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja';
  if (/[\uac00-\ud7af]/.test(text)) return 'ko';
  if (/[ñáéíóú]/.test(text)) return 'es';
  if (/[àâçéèêëîïôù]/.test(text)) return 'fr';
  if (/[äöüß]/.test(text)) return 'de';
  return 'en';
}

/**
 * Calculates translation quality score
 */
export function getTranslationQuality(config: TranslationConfig): number {
  if (config.quality === 'premium') return 98;
  if (config.quality === 'high') return 92;
  return 85;
}

/**
 * Estimates translation latency
 */
export function estimateLatency(config: TranslationConfig): number {
  const baseLatency = config.quality === 'premium' ? 100 : config.quality === 'high' ? 200 : 300;
  return baseLatency + config.delay;
}
