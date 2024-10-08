// components/Slider.tsx

import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import { supabase } from '@/utils/supabase';

// Định nghĩa kiểu dữ liệu cho slide
interface Slide {
  id: number;
  title: string;
  img: string;
}

export default function Slider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        let { data: slides, error } = await supabase
          .from('Slide')
          .select('*');

        if (error) {
          console.error('Error fetching slides:', error.message);
          return;
        }

        if (slides) {
          setSlides(slides);
        }
      } catch (error) {
        console.error('Error fetching slides:', (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  if (loading) {
    return <Text>Loading slides...</Text>;
  }

  return (
    <View style={styles.swiperContainer}>
      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        loop={true}
        autoplay={true}
        autoplayTimeout={5}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <Image source={{ uri: slide.img }} style={styles.slideImage} />
            <Text style={styles.slideTitle}>{slide.title}</Text>
          </View>
        ))}
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  swiperContainer: {
    marginTop: 20,
    marginBottom: 20,
    height: 200,
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: 400,
    height: 200,
    borderRadius: 8,
  },
  slideTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
