import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Logout: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        'https://grokart-2.onrender.com/api/v1/shop/logout',

        {},
        {
          withCredentials: true,
        }
      );
       await AsyncStorage.removeItem('isLoggedIn');

      setLoading(false);
      Alert.alert('Success', response.data.message);

      // You can also navigate to login screen here if using navigation
      // navigation.replace('Login');
    } catch (error: any) {
      setLoading(false);
      const errMsg =
        error?.response?.data?.message || 'Something went wrong. Try again.';
      Alert.alert('Logout Failed', errMsg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828479.png',
          }}
          style={styles.logoutIcon}
        />
        <Text style={styles.title}>Are you sure you want to logout?</Text>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.logoutText}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Logout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  logoutIcon: {
    width: 90,
    height: 90,
    marginBottom: 20,
    tintColor: '#ef4444',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    elevation: 2,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
