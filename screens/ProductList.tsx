// screens/ProductList.tsx

import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '@/utils/supabase'; // Chỉnh đường dẫn cho supabase nếu cần
import ProductItem from '@/components/ProductItem'; // Chỉnh đường dẫn nếu cần
import SearchBar from '@/components/SearchBar'; // Import SearchBar

interface Product {
  id: number;
  name: string;
  img: string;
  price: number;
  detail: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let { data: products, error } = await supabase
          .from('Product') // Assuming your table is named 'Product'
          .select('*');

        if (error) {
          console.error('Error fetching products:', error.message);
          return;
        }

        setProducts(products || []);
        setFilteredProducts(products || []); // Ban đầu hiển thị tất cả sản phẩm
      } catch (error) {
        console.error('Error fetching products:', (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (query: string) => {
    // Lọc sản phẩm theo tên dựa trên query
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200EE" />;
  }

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />

      {filteredProducts.length === 0 ? (
        <Text style={styles.noResultsText}>Không có sản phẩm nào phù hợp</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductItem
              product={item}
              onPress={() => {
                // Điều hướng đến chi tiết sản phẩm nếu cần
              }}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});
