import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { supabase } from './../../utils/supabase'; // Đường dẫn đến Supabase client
import ProductItem from '@/components/ProductItem';
import { router } from 'expo-router';

// Khai báo kiểu dữ liệu cho sản phẩm
interface Product {
  id: number;
  name: string;
  img: string;
  detail: string;
  price: number; // Thêm trường price
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Gọi API Supabase để lấy danh sách sản phẩm từ bảng Product
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('Product')
          .select('id, name, img, detail, price'); // Thêm 'price' vào select
        
        if (error) {
          console.error('Error fetching products:', error.message);
          return;
        }

        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading products...</Text>
      </View>
    );
  }
  const handlePress = (productId: number) => {
    router.push(`/ProductDetail/${productId}`); 
  };
  // Hiển thị danh sách sản phẩm
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product List</Text>
      <FlatList
      style={{marginBottom:10}}
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem product={item} onPress={() => handlePress(item.id)} /> 
        )}
        showsVerticalScrollIndicator={false}
      />
      </View>

  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productContainer: {
    marginBottom: 15,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f00',
  },
});
