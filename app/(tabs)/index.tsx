import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ProductCard } from '@/components/ProductCard';
import { colors, spacing } from '@/constants/theme';
import {
  featuredProducts,
  getCollection,
  imageUrl,
  newArrivals,
  productsInCollection,
  type Product,
} from '@/lib/catalog';

// Season drops and core categories surfaced on the home screen, in this order.
const HOME_COLLECTIONS = ['win-27', 'summer-26', 'boxy-hoodies', 'denim', 'tees', 'zip-up'];

export default function HomeScreen() {
  const hero = featuredProducts[0] ?? newArrivals[0];
  const tiles = HOME_COLLECTIONS.map(getCollection).filter((c) => c != null);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <Pressable onPress={() => router.navigate('/shop')}>
        <View style={styles.hero}>
          <Image source={imageUrl(hero.images[0], 1080)} style={StyleSheet.absoluteFill} contentFit="cover" />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>NEW SEASON</Text>
            <Text style={styles.heroCta}>SHOP NOW</Text>
          </View>
        </View>
      </Pressable>

      <Rail title="NEW ARRIVALS" products={newArrivals} />
      <Rail title="FEATURED" products={featuredProducts} />

      <Text style={styles.sectionTitle}>COLLECTIONS</Text>
      <View style={styles.tiles}>
        {tiles.map((c) => {
          const cover = productsInCollection(c.handle)[0];
          return (
            <Link key={c.handle} href={{ pathname: '/collection/[handle]', params: { handle: c.handle } }} asChild>
              <Pressable style={styles.tile}>
                <Image
                  source={cover ? imageUrl(cover.images[0], 600) : undefined}
                  style={styles.tileImage}
                  contentFit="cover"
                />
                <Text style={styles.tileLabel}>{c.title}</Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </ScrollView>
  );
}

function Rail({ title, products }: { title: string; products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        horizontal
        data={products}
        keyExtractor={(p) => p.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.md }}
        renderItem={({ item }) => <ProductCard product={item} width={160} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  hero: { width: '100%', aspectRatio: 4 / 5, backgroundColor: colors.surface },
  heroOverlay: { position: 'absolute', left: spacing.md, bottom: spacing.lg },
  heroTitle: {
    color: colors.onAccent,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowRadius: 8,
  },
  heroCta: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    backgroundColor: colors.background,
    color: colors.text,
    fontWeight: '800',
    letterSpacing: 1.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
  },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingHorizontal: spacing.md },
  // Two columns: each tile takes just under half the row; the gap fills the rest.
  tile: { flexBasis: '45%', flexGrow: 1 },
  tileImage: { width: '100%', aspectRatio: 1, backgroundColor: colors.surface },
  tileLabel: { marginTop: spacing.sm, fontWeight: '700', letterSpacing: 1, color: colors.text },
});
