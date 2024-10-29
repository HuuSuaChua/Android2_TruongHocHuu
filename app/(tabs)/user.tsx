import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Modal, TouchableOpacity, FlatList, TextInput,Image } from 'react-native';
import { supabase } from './../../utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface User {
  id: number;
  name: string;
  age: number;
  role: string;
  username: string;
  avatar?: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Edit form states
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const avatarOptions = ['face', 'star', 'favorite', 'pets', 'mood'];

  const fetchUserId = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (userId) {
      setCurrentUserId(Number(userId));
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        await fetchUserId();
        if (currentUserId) {
          const { data, error } = await supabase
            .from('User')
            .select('*')
            .eq('id', currentUserId)
            .single();
          if (error) {
            console.error('Error fetching user data:', error.message);
            return;
          }
          setUser(data);
          setName(data.name);
          setAge(data.age.toString());
          setUsername(data.username);
          setSelectedAvatar(data.avatar || null);
        }
      } catch (error) {
        console.error('Error fetching user:', (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [currentUserId]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userId');
    router.push('/login');
  };

  const handleAvatarSelect = async (icon: string) => {
    setSelectedAvatar(icon);
    setAvatarModalVisible(false);
    if (user) {
      await supabase.from('User').update({ avatar: icon }).eq('id', user.id);
    }
  };

  const handleSaveChanges = async () => {
    if (user) {
      const updatedData = {
        name,
        age: parseInt(age, 10),
        username,
      };
      const { error } = await supabase
        .from('User')
        .update(updatedData)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user data:', error.message);
      } else {
        setUser((prevUser) => (prevUser ? { ...prevUser, ...updatedData } : null));
        setEditModalVisible(false);
      }
    }
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

  return (
    <View style={styles.container}>
      <Image
          source={require('@/assets/images/hutaobgr.png')}
          style={{width: 'auto', height:200,borderRadius:50,marginRight:10,}}
        />
      <TouchableOpacity onPress={() => setAvatarModalVisible(true)} style={styles.avatarContainer}>
        {selectedAvatar ? (
          <Icon name={selectedAvatar} size={50} color="#6200EE" />
        ) : (
          <Text style={styles.selectAvatarText}>Avatar</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.detail}>Tên: {user.name}</Text>
      <Text style={styles.detail}>Tuổi: {user.age}</Text>
      <Text style={styles.detail}>Tên đăng nhập: {user.username}</Text>

      <Button title="Chỉnh sửa thông tin" onPress={() => setEditModalVisible(true)} color="#6200EE" />
      <Button title="Đăng xuất" onPress={handleLogout} color="#6200EE" />

      {/* Avatar Selection Modal */}
      <Modal visible={avatarModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Chọn avatar</Text>
          <FlatList
            data={avatarOptions}
            keyExtractor={(item) => item}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleAvatarSelect(item)} style={styles.iconButton}>
                <Icon name={item} size={40} color="#6200EE" />
              </TouchableOpacity>
            )}
          />
          <Button title="Close" onPress={() => setAvatarModalVisible(false)} color="#6200EE" />
        </View>
      </Modal>
      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Chỉnh sửa thông tin</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <Button title="Cập nhật" onPress={handleSaveChanges} color="#6200EE" />
          <Button title="Thoát" onPress={() => setEditModalVisible(false)} color="#6200EE" />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding:20,
    flex: 1,
    justifyContent: 'center',
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  selectAvatarText: {
    fontSize: 16,
    color: '#6200EE',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
    marginTop: 50,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  iconButton: {
    margin: 10,
    alignItems: 'center',
  },
});
