import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { ProductGrid } from '@/components/ProductGrid';
import { colors, spacing } from '@/constants/theme';
import { browsableCollections, searchProducts } from '@/lib/catalog';

export default function ShopScreen() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchProducts(query), [query]);

  const header = (
    <View>
      <View style={styles.search}>
        <Icon name="search" color={colors.muted} size={18} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search products"
          placeholderTextColor={colors.muted}
          style={styles.input}
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {query.trim() === '' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {browsableCollections.map((c) => (
            <Link key={c.handle} href={{ pathname: '/collection/[handle]', params: { handle: c.handle } }} asChild>
              <Pressable style={styles.chip}>
                <Text style={styles.chipText}>{c.title}</Text>
              </Pressable>
            </Link>
          ))}
        </ScrollView>
      )}

      <Text style={styles.count}>
        {results.length} {results.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
      </Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <ProductGrid products={results} header={header} emptyText={`No products match "${query}".`} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    height: 44,
  },
  input: { flex: 1, fontSize: 15, color: colors.text },
  chips: { paddingHorizontal: spacing.md, gap: spacing.sm },
  chip: { borderWidth: 1, borderColor: colors.text, paddingHorizontal: 14, paddingVertical: 8 },
  chipText: { fontSize: 12, fontWeight: '700', letterSpacing: 1, color: colors.text },
  count: { margin: spacing.md, fontSize: 12, color: colors.muted, letterSpacing: 1 },
});
