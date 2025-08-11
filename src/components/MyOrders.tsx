import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";

import axios from "axios";
import moment from "moment";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletedOrders = async () => {
    try {
      const response = await axios.get("https://grokart-2.onrender.com/api/v1/shop/served-orders", {
        withCredentials: true,
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching completed orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  const renderOrder = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Order ID:</Text>
          <Text style={styles.value}>{item._id.slice(-6).toUpperCase()}</Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Total:</Text>
          <Text style={styles.amount}>₹{item.totalAmount}</Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Payment:</Text>
          <Text style={[styles.status, item.paymentStatus === "Paid" ? styles.paid : styles.pending]}>
            {item.paymentStatus.toUpperCase()}
          </Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Method:</Text>
          <Text style={styles.value}>{item.paymentMethod.toUpperCase()}</Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Delivered At:</Text>
          <Text style={styles.value}>{moment(item.deliveredAt).format("DD MMM YYYY, h:mm A")}</Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.status, styles.delivered]}>{item.status}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3D8BFF" />
        <Text style={{ marginTop: 10, fontSize: 16 }}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Completed Orders</Text>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders have been delivered yet.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default MyOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f6f8fc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1A1A1A",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  status: {
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
    overflow: "hidden",
    textTransform: "uppercase",
  },
  paid: {
    backgroundColor: "#d4f4d2",
    color: "#1b8c1b",
  },
  pending: {
    backgroundColor: "#fde2e2",
    color: "#c62828",
  },
  delivered: {
    backgroundColor: "#e2f0ff",
    color: "#2979ff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    marginTop: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});
