import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "../components/Register";
import Login from "../components/Login";
import Logout from "../components/Logout";
import GetAssignedOrders from "../components/GetAssignedOrders";
import MyOrders from "../components/MyOrders";
import MyProfile from "../components/MyProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={GetAssignedOrders} />
          <Stack.Screen name="Logout" component={Logout} />
          <Stack.Screen name="My Orders" component={MyOrders} />
          <Stack.Screen name="My Profile" component={MyProfile} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
