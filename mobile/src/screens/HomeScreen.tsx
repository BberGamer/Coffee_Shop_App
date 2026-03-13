import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { Product } from '../types';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = async (keyword = '') => {
    try {
      setLoading(true);
      const [featuredRes, productRes] = await Promise.all([
        api.get('/products?featured=true'),
        api.get(`/products?search=${keyword}`)
      ]);

      setFeatured(featuredRes.data.items);
      setProducts(productRes.data.items);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <ScreenContainer>
      <Text style={styles.logo}>☕</Text>
      <Text style={styles.heading}>Welcome to Our Coffee Shop</Text>
      <Text style={styles.subHeading}>
        Xin chào {user?.name}, khám phá thức uống yêu thích của bạn hôm nay.
      </Text>

      <View style={styles.banner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Special offers – Get 20% off your first order!</Text>
          <Pressable style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Shop Now</Text>
          </Pressable>
        </View>
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={() => loadProducts(search)}
        placeholder="Search coffee..."
        placeholderTextColor={colors.textSoft}
        style={styles.search}
      />

      {loading ? (
        <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 40 }} />
      ) : (
        <>
          <SectionTitle title="Featured Drinks" />
          <FlatList
            data={featured}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ProductCard product={item} onPress={() => navigation.navigate('ProductDetail', { productId: item._id })} />
            )}
          />

          <SectionTitle title="Browse Our Menu" />
          <View style={styles.grid}>
            {products.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
              />
            ))}
          </View>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontSize: 24
  },
  heading: {
    marginTop: 10,
    fontSize: 32,
    fontWeight: '800',
    color: colors.text
  },
  subHeading: {
    marginTop: 6,
    color: colors.textSoft,
    lineHeight: 22
  },
  banner: {
    marginTop: 18,
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 24
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24
  },
  bannerButton: {
    marginTop: 14,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    alignSelf: 'flex-start'
  },
  bannerButtonText: {
    color: colors.primaryDark,
    fontWeight: '700'
  },
  search: {
    marginTop: 18,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});
