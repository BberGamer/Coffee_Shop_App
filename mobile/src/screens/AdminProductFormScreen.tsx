import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export default function AdminProductFormScreen({ navigation, route }: any) {
  const product = route?.params?.product;

  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(String(product?.price ?? ''));
  const [image, setImage] = useState(product?.image || '');
  const [category, setCategory] = useState(product?.category || 'Coffee');
  const [origin, setOrigin] = useState(product?.origin || 'Vietnam');
  const [stock, setStock] = useState(String(product?.stock ?? 10));
  const [sizes, setSizes] = useState((product?.sizes || ['S', 'M', 'L']).join(','));
  const [featured, setFeatured] = useState(Boolean(product?.featured));
  const [status, setStatus] = useState(product?.status || 'active');
  const [loading, setLoading] = useState(false);

  const saveProduct = async () => {
    try {
      setLoading(true);

      const payload = {
        name,
        description,
        price: Number(price),
        image,
        category,
        origin,
        stock: Number(stock),
        sizes: sizes.split(',').map((item: string) => item.trim()).filter(Boolean),
        featured,
        status
      };

      if (product?._id) {
        await api.put(`/products/${product._id}`, payload);
        Alert.alert('Success', 'Product updated');
      } else {
        await api.post('/products', payload);
        Alert.alert('Success', 'Product created');
      }

      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>{product ? 'Edit Product' : 'Create Product'}</Text>

      <InputField label="Name" value={name} onChangeText={setName} />
      <InputField label="Description" value={description} onChangeText={setDescription} multiline />
      <InputField label="Price" value={price} onChangeText={setPrice} />
      <InputField label="Image URL" value={image} onChangeText={setImage} />
      <InputField label="Category" value={category} onChangeText={setCategory} />
      <InputField label="Origin" value={origin} onChangeText={setOrigin} />
      <InputField label="Stock" value={stock} onChangeText={setStock} />
      <InputField label="Sizes (comma separated)" value={sizes} onChangeText={setSizes} />
      <InputField label="Status (active/inactive)" value={status} onChangeText={setStatus} />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Featured product</Text>
        <Switch value={featured} onValueChange={setFeatured} />
      </View>

      <PrimaryButton title="Save Product" onPress={saveProduct} loading={loading} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 18
  },
  switchRow: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  switchLabel: {
    color: colors.text,
    fontWeight: '700'
  }
});
