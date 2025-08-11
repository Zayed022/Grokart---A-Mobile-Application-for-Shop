import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import axios from 'axios';
import Sound from 'react-native-sound';
import { Card } from 'react-native-paper';
import Navbar from './Navbar';

interface Product {
  name: string;
  quantity: number;
  description: string;
  price: number;
  isAvailable?: boolean;
  productId: string;
}

interface Order {
  _id: string;
  customerId: { name: string };
  items: Product[];
  status: string;
  createdAt: string;
  totalAmount: number;
}

let alarmSound: Sound | null = null;
let isAlarmPlaying = false;

const requestVibratePermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.VIBRATE,
        {
          title: 'Vibration Permission',
          message: 'This app requires vibration to alert you of new orders.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Vibrate permission request failed', err);
      return false;
    }
  }
  return true;
};

const triggerAlarm = async () => {
  const hasPermission = await requestVibratePermission();
  if (!hasPermission) {
    Alert.alert('Permission Denied', 'Vibrate permission is required to alert you.');
    return;
  }
  if (isAlarmPlaying) return;

  alarmSound = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load sound', error);
      return;
    }
    alarmSound.setNumberOfLoops(-1);
    alarmSound.play();
    isAlarmPlaying = true;
  });

  Vibration.vibrate([1000, 500, 1000, 500], true);
};

const stopAlarm = () => {
  alarmSound?.stop(() => {
    alarmSound?.release();
    isAlarmPlaying = false;
  });
  Vibration.cancel();
};

const GetAssignedOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prevOrderIds, setPrevOrderIds] = useState<string[]>([]);

const fetchOrders = async () => {
  try {
    setLoading(true);
    const { data } = await axios.get(
      'https://grokart-2.onrender.com/api/v1/shop/get-assigned-orders',
      { withCredentials: true }
    );

    // Always newest first
    // Always newest first — safe sort
const sortedOrders = [...data.data].sort((a: Order, b: Order) => {
  const dateA = new Date(a.createdAt).getTime();
  const dateB = new Date(b.createdAt).getTime();
  return dateB - dateA; // newest first
});


    const hasAssigned = sortedOrders.some(
      (o: Order) => o.status.trim().toLowerCase() === 'assigned'
    );

    const isNewAssignedOrder = sortedOrders.some(
      (o: Order) =>
        o.status.trim().toLowerCase() === 'assigned' &&
        !prevOrderIds.includes(o._id)
    );

    if (isNewAssignedOrder) {
      await triggerAlarm();
    }
    if (!hasAssigned) {
      stopAlarm();
    }

    setOrders(sortedOrders);
    setPrevOrderIds(sortedOrders.map((o: Order) => o._id));
  } catch (err) {
    console.error('Error fetching orders:', err);
    setError('Failed to fetch orders');
  } finally {
    setLoading(false);
  }
};


  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await axios.put(
        `https://grokart-2.onrender.com/api/v1/shop/${orderId}/status`,
        { status },
        { withCredentials: true }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } catch {
      setError('Failed to update order status');
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return { backgroundColor: '#22C55E', color: '#fff' };
      case 'pending':
        return { backgroundColor: '#FACC15', color: '#000' };
      case 'cancelled':
        return { backgroundColor: '#EF4444', color: '#fff' };
      case 'ready to collect':
        return { backgroundColor: '#3B82F6', color: '#fff' };
      default:
        return { backgroundColor: '#D1D5DB', color: '#1F2937' };
    }
  };

  const updateProductAvailability = async (
    orderId: string,
    productId: string,
    available: boolean
  ) => {
    try {
      await axios.put(
        `https://grokart-2.onrender.com/api/v1/shop/${orderId}/product-availability`,
        { productId, available },
        { withCredentials: true }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                items: order.items.map((item) =>
                  item.productId === productId
                    ? { ...item, isAvailable: available }
                    : item
                ),
              }
            : order
        )
      );

      Alert.alert(
        'Success',
        `Marked product as ${available ? 'Available' : 'Unavailable'}`
      );
    } catch (err) {
      console.error('Failed to update product availability', err);
      Alert.alert('Error', 'Could not update product availability');
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => {
      clearInterval(interval);
      stopAlarm();
    };
  }, []);

  return (
    <>
      <Navbar />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📦 Assigned Orders</Text>
        {loading && <Text style={styles.status}>Loading...</Text>}
        {error && <Text style={styles.error}>{error}</Text>}
        {orders.length === 0 && !loading && (
          <Text style={styles.status}>No assigned orders</Text>
        )}

        {orders.map((order) => {
          const adjustedTotal = Math.max(order.totalAmount - 22, 0);
          return (
            <Card key={order._id} style={styles.card}>
              <Text style={styles.meta}>
                🕐 {new Date(order.createdAt).toLocaleString()}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusStyle(order.status).backgroundColor },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusStyle(order.status).color },
                  ]}
                >
                  {order.status}
                </Text>
              </View>

              {order.items.map((item, idx) => (
                <View key={idx} style={styles.productContainer}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productDetail}>📝 {item.description}</Text>
                  <Text style={styles.productDetail}>📦 Qty: {item.quantity}</Text>
                  <Text style={styles.productDetail}>💰 Price: ₹{item.price}</Text>

                  {item.isAvailable === true && (
                    <TouchableOpacity
                      style={[styles.availabilityButton, { backgroundColor: '#F44336' }]}
                      onPress={() =>
                        updateProductAvailability(order._id, item.productId, false)
                      }
                    >
                      <Text style={styles.availabilityText}>Mark as Unavailable</Text>
                    </TouchableOpacity>
                  )}

                  {item.isAvailable === false && (
                    <TouchableOpacity
                      style={[styles.availabilityButton, { backgroundColor: '#0fb644' }]}
                      onPress={() =>
                        updateProductAvailability(order._id, item.productId, true)
                      }
                    >
                      <Text style={styles.availabilityText}>Mark as Available</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <Text style={styles.totalAmount}>Total: ₹{adjustedTotal}</Text>

              {order.status.trim().toLowerCase() === 'assigned' && (
                <TouchableOpacity
                  onPress={() => handleStatusUpdate(order._id, 'Confirmed')}
                  style={styles.confirmButton}
                >
                  <Text style={styles.confirmButtonText}>Mark as Confirmed</Text>
                </TouchableOpacity>
              )}

              {order.status.trim().toLowerCase() === 'confirmed' && (
                <TouchableOpacity
                  onPress={() => handleStatusUpdate(order._id, 'Ready to Collect')}
                  style={styles.readyButton}
                >
                  <Text style={styles.confirmButtonText}>Mark as Ready to Collect</Text>
                </TouchableOpacity>
              )}
            </Card>
          );
        })}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    minHeight: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginVertical: 10,
  },
  error: {
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 12,
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  meta: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  productContainer: {
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 12,
    marginVertical: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  productDetail: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  availabilityButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  availabilityText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
  },
  confirmButton: {
    marginTop: 14,
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  readyButton: {
    marginTop: 14,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default GetAssignedOrders;
