/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#B45309';
const tintColorDark = '#FBBF24';

export const Colors = {
  light: {
    text: '#1C1917',
    background: '#FAFAF9',
    tint: tintColorLight,
    icon: '#78716C',
    tabIconDefault: '#78716C',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FAFAF9',
    background: '#1C1917',
    tint: tintColorDark,
    icon: '#A8A29E',
    tabIconDefault: '#A8A29E',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** Loaded via @expo-google-fonts/inter */
    sans: 'Inter_400Regular',
    /** Loaded via @expo-google-fonts/fraunces */
    serif: 'Fraunces_600SemiBold',
    rounded: 'Inter_600SemiBold',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "'Fraunces', Georgia, 'Times New Roman', serif",
    rounded: "'Inter', system-ui, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
