import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { api } from '../services/api';
import { Order } from '../types';
import { colors } from '../theme/colors';

const statuses: Array<Order['status']> = ['pending', 'preparing', 'delivered', 'cancelled'];

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

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
          <Pressable
            onPress={() =>
              setExpandedOrderId((current) => (current === order._id ? null : order._id))
            }
          >
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.customer}>{order.user?.name || 'Unknown user'}</Text>
                <Text style={styles.meta}>{order.user?.email || '-'}</Text>
                <Text style={styles.meta}>Total: ${order.totalAmount.toFixed(2)}</Text>
                <Text style={styles.meta}>Current status: {order.status}</Text>
              </View>
              <Text style={styles.toggleText}>
                {expandedOrderId === order._id ? 'Hide details' : 'View details'}
              </Text>
            </View>
          </Pressable>

          {expandedOrderId === order._id ? (
            <View style={styles.detailWrap}>
              <Text style={styles.detailTitle}>Ordered Items</Text>
              {(Array.isArray(order.items) ? order.items : []).map((item, index) => (
                <View key={`${order._id}-${index}`} style={styles.itemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemMeta}>Size: {item.size}</Text>
                    <Text style={styles.itemMeta}>Quantity: {item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}

              <View style={styles.divider} />
              <Text style={styles.detailTitle}>Delivery Info</Text>
              <Text style={styles.itemMeta}>{order.shippingAddress.fullName}</Text>
              <Text style={styles.itemMeta}>{order.shippingAddress.phone}</Text>
              <Text style={styles.itemMeta}>
                {order.shippingAddress.street}, {order.shippingAddress.city}
              </Text>
              {order.shippingAddress.zipCode ? (
                <Text style={styles.itemMeta}>Zip code: {order.shippingAddress.zipCode}</Text>
              ) : null}
              <Text style={styles.itemMeta}>Payment: {order.paymentMethod}</Text>
            </View>
          ) : null}

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
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  customer: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16
  },
  toggleText: {
    color: colors.primaryDark,
    fontWeight: '700'
  },
  meta: {
    color: colors.textSoft,
    marginTop: 4
  },
  detailWrap: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  detailTitle: {
    color: colors.text,
    fontWeight: '800',
    marginBottom: 10
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10
  },
  itemName: {
    color: colors.text,
    fontWeight: '700'
  },
  itemMeta: {
    color: colors.textSoft,
    marginTop: 3
  },
  itemPrice: {
    color: colors.primaryDark,
    fontWeight: '700'
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12
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
