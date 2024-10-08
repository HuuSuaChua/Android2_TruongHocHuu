import { Image, ImageBackground, StyleSheet, View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Link, router } from 'expo-router';
import { supabase } from '@/utils/supabase';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    
    // Kiểm tra dữ liệu đầu vào
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      setLoading(false);
      return;
    }

    // Tạo người dùng mới trong bảng "User"
    try {
      const { data, error } = await supabase
        .from('User')
        .insert([{ username, password }])
        .select();
      
      if (error) {
        Alert.alert('Lỗi', 'Không thể đăng ký. Vui lòng thử lại.');
        setLoading(false);
        return;
      }

      Alert.alert('Thành công', 'Đăng ký thành công');
      router.push('/login'); // Điều hướng đến trang đăng nhập sau khi đăng ký thành công
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/nen.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image
            source={require('@/assets/images/logo.jpg')}
            style={styles.logo}
          />
          <Text style={styles.title}>Sign Up</Text>
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
          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Đang xử lý...' : 'Sign Up'}</Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity>
              <Link style={styles.footerLink} href={'/login'}>Login</Link>
            </TouchableOpacity>
          </View>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Italic',
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
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
    backgroundColor: '#9b7afc',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#333',
  },
  footerLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});
