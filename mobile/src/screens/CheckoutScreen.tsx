import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { colors } from '../theme/colors';

const paymentOptions = [
  { label: 'Credit Card', value: 'card' },
  { label: 'E-wallet', value: 'ewallet' },
  { label: 'Cash (COD)', value: 'cod' }
];

export default function CheckoutScreen({ navigation }: any) {
  const { items, subtotal, clearCart } = useCart();
  const shippingFee = subtotal >= 25 ? 0 : 5;
  const total = subtotal + shippingFee;

  const [fullName, setFullName] = useState('Nguyen Van A');
  const [phone, setPhone] = useState('0900000000');
  const [street, setStreet] = useState('123 Main Street');
  const [city, setCity] = useState('Ha Noi');
  const [zipCode, setZipCode] = useState('100000');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'ewallet' | 'cod'>('card');
  const [loading, setLoading] = useState(false);

  const confirmOrder = async () => {
    try {
      const quantityByProduct = new Map<string, { name: string; stock: number; quantity: number }>();

      for (const item of items) {
        const current = quantityByProduct.get(item.product._id) || {
          name: item.product.name,
          stock: item.product.stock,
          quantity: 0
        };

        current.quantity += item.quantity;
        quantityByProduct.set(item.product._id, current);
      }

      for (const product of quantityByProduct.values()) {
        if (product.quantity > product.stock) {
          Alert.alert(
            'Notice',
            `You ordered too many "${product.name}". Only ${product.stock} item(s) are available.`
          );
          return;
        }
      }

      setLoading(true);

      await api.post('/orders', {
        items: items.map((item) => ({
          product: item.product._id,
          slug: item.product.slug,
          name: item.product.name,
          quantity: item.quantity,
          size: item.size
        })),
        shippingAddress: {
          fullName,
          phone,
          street,
          city,
          zipCode
        },
        paymentMethod
      });

      clearCart();
      Alert.alert('Success', 'Order placed successfully');
      navigation.navigate('CustomerTabs', { screen: 'OrdersTab' });
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.sectionTitle}>Shipping Information</Text>
      <InputField label="Full Name" value={fullName} onChangeText={setFullName} />
      <InputField label="Phone" value={phone} onChangeText={setPhone} />
      <InputField label="Street" value={street} onChangeText={setStreet} />
      <InputField label="City" value={city} onChangeText={setCity} />
      <InputField label="Zip Code" value={zipCode} onChangeText={setZipCode} />

      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.optionRow}>
        {paymentOptions.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => setPaymentMethod(option.value as any)}
            style={[styles.option, paymentMethod === option.value ? styles.optionActive : null]}
          >
            <Text style={[styles.optionText, paymentMethod === option.value ? styles.optionTextActive : null]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        {items.map((item) => (
          <View key={`${item.product._id}-${item.size}`} style={styles.summaryRow}>
            <Text style={styles.itemSummaryText}>
              {item.product.name} x{item.quantity}
            </Text>
            <Text style={[styles.itemSummaryStock, item.product.stock === 0 ? styles.stockAlert : null]}>
              Stock: {item.product.stock}
            </Text>
          </View>
        ))}
        <View style={styles.summaryRow}>
          <Text>Subtotal</Text>
          <Text>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Shipping Fee</Text>
          <Text>${shippingFee.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
        </View>
      </View>

      <PrimaryButton title="Confirm Order" onPress={confirmOrder} loading={loading} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22
  },
  option: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.card
  },
  optionText: {
    textAlign: 'center',
    color: colors.text
  },
  optionTextActive: {
    color: colors.primaryDark,
    fontWeight: '700'
  },
  summary: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 20,
    marginBottom: 18
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  itemSummaryText: {
    color: colors.textSoft
  },
  itemSummaryStock: {
    color: colors.primaryDark,
    fontWeight: '600'
  },
  stockAlert: {
    color: colors.danger
  },
  totalText: {
    fontWeight: '800',
    fontSize: 18
  },
  totalPrice: {
    fontWeight: '800',
    color: colors.primaryDark,
    fontSize: 20
  }
});
