import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { api } from '../services/api';
import { Product } from '../types';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { getSizePrice, getSizePriceLabel } from '../utils/pricing';

export default function ProductDetailScreen({ route, navigation }: any) {
  const { productId } = route.params;
  const { addToCart, items } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${productId}`);
      setProduct(response.data);
      setSelectedSize(response.data.sizes?.[0] || 'M');
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  if (loading || !product) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const selectedPrice = getSizePrice(product.price, selectedSize);
  const totalPrice = selectedPrice * quantity;
  const quantityInCart = items.reduce(
    (sum, item) => (item.product._id === product._id ? sum + item.quantity : sum),
    0
  );
  const remainingCapacity = Math.max(product.stock - quantityInCart, 0);
  const isOutOfStock = product.stock <= 0;

  return (
    <ScreenContainer>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.meta}>{product.category} - Origin: {product.origin}</Text>
        </View>
        <View style={styles.priceWrap}>
          <Text style={styles.price}>{getSizePriceLabel(product.price, selectedSize)}</Text>
          <Text style={styles.priceNote}>Size {selectedSize}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Description</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={[styles.stockText, isOutOfStock ? styles.stockEmpty : null]}>
        {isOutOfStock ? 'Out of stock' : `Available now: ${product.stock}`}
      </Text>
      {quantityInCart > 0 ? (
        <Text style={styles.stockHint}>Already in cart: {quantityInCart}</Text>
      ) : null}

      <Text style={styles.sectionLabel}>Size</Text>
      <View style={styles.inlineRow}>
        {product.sizes.map((size) => (
          <Pressable
            key={size}
            style={[styles.sizeButton, selectedSize === size ? styles.sizeButtonActive : null]}
            onPress={() => setSelectedSize(size)}
          >
            <Text style={[styles.sizeText, selectedSize === size ? styles.sizeTextActive : null]}>
              {size} - {getSizePriceLabel(product.price, size)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Quantity</Text>
      <View style={styles.quantityRow}>
        <Pressable style={styles.qtyButton} onPress={() => setQuantity((q) => Math.max(1, q - 1))}>
          <Text style={styles.qtyText}>-</Text>
        </Pressable>
        <Text style={styles.qtyValue}>{quantity}</Text>
        <Pressable
          style={[styles.qtyButton, remainingCapacity <= quantity ? styles.qtyButtonDisabled : null]}
          onPress={() => {
            if (remainingCapacity <= quantity) {
              Alert.alert('Notice', `Only ${product.stock} item(s) are available right now.`);
              return;
            }

            setQuantity((q) => q + 1);
          }}
        >
          <Text style={styles.qtyText}>+</Text>
        </Pressable>
      </View>

      <PrimaryButton
        title={isOutOfStock ? 'Out of Stock' : `Add to Cart - $${totalPrice.toFixed(2)}`}
        onPress={() => {
          const result = addToCart(product, quantity, selectedSize);
          if (!result.ok) {
            Alert.alert('Notice', result.message || 'Quantity exceeds available stock');
            return;
          }

          Alert.alert('Success', 'Added to cart');
          navigation.navigate('CustomerTabs', { screen: 'CartTab' });
        }}
        disabled={isOutOfStock}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 26,
    backgroundColor: '#fff'
  },
  row: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text
  },
  meta: {
    marginTop: 8,
    color: colors.textSoft
  },
  priceWrap: {
    alignItems: 'flex-end'
  },
  price: {
    color: colors.primaryDark,
    fontWeight: '800',
    fontSize: 28
  },
  priceNote: {
    marginTop: 4,
    color: colors.textSoft
  },
  sectionLabel: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '700',
    color: colors.text,
    fontSize: 18
  },
  description: {
    color: colors.textSoft,
    lineHeight: 22
  },
  stockText: {
    marginTop: 10,
    color: colors.primaryDark,
    fontWeight: '700'
  },
  stockHint: {
    marginTop: 4,
    color: colors.textSoft
  },
  stockEmpty: {
    color: colors.danger
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 12
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#fff'
  },
  sizeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.card
  },
  sizeText: {
    color: colors.text
  },
  sizeTextActive: {
    color: colors.primaryDark,
    fontWeight: '700'
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  qtyButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center'
  },
  qtyButtonDisabled: {
    opacity: 0.45
  },
  qtyText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text
  },
  qtyValue: {
    marginHorizontal: 18,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text
  }
});
