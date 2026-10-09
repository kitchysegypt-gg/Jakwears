import type { ReactElement } from 'react';
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ProductCard } from '@/components/ProductCard';
import { colors, spacing } from '@/constants/theme';
import type { Product } from '@/lib/catalog';

const COLUMNS = 2;

export function ProductGrid({
  products,
  header,
  emptyText = 'No products found.',
}: {
  products: Product[];
  header?: ReactElement;
  emptyText?: string;
}) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - spacing.md * 2 - spacing.md * (COLUMNS - 1)) / COLUMNS;

  return (
    <FlatList
      data={products}
      keyExtractor={(p) => p.id}
      numColumns={COLUMNS}
      ListHeaderComponent={header}
      ListEmptyComponent={<Text style={styles.empty}>{emptyText}</Text>}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      keyboardDismissMode="on-drag"
      renderItem={({ item }) => <ProductCard product={item} width={cardWidth} />}
      ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xl, backgroundColor: colors.background },
  row: { paddingHorizontal: spacing.md, gap: spacing.md },
  empty: { textAlign: 'center', color: colors.muted, marginTop: spacing.xl },
});
