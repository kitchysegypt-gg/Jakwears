import { SymbolView } from 'expo-symbols';
import type { ColorValue } from 'react-native';
import type { ComponentProps } from 'react';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

// One place to map icon names to SF Symbols (iOS) and Material Symbols (Android/web).
const ICONS = {
  home: { ios: 'house', android: 'home', web: 'home' },
  shop: { ios: 'square.grid.2x2', android: 'grid_view', web: 'grid_view' },
  bag: { ios: 'bag', android: 'shopping_bag', web: 'shopping_bag' },
  info: { ios: 'info.circle', android: 'info', web: 'info' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  chevron: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  plus: { ios: 'plus', android: 'add', web: 'add' },
  minus: { ios: 'minus', android: 'remove', web: 'remove' },
  trash: { ios: 'trash', android: 'delete', web: 'delete' },
} satisfies Record<string, SymbolName>;

export type IconName = keyof typeof ICONS;

export function Icon({ name, color, size = 22 }: { name: IconName; color: ColorValue; size?: number }) {
  return <SymbolView name={ICONS[name]} tintColor={color} size={size} />;
}
