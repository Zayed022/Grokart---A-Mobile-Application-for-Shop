// DeliveryPartnerNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native';
import Grokart from "../assets/images/Grokart.png";
import { useNavigation } from '@react-navigation/native';


const Tab = createBottomTabNavigator();

const Navbar = () => {
  const navigation = useNavigation();
  return (
    <>
    <View style={styles.navbar}>
            <Image source={Grokart} style={{ width: 100, height: 30 }} />
           
            
    
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate("My Profile")}
            >
              <Text style={styles.profileButtonText}>My Profile</Text>
            </TouchableOpacity>
          </View>

          
          </>

          
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    elevation: 4,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4F46E5",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  profileButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  profileButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})