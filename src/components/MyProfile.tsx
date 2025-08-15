import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar';
import Icon from 'react-native-vector-icons/Ionicons';

const MyProfile = () => {
  const navigation = useNavigation();
  const phoneNumber = '+917498881947';
  const emailAddress = 'grokart.co@gmail.com';

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => navigation.navigate('Login') },
    ]);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() =>
      Alert.alert('Error', 'Could not open dialer')
    );
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${emailAddress}`).catch(() =>
      Alert.alert('Error', 'Could not open email app')
    );
  };

  return (
    <>
      <Navbar />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Icon name="person-circle-outline" size={72} color="#4F46E5" />
          <Text style={styles.heading}>Welcome, Delivery Partner</Text>
          <Text style={styles.subtext}>Manage your profile and orders</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <MenuItem
            icon="person-outline"
            label="View My Details"
            onPress={() => navigation.navigate('My Details')}
          />

          <MenuItem
            icon="create-outline"
            label="Update My Details"
            onPress={() => navigation.navigate('Update Details')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orders & Earnings</Text>

          <MenuItem
            icon="checkmark-done-outline"
            label="Completed Orders"
            onPress={() => navigation.navigate('My Orders')}
          />

          <MenuItem
            icon="wallet-outline"
            label="View My Earnings"
            onPress={() => navigation.navigate('My Earnings')}
          />

          <MenuItem
            icon="cash-outline"
            label="Payment to be Done"
            onPress={() => navigation.navigate('Daily Collection')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.supportButton} onPress={handleCall}>
            <Icon name="call-outline" size={22} color="#28a745" />
            <Text style={styles.supportText}>Call Us: {phoneNumber}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportButton} onPress={handleEmail}>
            <Icon name="mail-outline" size={22} color="#007aff" />
            <Text style={styles.supportText}>Email: {emailAddress}</Text>
          </TouchableOpacity>
        </View>

         <TouchableOpacity
  style={styles.logoutButton}
  onPress={() => navigation.navigate('Login')}
>
  <Icon name="log-out-outline" size={20} color="#EF4444" />
  <Text style={styles.logoutText}>Login</Text>
</TouchableOpacity>

       <TouchableOpacity
  style={styles.logoutButton}
  onPress={() => navigation.navigate('Logout')}
>
  <Icon name="log-out-outline" size={20} color="#EF4444" />
  <Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>

      </ScrollView>
    </>
  );
};

const MenuItem = ({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.85}>
    <Icon name={icon} size={24} color="#4F46E5" style={styles.menuIcon} />
    <Text style={styles.menuText}>{label}</Text>
    <Icon name="chevron-forward" size={24} color="#9CA3AF" />
  </TouchableOpacity>
);

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 24,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  supportText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 24,
  },
  logoutText: {
    color: '#B91C1C',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
