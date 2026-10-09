import { Tabs } from 'expo-router';

import { Icon } from '@/components/Icon';
import { colors } from '@/constants/theme';
import { useCart } from '@/lib/cart';

export default function TabLayout() {
  const { count } = useCart();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.muted,
        headerTitleStyle: { fontWeight: '800', letterSpacing: 2 },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', headerTitle: 'JAKWEARS', tabBarIcon: ({ color }) => <Icon name="home" color={color} /> }}
      />
      <Tabs.Screen
        name="shop"
        options={{ title: 'Shop', headerTitle: 'SHOP', tabBarIcon: ({ color }) => <Icon name="shop" color={color} /> }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          headerTitle: 'CART',
          tabBarBadge: count > 0 ? count : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.text, color: colors.onAccent },
          tabBarIcon: ({ color }) => <Icon name="bag" color={color} />,
        }}
      />
      <Tabs.Screen
        name="info"
        options={{ title: 'Info', headerTitle: 'INFO', tabBarIcon: ({ color }) => <Icon name="info" color={color} /> }}
      />
    </Tabs>
  );
}
