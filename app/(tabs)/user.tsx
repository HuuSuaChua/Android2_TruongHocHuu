import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { supabase } from './../../utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface User {
  id: number;
  name: string;
  age: number;
  role: string;
  username: string;
}

export default function User() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const fetchUserId = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (userId) {
      setCurrentUserId(Number(userId)); // Lưu userId dưới dạng số
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); // Bắt đầu tải dữ liệu
      try {
        // Lấy userId từ AsyncStorage
        await fetchUserId();

        // Kiểm tra xem có userId hay không trước khi gọi API
        if (currentUserId) {
          const { data, error } = await supabase
            .from('User')
            .select('*')
            .eq('id', currentUserId) // Sử dụng userId để truy vấn dữ liệu
            .single();

          if (error) {
            console.error('Error fetching user data:', error.message);
            return;
          }

          setUser(data); // Đặt thông tin người dùng
        }
      } catch (error) {
        console.error('Error fetching user:', (error as Error).message);
      } finally {
        setLoading(false); // Kết thúc quá trình tải
      }
    };

    fetchUser();
  }, [currentUserId]); // Thêm currentUserId vào dependency array

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userId');
    router.push('/login');
   
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No user found.</Text>
      </View>
    );
  }

  // Kiểm tra xem ID đang đăng nhập có khớp với ID của user hay không
  if (user.id === currentUserId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>User Information</Text>
        <Text style={styles.detail}>Name: {user.name}</Text>
        <Text style={styles.detail}>Age: {user.age}</Text>
        <Text style={styles.detail}>Role: {user.role}</Text>
        <Text style={styles.detail}>Username: {user.username}</Text>
        <Button title="Logout" onPress={handleLogout} color="#6200EE" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.detail}>You do not have access to this information.</Text>
        <Button title="Logout" onPress={handleLogout} color="#6200EE" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
  },
});
