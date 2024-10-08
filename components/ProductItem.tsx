import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Colors } from '@/constants/Colors';
// Define the type for product props
interface Product {
  id: number;
  name: string;
  img: string;
  detail: string; 
  price: number;
  rating: number;
}

interface ProductItemProps {
  product: Product;
  onPress: () => void;
}

export default function ProductItem({ product, onPress }: ProductItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: product.img }} style={styles.productImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <View style={styles.rating}>
          <AntDesign name="star" size={24} color="orange" />   
          <Text style={styles.ratingProduct}>({product.rating})</Text>    
          </View>
          <View style={styles.rating}>
            <FontAwesome5 name="truck-moving" size={24} color={Colors.primary} /><Text style={{paddingTop:5,fontFamily:"Italic"}}> Free ship 8%</Text>
          </View>
          
        <Text style={styles.productPrice}>{product?.price?.toLocaleString("vi-VN")}₫</Text>
      </View>
    </TouchableOpacity>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    marginBottom:10,
    marginHorizontal: 5,
    elevation: 3, // Android shadow effect
    shadowColor: '#000', // iOS shadow effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  rating:{
    flexDirection:'row',
    marginLeft:10,
    alignSelf:'flex-start'
  },
  ratingProduct:{
    paddingTop:5,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  infoContainer: {
    alignItems: 'center',
  },
  productName: {
    padding:20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  productDetail: {
    fontSize: 12,
    color: '#666', // Màu sắc nhẹ hơn cho phần mô tả
    marginBottom: 5,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: '#6200EE',
  },
  
});
