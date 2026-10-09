import { Image } from 'expo-image';
import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, spacing } from '@/constants/theme';
import { useCart } from '@/lib/cart';
import { checkoutUrl, formatPrice, getVariant, imageUrl } from '@/lib/catalog';

export default function CartScreen() {
  const { lines, subtotal, setQuantity, remove } = useCart();

  if (lines.length === 0) {
    return (
      <View style={[styles.screen, styles.empty]}>
        <Icon name="bag" color={colors.muted} size={48} />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <Link href="/shop" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>CONTINUE SHOPPING</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={lines}
        keyExtractor={(l) => l.variantId}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}
        renderItem={({ item }) => {
          const entry = getVariant(item.variantId);
          if (!entry) return null;
          const { product, variant } = entry;
          return (
            <View style={styles.line}>
              <Image source={imageUrl(product.images[0], 200)} style={styles.thumb} contentFit="cover" />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{product.title}</Text>
                <Text style={styles.meta}>{variant.title}</Text>
                <Text style={styles.price}>{formatPrice(variant.price * item.quantity)}</Text>
                <View style={styles.qtyRow}>
                  <Pressable style={styles.qtyButton} onPress={() => setQuantity(item.variantId, item.quantity - 1)}>
                    <Icon name="minus" color={colors.text} size={16} />
                  </Pressable>
                  <Text style={styles.qty}>{item.quantity}</Text>
                  <Pressable style={styles.qtyButton} onPress={() => setQuantity(item.variantId, item.quantity + 1)}>
                    <Icon name="plus" color={colors.text} size={16} />
                  </Pressable>
                  <Pressable style={styles.remove} onPress={() => remove(item.variantId)} hitSlop={8}>
                    <Icon name="trash" color={colors.muted} size={18} />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>SUBTOTAL</Text>
          <Text style={styles.total}>{formatPrice(subtotal)}</Text>
        </View>
        <Text style={styles.note}>Shipping and discounts are calculated at checkout.</Text>
        <Pressable style={styles.button} onPress={() => WebBrowser.openBrowserAsync(checkoutUrl(lines))}>
          <Text style={styles.buttonText}>CHECKOUT</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  empty: { alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.lg },
  emptyText: { fontSize: 16, color: colors.muted },
  line: { flexDirection: 'row', gap: spacing.md },
  thumb: { width: 88, height: 110, backgroundColor: colors.surface },
  title: { fontWeight: '700', color: colors.text },
  meta: { color: colors.muted, marginTop: 2 },
  price: { color: colors.text, marginTop: spacing.xs },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  qtyButton: { borderWidth: 1, borderColor: colors.border, padding: 6 },
  qty: { minWidth: 32, textAlign: 'center', fontWeight: '600', color: colors.text },
  remove: { marginLeft: 'auto' },
  footer: { borderTopWidth: 1, borderTopColor: colors.border, padding: spacing.md, gap: spacing.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontWeight: '800', letterSpacing: 1, color: colors.text },
  total: { fontWeight: '800', color: colors.text },
  note: { fontSize: 12, color: colors.muted },
  button: { backgroundColor: colors.accent, paddingVertical: 16, paddingHorizontal: spacing.lg, alignItems: 'center' },
  buttonText: { color: colors.onAccent, fontWeight: '800', letterSpacing: 1.5 },
});
