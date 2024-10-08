import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface SearchBarProps {
  onSearch?: (query: string) => void; // Optional search handler in case you want to handle search outside this component
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      // Gọi hàm onSearch từ props nếu có
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        navigation.navigate('SearchResults', { query: searchQuery });
      }
      Keyboard.dismiss(); // Ẩn bàn phím
    }
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        placeholderTextColor="#fff"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch} // Trigger search on enter
      />
      <Pressable onPress={handleSearch}>
        <Icon name="search-outline" size={25} color="white" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#7E57C2',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: 'white',
  },
});

export default SearchBar;
