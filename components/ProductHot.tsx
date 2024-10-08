import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';
import ProductItem from './ProductItem';

// Define the type for product props
interface Product {
  id: number;
  name: string;
  img: string;
  price: number;
  isHot: boolean;
}

export default function ProductHot() {
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHotProducts = async () => {
      try {
        let { data: products, error } = await supabase
          .from('Product')
          .select('*')
          .eq('isHot', true);

        if (error) {
          console.error('Error fetching hot products:', error.message);
          return;
        }

        if (products) {
          setHotProducts(products);
        }
      } catch (error) {
        console.error('Error fetching hot products:', (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotProducts();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#6200EE" />;
  }

  const handlePress = (productId: number) => {
    router.push(`/ProductDetail/${productId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hot Products</Text>
      <FlatList
        data={hotProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem product={item} onPress={() => handlePress(item.id)} />
        )}
        numColumns={2} 
        columnWrapperStyle={styles.row} 
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#6200EE',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
