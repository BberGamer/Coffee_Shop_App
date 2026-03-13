import React from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { useCart } from '../context/CartContext';
import { colors } from '../theme/colors';

export default function CartScreen({ navigation }: any) {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const shippingFee = subtotal >= 25 ? 0 : 5;
  const total = subtotal + shippingFee;

  return (
    <ScreenContainer>
      <Text style={styles.title}>Your Cart</Text>
      <Text style={styles.subtitle}>Review and adjust your items before checkout</Text>

      {items.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        </View>
      ) : (
        items.map((item) => (
          <View key={`${item.product._id}-${item.size}`} style={styles.card}>
            <Image source={{ uri: item.product.image }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.product.name}</Text>
              <Text style={styles.itemMeta}>Size: {item.size}</Text>
              <Text style={styles.itemPrice}>${item.product.price.toFixed(2)}</Text>

              <View style={styles.qtyRow}>
                <Pressable style={styles.qtyButton} onPress={() => updateQuantity(item.product._id, item.size, item.quantity - 1)}>
                  <Text>-</Text>
                </Pressable>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <Pressable style={styles.qtyButton} onPress={() => updateQuantity(item.product._id, item.size, item.quantity + 1)}>
                  <Text>+</Text>
                </Pressable>
              </View>
            </View>
            <Pressable onPress={() => removeItem(item.product._id, item.size)}>
              <Text style={styles.deleteText}>Remove</Text>
            </Pressable>
          </View>
        ))
      )}

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Subtotal</Text>
          <Text style={styles.summaryText}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Shipping Fee</Text>
          <Text style={styles.summaryText}>${shippingFee.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
        </View>
      </View>

      <PrimaryButton
        title="Proceed to Checkout"
        onPress={() => {
          if (items.length === 0) {
            Alert.alert('Notice', 'Please add at least one product.');
            return;
          }
          navigation.navigate('Checkout');
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text
  },
  subtitle: {
    marginTop: 8,
    color: colors.textSoft,
    marginBottom: 16
  },
  emptyCard: {
    padding: 18,
    backgroundColor: '#fff',
    borderRadius: 18
  },
  emptyText: {
    color: colors.textSoft
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    gap: 12
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: 16,
    backgroundColor: colors.card
  },
  itemName: {
    fontWeight: '700',
    color: colors.text,
    fontSize: 16
  },
  itemMeta: {
    color: colors.textSoft,
    marginTop: 4
  },
  itemPrice: {
    marginTop: 4,
    color: colors.primaryDark,
    fontWeight: '700'
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  qtyButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center'
  },
  qtyValue: {
    marginHorizontal: 12,
    fontWeight: '700'
  },
  deleteText: {
    color: colors.danger,
    fontWeight: '600'
  },
  summary: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    marginTop: 12,
    marginBottom: 18
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  summaryText: {
    color: colors.textSoft
  },
  totalText: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 18
  },
  totalPrice: {
    color: colors.primaryDark,
    fontWeight: '800',
    fontSize: 20
  }
});
