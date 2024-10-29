import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from './../../utils/supabase';
import ProductItem from '@/components/ProductItem';
import { router } from 'expo-router';

// Define the product type
interface Product {
  id: number;
  name: string;
  img: string;
  detail: string;
  price: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('Product')
          .select('id, name, img, detail, price');
        
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

  const handlePress = (productId: number) => {
    router.push(`/ProductDetail/${productId}`); 
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product List</Text>
      <FlatList
        data={products}
        numColumns={2} // Display items in 2 columns
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem product={item} onPress={() => handlePress(item.id)} />
        )}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between', // Space between columns
  },
  listContent: {
    paddingBottom: 20,
  },
});

export const productItemStyles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    color: '#f00',
    fontWeight: 'bold',
    marginTop: 4,
  },
});
