import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../types';
import { colors } from '../theme/colors';

type Props = {
  product: Product;
  onPress: () => void;
};

export default function ProductCard({ product, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: product.image || 'https://via.placeholder.com/300' }}
        style={styles.image}
      />
      <Text style={styles.name} numberOfLines={1}>
        {product.name}
      </Text>
      <Text style={styles.category}>{product.category}</Text>
      <View style={styles.footer}>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>+</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 168,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginRight: 12,
    marginBottom: 12
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    backgroundColor: colors.card
  },
  name: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text
  },
  category: {
    marginTop: 4,
    color: colors.textSoft
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  price: {
    color: colors.primaryDark,
    fontWeight: '800',
    fontSize: 16
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18
  }
});
