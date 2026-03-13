import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { api } from '../services/api';
import { Product } from '../types';
import { colors } from '../theme/colors';
import PrimaryButton from '../components/PrimaryButton';

export default function AdminProductsScreen({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products?status=');
      setProducts(response.data.items);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to load products');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      Alert.alert('Success', 'Product deleted');
      loadProducts();
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to delete product');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadProducts);
    return unsubscribe;
  }, [navigation]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Product Management</Text>
      <Text style={styles.subtitle}>Add, edit and delete coffee products</Text>

      <PrimaryButton title="Add New Product" onPress={() => navigation.navigate('AdminProductForm')} />

      <View style={{ marginTop: 18 }}>
        {products.map((item) => (
          <View key={item._id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.category} • Stock: {item.stock}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>

              <View style={styles.row}>
                <Pressable
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => navigation.navigate('AdminProductForm', { product: item })}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => deleteProduct(item._id)}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </View>
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
    marginTop: 6,
    color: colors.textSoft,
    marginBottom: 16
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12
  },
  image: {
    width: 86,
    height: 86,
    borderRadius: 16
  },
  name: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16
  },
  meta: {
    color: colors.textSoft,
    marginTop: 6
  },
  price: {
    color: colors.primaryDark,
    fontWeight: '700',
    marginTop: 6
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12
  },
  editButton: {
    backgroundColor: colors.primary
  },
  deleteButton: {
    backgroundColor: colors.danger
  },
  actionText: {
    color: '#fff',
    fontWeight: '700'
  }
});
