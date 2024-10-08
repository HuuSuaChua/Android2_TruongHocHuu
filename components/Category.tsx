// components/CategoryCarousel.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { supabase } from '@/utils/supabase';
import { Link, router } from 'expo-router';

// Định nghĩa kiểu dữ liệu cho category
interface Category {
  id: number;
  name: string;
  img: string;
}

export default function CategoryCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let { data: categories, error } = await supabase
          .from('Category')
          .select('*');

        if (error) {
          console.error('Error fetching categories:', error.message);
          return;
        }

        if (categories) {
          setCategories(categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#6200EE" />;
  }

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      renderItem={({ item }) => (
        <Pressable onPress={()=> router.push(`/ProductCategory/${item.id}`)} style={styles.categoryItem}>
          <Image source={{ uri: item.img }} style={styles.categoryImage} />
          <Text style={styles.categoryName}>{item.name}</Text>
        </Pressable>
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  categoryName: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
