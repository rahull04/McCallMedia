import {useMemo} from 'react';
import {
  globalColors,
  globalSpacing,
  globalStyles,
  globalIcons,
  globalImages,
  globalAnimations,
} from '../../assets/styles';

export interface GlobalThemeType {
  color: typeof globalColors;
  spacing: typeof globalSpacing;
  styles: typeof globalStyles;
  icon: typeof globalIcons;
  image: typeof globalImages;
  animation: typeof globalAnimations;
}

export const useTheme = () => {
  const theme = useMemo(() => {
    return {
      color: globalColors,
      spacing: globalSpacing,
      styles: globalStyles,
      icon: globalIcons,
      image: globalImages,
      animation: globalAnimations,
    };
  }, []);

  return theme;
};
