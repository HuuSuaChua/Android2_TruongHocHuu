import { Image, ImageBackground, StyleSheet, View, Text, TextInput, Alert, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import React, { useRef, useState } from 'react';
import { Link, router } from 'expo-router';
import { supabase } from '@/utils/supabase';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOTPScreenVisible, setIsOTPScreenVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [loadOtp, setLoadOtp] = useState(false); // Loading state
  const handleOTPSubmit = async () => {
    setLoadOtp(true);
    if (otp.join("") === hardcodedOTP) {
      setLoadOtp(false);
      Alert.alert("Thành công", "Xác thực tài khoản thành công!");
      setIsOTPScreenVisible(false);
      router.replace("/login");
    } else {
      setLoadOtp(false);
      Alert.alert("Lỗi", "Mã OTP không hợp lệ vui lòng thử lại!");
    }
  };

  
  const handleOTPChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value.length === 1 && index < otpInputRefs.length - 1) {
      otpInputRefs[index + 1].current.focus();
    }

    if (value.length === 0 && index > 0) {
      otpInputRefs[index - 1].current.focus();
    }
  };
  const hardcodedOTP = "2004";
  const hanldeClose = () => {
    setIsOTPScreenVisible(false);
  };
  const handleSignUp = async () => {
    setLoading(true);
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      setLoading(false);
      return;
    }

    // Tạo người dùng mới trong bảng "User"
    try {
      const { data, error } = await supabase
        .from('User')
        .insert([{ username, password,name }])
        .select();
      
      if (error) {
        Alert.alert('Lỗi', 'Không thể đăng ký. Vui lòng thử lại.');
        setLoading(false);
        return;
      }

setIsOTPScreenVisible(true)    } catch (error) {
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
      <Modal visible={isOTPScreenVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={hanldeClose} style={{ alignSelf: "flex-start", marginBottom: 10 }}>
            <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: "green", marginBottom: 5 }]}>Đăng kí tài khoản thành công! </Text>
            <Text style={styles.modalTitle}>Vui lòng nhập mã OTP được gửi về số điện thoại để xác thực tài khoản</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  ref={otpInputRefs[index]}
                  value={digit}
                  onChangeText={(value) => handleOTPChange(index, value)}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.otpButton} disabled={loadOtp ? true : false} onPress={handleOTPSubmit}>
              {loadOtp ? <ActivityIndicator size="large" color="white" /> : <Text style={styles.buttonText}>Gửi</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image
            source={require('@/assets/images/logo.jpg')}
            style={styles.logo}
          />
          <Text style={styles.title}>Đăng ký</Text>
          
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Tên"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Tên đăng nhập"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Mật khẩu"
            secureTextEntry
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Đang xử lý...' : 'Đăng ký'}</Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Bạn đã có tài khoản? </Text>
            <TouchableOpacity>
              <Link style={styles.footerLink} href={'/login'}>Đăng nhập</Link>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 10,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
  },
  otpButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
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
    color: 'white',
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
