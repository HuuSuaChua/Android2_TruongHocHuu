// screens/ProductDetail.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/utils/supabase'; // Ensure the correct path to your supabase client

// Define the type for product details
interface Product {
  id: number;
  name: string;
  img: string;
  price: number;
  detail: string;
}

export default function ProductDetail() {
  const { id } = useLocalSearchParams(); // Extract product ID from URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return; // Exit if no ID is provided

      try {
        let { data: product, error } = await supabase
          .from('Product') // Assuming your table is named 'Product'
          .select('*')
          .eq('id', id) // Filter by product ID
          .single(); // Fetch a single product

        if (error) {
          console.error('Error fetching product:', error.message);
          return;
        }

        setProduct(product);
      } catch (error) {
        console.error('Error fetching product:', (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.img }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      <Text style={styles.productDescription}>{product.detail}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
  productPrice: {
    fontSize: 20,
    color: '#6200EE',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: '#333',
  },
});
