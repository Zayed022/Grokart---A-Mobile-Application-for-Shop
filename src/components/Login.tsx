import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
const Login: React.FC = () => {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Please enter all fields');
    }

    try {
      setLoading(true);

      const response = await axios.post('https://grokart-2.onrender.com/api/v1/shop/login', {
        email,
        password,
      }, {
        withCredentials: true,
      });

      setLoading(false);
const { token, user, message } = response.data;

if (token) {
  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("userId", user._id);
  await AsyncStorage.setItem("user", JSON.stringify(user));
  Alert.alert('Success', message);
  navigation.reset({ index: 0, routes: [{ name: "Home" }] });
}

      Alert.alert('Success', response.data.message);


      // ✅ Redirect to Home screen
      navigation.navigate('Home');

    } catch (error: any) {
      setLoading(false);
      const errMsg =
        error?.response?.data?.message || 'Something went wrong. Try again.';
      Alert.alert('Login Failed', errMsg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shop Login</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="shop@example.com"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="••••••••"
            style={styles.inputPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Text style={styles.eyeIconText}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>New to GroKart?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}> Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 22,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    fontSize: 16,
    color: '#111827',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    paddingRight: 12,
  },
  inputPassword: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    color: '#111827',
  },
  eyeIcon: {
    paddingLeft: 8,
  },
  eyeIconText: {
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  registerText: {
    fontSize: 15,
    color: '#6b7280',
  },
  registerLink: {
    fontSize: 15,
    color: '#2563eb',
    fontWeight: '600',
  },
});
