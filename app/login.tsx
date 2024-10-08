import { ImageBackground, Image, StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const { data: users, error } = await supabase
        .from('User')
        .select('*')
        .eq('username', username) // Lọc theo username
        .eq('password', password); // Lọc theo password

      if (error) {
        console.error('Error fetching users:', error.message);
        Alert.alert('Login failed', 'An error occurred while logging in');
        return;
      }

      // Kiểm tra xem có người dùng nào phù hợp không
      if (users && users.length > 0) {
        const user = users[0];

        // Lưu userId vào AsyncStorage
        await AsyncStorage.setItem('userId', user.id.toString());

        // Điều hướng đến trang chính
        router.push('/(tabs)');
      } else {
        Alert.alert('Login failed', 'Incorrect username or password');
      }
    } catch (error) {
      console.error('Error during login:', (error as Error).message);
      Alert.alert('Login failed', 'An unexpected error occurred');
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/nen.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/logo.jpg')}
          style={styles.image}
        />
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link style={styles.footerLink} href={'/SignupScreen'}>Sign Up</Link>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Italic',
    fontSize: 52,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
  },
  footerLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 300,
  },
});
