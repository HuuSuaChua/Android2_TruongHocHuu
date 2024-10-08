import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { supabase } from '@/utils/supabase';
import { RouteProp, useRoute } from '@react-navigation/native';
import ProductItem from '@/components/ProductItem';
import { router } from 'expo-router';

interface Product {
  id: number;
  name: string;
  description: string;
  img: string; // Đường dẫn đến ảnh sản phẩm
  price: number; // Giá sản phẩm
}

type SearchResultsRouteProp = RouteProp<{ SearchResults: { query: string } }, 'SearchResults'>;

const SearchResults: React.FC = () => {
  const route = useRoute<SearchResultsRouteProp>();
  const { query } = route.params; 
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchProducts = async () => {
      setLoading(true);
      try {
        const { data: products, error } = await supabase
          .from('Product')
          .select('*')
          .ilike('name', `%${query}%`); // Tìm kiếm không phân biệt chữ hoa thường

        if (error) throw error;
        setProducts(products);
      } catch (err: any) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7E57C2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noResultsText}>No products found for "{query}".</Text>
      </View>
    );
  }
  const handlePress = (productId: number) => {
    router.push(`/ProductDetail/${productId}`);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Kết quả tìm kiếm : {query}</Text>
    <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem product={item} onPress={() => handlePress(item.id)} /> 
        )}
        showsVerticalScrollIndicator={false}
      />
      </View>
  );
};

const styles = StyleSheet.create({
  container:{
    marginTop: 60,

  },
  text:{
    fontWeight: 'bold',
    fontSize: 26,
    
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  noResultsText: {
    fontSize: 18,
    color: '#333',
  },
  productContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'column',
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDescription: {
    color: '#666',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    color: '#7E57C2',
    fontWeight: 'bold',
  },
});

export default SearchResults;
