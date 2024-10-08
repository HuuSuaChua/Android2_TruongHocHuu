import React from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable ,Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '../../components/Slider';
import CategoryCarousel from '@/components/Category';
import ProductHot from '@/components/ProductHot';
import SearchBar from '@/components/SearchBar';
import { Link, useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const router = useRouter();
  const cart = useSelector((state: RootState) => state.cart.items);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/logo.jpg')}
          style={{width: 60, height:60,borderRadius:60,marginRight:10,}}
        />
        <SearchBar />
        <Pressable onPress={()=>router.push('/CartScreen')} style={styles.cartContainer}>
          <Icon name="cart-outline" size={30} color="white" style={styles.cartIcon} />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView}>
        <Slider />
        <CategoryCarousel />
        <ProductHot />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 130,
    marginTop:-50,
    paddingTop:50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    paddingRight:15,
  },
  cartContainer: {
    position: 'relative',
  },
  cartIcon: {
    padding: 5,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollView: {
    paddingHorizontal: 20,
  },
});
