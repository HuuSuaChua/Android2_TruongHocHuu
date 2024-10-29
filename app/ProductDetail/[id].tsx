import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, Alert, Pressable, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useDispatch } from 'react-redux';
import { supabase } from '@/utils/supabase';
import { addToCart } from '@/store/cartSlice'; // Đảm bảo đường dẫn đúng tới slice giỏ hàng
import AntDesign from '@expo/vector-icons/AntDesign';
import ProductItem from '@/components/ProductItem';
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";

interface Product {
  id: number;
  name: string;
  img: string;
  price: number;
  detail: string;
  rating: number;
}

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        let { data: product, error } = await supabase
          .from('Product')
          .select('*')
          .eq('id', id)
          .single();
          let { data: product1, error:m } = await supabase
          .from('Product')
          .select('*')
          .eq('category_id',product.category_id)
          .neq('id',id);
        if (error) {
          console.error('Error fetching product:', error.message);
          return;
        }
        setProducts(product1)
        setProduct(product);
      } catch (error) {
        console.error('Error fetching product:', (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const addToCartHandler = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
      Alert.alert('Success', `Added ${quantity} of ${product.name} to the cart`);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200EE" />;
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>No product found.</Text>
      </View>
    );
  }
 
  const handlePress = (productId: number) => {
    router.push(`/ProductDetail/${productId}`);
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.nav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={{ paddingTop: 5, color: "white" }}>Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        <Image source={{ uri: product.img }} style={styles.productImage} />
        <Text style={styles.productPrice}>{product.price.toLocaleString("vi-VN")}₫</Text>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.detail}</Text>
        <View style={styles.rating}>
          <AntDesign name="star" size={24} color="orange" />   
          <Text style={styles.ratingProduct}>({product.rating})/5</Text>    
          </View>
          <View  style={{marginBottom:60}}>
            <Text style={{fontSize:20,fontWeight:'bold'}}>Sản phẩm liên quan</Text>
          <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      renderItem={({ item }) => (
        <ProductItem product={item} onPress={() => handlePress(item.id)} />
      )}
      showsHorizontalScrollIndicator={false}
    />
          </View>
          
      </ScrollView>

      <View style={styles.navbar}>
      <Pressable onPress={()=>router.push('/(tabs)')} >  
          <AntDesign name="home" size={24} color="black" style={{paddingLeft:5}}/>
          <Text>Home</Text>
      </Pressable>
      <Pressable onPress={()=>router.push('/(tabs)')} >  
          <AntDesign name="wechat" size={24} color="black" style={{paddingLeft:5}}/>  
          <Text>Chat</Text>
      </Pressable>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityNumber}>{quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToCartButton} onPress={addToCartHandler}>
          <Text style={styles.addToCartText}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  rating:{
    flexDirection:'row',
    marginLeft:10,
    alignSelf:'flex-start'
  },
  ratingProduct:{
    paddingTop:5,
  },
  container: {
    paddingTop: 60,
    flex: 1,
    padding: 20,
  },
  productImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 20,
    color: '#6200EE',
    marginTop: 30,
  },
  productDescription: {
    fontSize: 16,
    color: '#333',
    textAlign: 'justify',
  },
  navbar: {
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6200EE',
    borderRadius: 5,
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
  quantityText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  addToCartButton: {
    width:140,
    backgroundColor: '#6200EE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
