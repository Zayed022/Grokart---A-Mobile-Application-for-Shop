import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !address) {
      return Alert.alert("Validation Error", "Please fill all fields.");
    }

    try {
      setLoading(true);
      const res = await axios.post("https://grokart-2.onrender.com/api/v1/shop/register", {
        name,
        email,
        phone,
        password,
        address,
      });

      if (res.data.success) {
        Alert.alert("Success", res.data.message);
        navigation.navigate("Login"); // Navigate to Login screen
      } else {
        Alert.alert("Error", res.data.message || "Something went wrong.");
      }
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register Your Shop</Text>

      <TextInput
        placeholder="Shop Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Email Address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        placeholder="Shop Address"
        style={[styles.input, styles.addressInput]}
        value={address}
        onChangeText={setAddress}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      {/* Login navigation */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already registered?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}> Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f2f4f7",
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 30,
    color: "#222",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  addressInput: {
    textAlignVertical: "top",
    height: 90,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  loginText: {
    fontSize: 16,
    color: "#444",
  },
  loginLink: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007bff",
  },
});
