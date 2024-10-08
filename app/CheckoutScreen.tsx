import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Alert } from "react-native";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { supabase } from "@/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";

interface CartItem {
  product: {
    id: number;
    name: string;
    img: string;
    price: number;
  };
  quantity: number;
}

export default function CheckoutScreen() {
  const { cartItems, totalPrice } = useLocalSearchParams(); // Nhận params từ router
  const cart: CartItem[] = JSON.parse(cartItems as string); // Chuyển đổi chuỗi JSON về object

  const [paymentMethod, setPaymentMethod] = useState<string>("cash"); // Phương thức thanh toán
  const [shippingAddress, setShippingAddress] = useState<string>(""); // Địa chỉ giao hàng

  // Function để lưu thông tin chi tiết đơn hàng vào OrderDetail
  const insertOrderDetails = async (orderId: number) => {
    const orderDetails = cart.map((item) => ({
      order_id: orderId,
      product_id: item.product.id,
      qty: item.quantity,
      total: item.product.price,
    }));

    const { error } = await supabase
      .from("OrderDetail")
      .insert(orderDetails);

    if (error) {
      console.error("Error inserting order details:", error);
      throw new Error("Failed to insert order details");
    }
  };

  // Function để xác nhận đơn hàng
  const handleConfirmOrder = async () => {
    if (!shippingAddress) {
      alert("Vui lòng nhập địa chỉ giao hàng!");
      return;
    }

    try {
      // Thêm đơn hàng vào bảng Order
      const { data: orderData, error: orderError } = await supabase
        .from("Order")
        .insert([
          {
            user_id: Number(await AsyncStorage.getItem('userId')),
            total_price: Number(totalPrice),
            method_payment: paymentMethod,
            address: shippingAddress,
            status: "Đang giao hàng",
          },
        ])
        .select(); // Trả về thông tin đơn hàng vừa tạo

      if (orderError) {
        throw orderError;
      }

      const orderId = orderData[0].id; // Lấy ID của đơn hàng vừa tạo

      // Thêm chi tiết đơn hàng vào bảng OrderDetail
      await insertOrderDetails(orderId);

      Alert.alert("Đơn hàng đã được xác nhận!", `Phương thức thanh toán: ${paymentMethod}\nĐịa chỉ: ${shippingAddress}`);
      router.push('/CheckoutSuccess')
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi đặt hàng, vui lòng thử lại sau.");
      console.error("Error placing order: ", error);
    }
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.img }} style={styles.productImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.productQuantity}>Số lượng: {item.quantity}</Text>
        <Text style={styles.productPrice}>
          Giá: {item.product.price.toLocaleString("vi-VN")}₫
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={{ paddingTop: 5, color: "white" }}>Back</Text>
        </TouchableOpacity>
      </View>
      <View style={{padding:20}}>

      
      <Text style={styles.title}>Xác nhận đơn hàng</Text>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={(item) => item.product.id.toString()}
      />

      {/* Địa chỉ giao hàng */}
      <View style={styles.addressContainer}>
        <Text style={styles.label}>Địa chỉ giao hàng:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập địa chỉ của bạn"
          value={shippingAddress}
          onChangeText={setShippingAddress}
        />
      </View>

      {/* Phương thức thanh toán */}
      <View style={styles.paymentContainer}>
        <Text style={styles.label}>Chọn phương thức thanh toán:</Text>
        <View style={styles.paymentMethods}>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === "cash" && styles.selectedPaymentOption]}
            onPress={() => setPaymentMethod("cash")}
          >
            <Text style={[styles.paymentText, paymentMethod === "cash" && styles.colorWhite]}>Tiền mặt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === "card" && styles.selectedPaymentOption]}
            onPress={() => setPaymentMethod("card")}
          >
            <Text style={[styles.paymentText, paymentMethod === "card" && styles.colorWhite]}>Thẻ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === "wallet" && styles.selectedPaymentOption]}
            onPress={() => setPaymentMethod("wallet")}
          >
            <Text style={[styles.paymentText,paymentMethod === "wallet" && styles.selectedPaymentOption]}>Ví điện tử</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tổng giá và xác nhận đơn hàng */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng cộng: {totalPrice}₫</Text>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
          <Text style={styles.confirmText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    paddingTop: 40,
    backgroundColor: Colors.primary,
    width: "auto",
    height: 90,
  },
  navItem: {
    flexDirection: "row",
    paddingLeft: 20,
    paddingTop: 10,
  },
    colorWhite:{
        color: 'white',
    },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    marginLeft: 10,
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productQuantity: {
    fontSize: 16,
  },
  productPrice: {
    fontSize: 16,
    color: "#6200EE",
  },
  addressContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  paymentContainer: {
    marginTop: 20,
  },
  paymentMethods: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  selectedPaymentOption: {
    backgroundColor: "#6200EE",
    color:"white",
  },
  paymentText: {
    color: "#000",
  },
  totalContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: "#6200EE",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
