import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import { api } from '../services/api';
import { Order } from '../types';
import { colors } from '../theme/colors';

const statusColorMap: Record<string, string> = {
  pending: '#BD9C89',
  preparing: '#69564B',
  delivered: '#43362F',
  cancelled: '#927869'
};

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/my');
      const items = Array.isArray(response?.data?.items) ? response.data.items : [];
      setOrders(items);
    } catch (error: any) {
      setOrders([]);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  return (
    <ScreenContainer>
      <Text style={styles.title}>Order History</Text>
      <Text style={styles.subtitle}>Track your latest orders and their status</Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 40 }} />
      ) : orders.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>You do not have any orders yet.</Text>
        </View>
      ) : (
        orders.map((order) => (
          <View key={order._id} style={styles.card}>
            <View style={styles.headerRow}>
              <Text
                style={[
                  styles.status,
                  {
                    backgroundColor: `${statusColorMap[order.status] || colors.primary}22`,
                    color: statusColorMap[order.status] || colors.primary
                  }
                ]}
              >
                {(order.status || 'pending').toUpperCase()}
              </Text>
              <Text style={styles.amount}>${Number(order.totalAmount || 0).toFixed(2)}</Text>
            </View>

            {(Array.isArray(order.items) ? order.items : []).map((item, index) => (
              <View key={`${order._id}-${index}`} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}

            <View style={styles.line} />
            <View style={styles.itemRow}>
              <Text style={styles.metaText}>Payment</Text>
              <Text style={styles.metaText}>{order.paymentMethod || '-'}</Text>
            </View>
            <View style={styles.itemRow}>
              <Text style={styles.metaText}>Created</Text>
              <Text style={styles.metaText}>
                {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}
              </Text>
            </View>
          </View>
        ))
      )}
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
    color: colors.textSoft,
    marginTop: 6,
    marginBottom: 16
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18
  },
  emptyText: {
    color: colors.textSoft
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: '700',
    fontSize: 12
  },
  amount: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: '800'
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  itemName: {
    color: colors.text,
    fontWeight: '600'
  },
  itemPrice: {
    color: colors.text
  },
  line: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 6
  },
  metaText: {
    color: colors.textSoft
  }
});
