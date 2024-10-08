import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase'; 
import ProductItem from '@/components/ProductItem';

// Định nghĩa kiểu dữ liệu cho product và category
interface Product {
  id: number;
  name: string;
  img: string;
  price: number;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductCategory() {
  const { id } = useLocalSearchParams(); // Lấy category ID từ URL
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null); // Lưu thông tin danh mục
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const numColumns = 2; // Đặt số cột là 2
  
  // Lấy sản phẩm thuộc danh mục
  useEffect(() => {
    const fetchProducts = async () => {
      if (!id) return; // Thoát nếu không có ID

      try {
        // Truy vấn sản phẩm theo category_id
        const { data: products, error: productError } = await supabase
          .from('Product')
          .select('*')
          .eq('category_id', id);

        if (productError) {
          console.error('Error fetching products:', productError.message);
          return;
        }

        if (products) {
          setProducts(products);
        }
      } catch (error) {
        console.error('Error fetching products:', (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  // Lấy tên danh mục theo id
  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return; // Thoát nếu không có ID

      try {
        // Truy vấn danh mục theo id
        const { data: category, error: categoryError } = await supabase
          .from('Category') // Giả sử bảng của bạn là 'Category'
          .select('id, name')
          .eq('id', id)
          .single(); // single() để lấy 1 kết quả

        if (categoryError) {
          console.error('Error fetching category:', categoryError.message);
          return;
        }

        if (category) {
          setCategory(category);
        }
      } catch (error) {
        console.error('Error fetching category:', (error as Error).message);
      }
    };

    fetchCategory();
  }, [id]);

  // Xử lý khi nhấn vào sản phẩm
  const handlePress = (productId: number) => {
    router.push(`/ProductDetail/${productId}`); // Điều hướng đến trang chi tiết sản phẩm
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200EE" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {category ? `Sản phẩm trong ${category.name}` : 'Sản phẩm trong danh mục'}
      </Text>
      <FlatList
        data={products}
        key={numColumns.toString()} // Thay đổi key để buộc FlatList render lại
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem product={item} onPress={() => handlePress(item.id)} /> 
        )}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}  // Đặt số cột cố định là 2
        columnWrapperStyle={styles.row} // Thêm style để chỉnh khoảng cách giữa các cột
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    marginTop: 20,
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    justifyContent: 'space-between', // Giãn đều các cột
  },
});
