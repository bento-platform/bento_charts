import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

import { DEFAULT_CHART_THEME, defaultTranslationObject } from './constants/chartConstants';
import type { ChartTheme, LngDictionary, SupportedLng, TranslationObject } from './types/chartTypes';

type ChartContextType = {
  theme: ChartTheme;
  translation: LngDictionary;
  threshold: number;
  maxLabelChars: number;
};

const DEFAULT_CONTEXT: ChartContextType = {
  theme: DEFAULT_CHART_THEME,
  translation: defaultTranslationObject.en,
  threshold: 0,
  maxLabelChars: 14,
};

const ChartContext = createContext<ChartContextType>(DEFAULT_CONTEXT);

export function useChartTheme() {
  return useContext(ChartContext).theme;
}

export function useChartTranslation() {
  return useContext(ChartContext).translation;
}

export function useChartThreshold() {
  return useContext(ChartContext).threshold;
}

export function useChartMaxLabelChars() {
  return useContext(ChartContext).maxLabelChars;
}

const ChartConfigProvider = ({
  theme,
  Lng,
  translationMap,
  children,
  globalThreshold,
  maxLabelChars,
}: ChartConfigProviderProps) => {
  let lang: SupportedLng = 'en';
  try {
    lang = Lng as SupportedLng;
  } catch (e) {
    console.error('Lng is not a supported language', e);
    return null;
  }
  const contextValue = {
    theme: theme ?? DEFAULT_CONTEXT.theme,
    translation: translationMap ? translationMap[lang] : defaultTranslationObject[lang],
    threshold: globalThreshold ?? DEFAULT_CONTEXT.threshold,
    maxLabelChars: maxLabelChars ?? DEFAULT_CONTEXT.maxLabelChars,
  };
  return <ChartContext.Provider value={contextValue}>{children}</ChartContext.Provider>;
};

type ChartConfigProviderProps = {
  theme?: ChartTheme;
  Lng: string;
  translationMap?: TranslationObject;
  children: ReactNode;
  globalThreshold?: number;
  maxLabelChars?: number;
};

export default ChartConfigProvider;
