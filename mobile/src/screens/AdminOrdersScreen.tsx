import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { api } from '../services/api';
import { Order } from '../types';
import { colors } from '../theme/colors';

const statuses: Array<Order['status']> = ['pending', 'preparing', 'delivered', 'cancelled'];

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders');
      const items = Array.isArray(response?.data?.items) ? response.data.items : [];
      setOrders(items);
    } catch (error: any) {
      setOrders([]);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to load orders');
    }
  };

  const updateStatus = async (orderId: string, status: Order['status']) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      Alert.alert('Success', 'Order status updated');
      loadOrders();
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to update status');
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Order Management</Text>
      <Text style={styles.subtitle}>Manage customer orders and statuses</Text>

      {orders.map((order) => (
        <View key={order._id} style={styles.card}>
          <Text style={styles.customer}>{order.user?.name || 'Unknown user'}</Text>
          <Text style={styles.meta}>{order.user?.email || '-'}</Text>
          <Text style={styles.meta}>Total: ${order.totalAmount.toFixed(2)}</Text>
          <Text style={styles.meta}>Current status: {order.status}</Text>

          <View style={styles.statusWrap}>
            {statuses.map((status) => (
              <Pressable
                key={status}
                onPress={() => updateStatus(order._id, status)}
                style={[
                  styles.statusButton,
                  order.status === status ? styles.statusButtonActive : null
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    order.status === status ? styles.statusTextActive : null
                  ]}
                >
                  {status}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12
  },
  customer: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16
  },
  meta: {
    color: colors.textSoft,
    marginTop: 4
  },
  statusWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12
  },
  statusButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  statusButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.card
  },
  statusText: {
    color: colors.text
  },
  statusTextActive: {
    color: colors.primaryDark,
    fontWeight: '700'
  }
});
