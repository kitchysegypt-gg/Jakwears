import * as WebBrowser from 'expo-web-browser';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, spacing } from '@/constants/theme';
import { exportedAt, products, shop } from '@/lib/catalog';

export default function InfoScreen() {
  const rows = [
    { label: 'Website', value: shop.url.replace('https://', ''), onPress: () => WebBrowser.openBrowserAsync(shop.url) },
    { label: 'Email', value: shop.email, onPress: () => Linking.openURL(`mailto:${shop.email}`) },
    { label: 'Phone', value: shop.phone, onPress: () => Linking.openURL(`tel:${shop.phone.replace(/\s/g, '')}`) },
    ...shop.policies.map((p) => ({ label: p.title, value: '', onPress: () => WebBrowser.openBrowserAsync(p.url) })),
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.brand}>{shop.name.toUpperCase()}</Text>
      <Text style={styles.address}>{shop.address}</Text>

      <View style={styles.list}>
        {rows.map((r) => (
          <Pressable key={r.label} style={styles.row} onPress={r.onPress}>
            <Text style={styles.label}>{r.label}</Text>
            <Text style={styles.value} numberOfLines={1}>
              {r.value}
            </Text>
            <Icon name="chevron" color={colors.muted} size={16} />
          </Pressable>
        ))}
      </View>

      <Text style={styles.footnote}>
        Catalog of {products.length} products, synced from the Jakwears Shopify store on {exportedAt}. Prices in{' '}
        {shop.currency}.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  brand: { fontSize: 28, fontWeight: '900', letterSpacing: 3, color: colors.text, marginTop: spacing.md },
  address: { color: colors.muted, marginTop: spacing.sm, lineHeight: 20 },
  list: { marginTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { fontWeight: '700', color: colors.text },
  value: { flex: 1, textAlign: 'right', color: colors.muted },
  footnote: { marginTop: spacing.xl, fontSize: 12, color: colors.muted, lineHeight: 18 },
});
