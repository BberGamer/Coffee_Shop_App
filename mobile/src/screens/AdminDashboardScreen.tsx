import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { api } from '../services/api';
import { colors } from '../theme/colors';

type Stats = {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  recentOrders: Array<{
    _id: string;
    totalAmount: number;
    status: string;
    user?: {
      name: string;
      email: string;
    };
  }>;
};

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }
  return (
    <ScreenContainer>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>Quick overview of your coffee store</Text>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Products</Text>
          <Text style={styles.cardValue}>{stats.totalProducts}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Orders</Text>
          <Text style={styles.cardValue}>{stats.totalOrders}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Customers</Text>
          <Text style={styles.cardValue}>{stats.totalCustomers}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Revenue</Text>
          <Text style={styles.cardValue}>${stats.totalRevenue.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Orders</Text>
      {stats.recentOrders.map((order) => (
        <View key={order._id} style={styles.orderCard}>
          <Text style={styles.orderName}>{order.user?.name || 'Unknown user'}</Text>
          <Text style={styles.orderMeta}>{order.user?.email || '-'}</Text>
          <View style={styles.orderRow}>
            <Text style={styles.orderMeta}>Status: {order.status}</Text>
            <Text style={styles.orderAmount}>${order.totalAmount.toFixed(2)}</Text>
          </View>
        </View>
      ))}
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
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text
  },
  subtitle: {
    marginTop: 6,
    color: colors.textSoft
  },
  grid: {
    marginTop: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  card: {
    width: '47%',
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border
  },
  cardLabel: {
    color: colors.textSoft
  },
  cardValue: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: '800',
    color: colors.primaryDark
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: '800',
    color: colors.text
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  orderName: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16
  },
  orderMeta: {
    color: colors.textSoft,
    marginTop: 4
  },
  orderRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  orderAmount: {
    color: colors.primaryDark,
    fontWeight: '700'
  }
});
