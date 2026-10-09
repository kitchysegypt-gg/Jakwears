import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ProductGrid } from '@/components/ProductGrid';
import { colors, spacing } from '@/constants/theme';
import { getCollection, productsInCollection } from '@/lib/catalog';

export default function CollectionScreen() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const collection = getCollection(handle);
  const items = productsInCollection(handle);

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: collection?.title ?? 'Collection' }} />
      <ProductGrid
        products={items}
        header={<Text style={styles.count}>{items.length} PRODUCTS</Text>}
        emptyText="This collection is empty."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  count: { margin: spacing.md, fontSize: 12, color: colors.muted, letterSpacing: 1 },
});
