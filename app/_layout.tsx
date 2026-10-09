import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/constants/theme';
import { CartProvider } from '@/lib/cart';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.background, primary: colors.text, text: colors.text },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={theme}>
      <CartProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerTintColor: colors.text, headerBackButtonDisplayMode: 'minimal' }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="product/[handle]" options={{ title: '' }} />
          <Stack.Screen name="collection/[handle]" options={{ title: '' }} />
        </Stack>
      </CartProvider>
    </ThemeProvider>
  );
}
