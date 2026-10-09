import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { formatPrice, imageUrl, isSoldOut, startingPrice, type Product } from '@/lib/catalog';

export function ProductCard({ product, width }: { product: Product; width: number }) {
  const { price, compareAtPrice } = startingPrice(product);
  const soldOut = isSoldOut(product);

  return (
    <Link href={{ pathname: '/product/[handle]', params: { handle: product.handle } }} asChild>
      <Pressable style={{ width }}>
        <View>
          <Image
            source={imageUrl(product.images[0], width * 2)}
            style={[styles.image, { width, height: width * 1.25 }]}
            contentFit="cover"
            transition={150}
            recyclingKey={product.id}
          />
          {soldOut && <Text style={styles.badge}>SOLD OUT</Text>}
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(price)}</Text>
          {compareAtPrice != null && compareAtPrice > price && (
            <Text style={styles.compare}>{formatPrice(compareAtPrice)}</Text>
          )}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.surface },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.text,
    color: colors.onAccent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  title: { marginTop: spacing.sm, fontSize: 13, fontWeight: '600', color: colors.text, letterSpacing: 0.3 },
  priceRow: { flexDirection: 'row', gap: spacing.sm, marginTop: 2 },
  price: { fontSize: 13, color: colors.text },
  compare: { fontSize: 13, color: colors.muted, textDecorationLine: 'line-through' },
});
