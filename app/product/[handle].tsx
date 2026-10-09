import { Image } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, Share, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { useCart } from '@/lib/cart';
import { formatPrice, getProduct, imageUrl, productUrl } from '@/lib/catalog';

export default function ProductScreen() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const product = getProduct(handle);
  const { width } = useWindowDimensions();
  const { add } = useCart();
  const [imageIndex, setImageIndex] = useState(0);
  const [variantId, setVariantId] = useState(() => product?.variants.find((v) => v.available)?.id);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Text style={styles.muted}>This product is no longer available.</Text>
      </View>
    );
  }

  const variant = product.variants.find((v) => v.id === variantId);
  const shown = variant ?? product.variants[0];
  const optionName = product.options[0]?.name ?? 'Option';

  const onAdd = () => {
    if (!variant) return;
    add(variant.id);
    setAdded(true);
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => (
            <Pressable onPress={() => Share.share({ message: `${product.title} ${productUrl(product)}` })} hitSlop={8}>
              <Text style={styles.headerLink}>Share</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <FlatList
          horizontal
          pagingEnabled
          data={product.images}
          keyExtractor={(url) => url}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setImageIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
          renderItem={({ item }) => (
            <Image
              source={imageUrl(item, width * 2)}
              style={{ width, height: width * 1.25, backgroundColor: colors.surface }}
              contentFit="cover"
              transition={150}
            />
          )}
        />
        {product.images.length > 1 && (
          <View style={styles.dots}>
            {product.images.map((url, i) => (
              <View key={url} style={[styles.dot, i === imageIndex && styles.dotActive]} />
            ))}
          </View>
        )}

        <View style={styles.body}>
          <Text style={styles.title}>{product.title}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(shown.price)}</Text>
            {shown.compareAtPrice != null && shown.compareAtPrice > shown.price && (
              <>
                <Text style={styles.compare}>{formatPrice(shown.compareAtPrice)}</Text>
                <Text style={styles.save}>SAVE {formatPrice(shown.compareAtPrice - shown.price)}</Text>
              </>
            )}
          </View>

          <Text style={styles.label}>{optionName.toUpperCase()}</Text>
          <View style={styles.options}>
            {product.variants.map((v) => {
              const selected = v.id === variantId;
              return (
                <Pressable
                  key={v.id}
                  disabled={!v.available}
                  onPress={() => {
                    setVariantId(v.id);
                    setAdded(false);
                  }}
                  style={[styles.option, selected && styles.optionSelected, !v.available && styles.optionDisabled]}>
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.optionTextSelected,
                      !v.available && styles.optionTextDisabled,
                    ]}>
                    {v.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {product.description.length > 0 && (
            <>
              <Text style={styles.label}>DETAILS</Text>
              {product.description.map((line, i) => (
                <Text key={i} style={styles.detail}>
                  {line}
                </Text>
              ))}
            </>
          )}

          <Pressable onPress={() => WebBrowser.openBrowserAsync(productUrl(product))} style={{ marginTop: spacing.lg }}>
            <Text style={styles.webLink}>View on jakwears.com</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {added ? (
          <Pressable style={styles.button} onPress={() => router.navigate('/cart')}>
            <Text style={styles.buttonText}>ADDED · VIEW CART</Text>
          </Pressable>
        ) : (
          <Pressable style={[styles.button, !variant && styles.buttonDisabled]} onPress={onAdd} disabled={!variant}>
            <Text style={styles.buttonText}>{variant ? 'ADD TO CART' : 'SOLD OUT'}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  muted: { color: colors.muted },
  headerLink: { fontWeight: '600', color: colors.text },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.sm },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.text },
  body: { padding: spacing.md },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: 0.5, color: colors.text },
  priceRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  price: { fontSize: 18, color: colors.text },
  compare: { fontSize: 16, color: colors.muted, textDecorationLine: 'line-through' },
  save: { fontSize: 12, fontWeight: '700', color: colors.sale },
  label: { marginTop: spacing.lg, marginBottom: spacing.sm, fontSize: 12, fontWeight: '800', letterSpacing: 1.5, color: colors.text },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  option: { borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 10, minWidth: 52, alignItems: 'center' },
  optionSelected: { borderColor: colors.text, backgroundColor: colors.text },
  optionDisabled: { opacity: 0.4 },
  optionText: { fontWeight: '600', color: colors.text },
  optionTextSelected: { color: colors.onAccent },
  optionTextDisabled: { textDecorationLine: 'line-through' },
  detail: { color: colors.text, lineHeight: 22 },
  webLink: { color: colors.muted, textDecorationLine: 'underline' },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: { backgroundColor: colors.accent, paddingVertical: 16, alignItems: 'center' },
  buttonDisabled: { backgroundColor: colors.muted },
  buttonText: { color: colors.onAccent, fontWeight: '800', letterSpacing: 1.5 },
});
