import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "@/store/cartSlice";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function CartScreen() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <TouchableOpacity onPress={() => toggleSelectItem(item.product.id)}>
        <View style={[styles.checkbox, selectedItems.includes(item.product.id) && styles.checked]} />
      </TouchableOpacity>
      <Image source={{ uri: item.product.img }} style={styles.productImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.productPrice}>
          {item.product.price.toLocaleString("vi-VN")}₫
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => dispatch(decreaseQuantity(item.product.id))}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.productQuantity}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => dispatch(increaseQuantity(item.product.id))}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: 50 }}>
          <TouchableOpacity
            onPress={() => dispatch(removeFromCart(item.product.id))}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const getTotalPrice = () => {
    return selectedItems.reduce((total, id) => {
      const cartItem = cart.find(item => item.product.id === id);
      return total + (cartItem ? cartItem.product.price * cartItem.quantity : 0);
    }, 0).toLocaleString("vi-VN");
  };

  const handleCheckout = () => {
    const selectedCartItems = cart.filter(item => selectedItems.includes(item.product.id));
    if (selectedCartItems.length > 0) {
      router.push({
        pathname: "/CheckoutScreen",
        params: {
          cartItems: JSON.stringify(selectedCartItems),
          totalPrice: getTotalPrice(),
        },
      });
    } else {
      Alert.alert("Thông báo", "Bạn chưa chọn sản phẩm nào để thanh toán.");
      
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={{ paddingTop: 5, color: "white" }}>Back</Text>
        </TouchableOpacity>
      </View>
      {cart.length > 0 ? (
        <>
          <FlatList
            data={cart}
            renderItem={renderItem}
            keyExtractor={(item) => item.product.id.toString()}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Tổng cộng: {getTotalPrice()}₫
            </Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.emptyText}>Giỏ hàng của bạn trống.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 25,
  },
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
  cartItem: {
    paddingHorizontal: 20,
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
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    color: "#6200EE",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: "#6200EE",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  productQuantity: {
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: "#ff4d4d",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  totalContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  checkoutButton: {
    marginTop: 10,
    backgroundColor: "#6200EE",
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginTop: 50,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#6200EE",
    marginRight: 10,
  },
  checked: {
    backgroundColor: "#6200EE",
  },
});
