import { Modal, View, Text, Pressable, StyleSheet, Image } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";
import { TextInput } from "react-native";
import { FlatList } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
export default function AddressMap({ isVisible, children, onClose, setLocationParent }) {
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [debouncedQuery, setDebouncedQuery] = useState(""); // State để debounce

  const handleUseaddress = () => {
    setLocationParent(selectedAddress);
    onClose();
  };
  const getCurrentLocation = async () => {
    let currentLocation = await Location.getCurrentPositionAsync({});
    const address = await getAddressFromCoordinates(currentLocation.coords.latitude, currentLocation.coords.longitude);
console.log(address,"k");
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    });
    setSelectedAddress(address);
  };

  useEffect(() => {
    (async () => {
      let currentLocation = await Location.getCurrentPositionAsync({});
      console.log(currentLocation)
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
      setSelectedAddress(await getAddressFromCoordinates(currentLocation.coords.latitude, currentLocation.coords.longitude));
    })();
  }, [isVisible]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000); // 1 giây

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);
  // Hàm tìm kiếm địa chỉ với Nominatim API
  const searchAddress = async (query) => {
    if (!query) return;

    // Giới hạn kết quả chỉ ở Việt Nam
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=vn`;
    console.log(url);
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm địa chỉ: ", error);
    }
  };

  // Khi chọn địa chỉ từ kết quả tìm kiếm
  const onSelectAddress = (item) => {
    const latitude = parseFloat(item.lat);
    const longitude = parseFloat(item.lon);

    console.log("Selected latitude: ", latitude, "Selected longitude: ", longitude); // Thêm dòng này để kiểm tra

    setLocation({latitude,
        longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
  
      setSelectedAddress(item.display_name);
      setSearchResults([]);
      setSearchQuery("");
    };
    const getAddressFromCoordinates = async (latitude, longitude) => {
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
  
      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        return address.formattedAddress;
      }
      return "Không thể xác định vị trí";
    };
    return (
      <>
        <Modal animationType="slide" transparent={true} visible={isVisible}>
          <View style={styles.modalContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Địa chỉ</Text>
              <TouchableOpacity onPress={onClose} style={{ width: 30, height: 30, justifyContent: "center" }}>
                <MaterialIcons name="close" color="#fff" size={22} />
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
              {/* Input tìm kiếm địa chỉ */}
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm địa chỉ"
                value={searchQuery}
                onChangeText={setSearchQuery} // Chỉ cần đặt giá trị
              />
  
              {/* Hiển thị kết quả tìm kiếm */}
              {searchResults.length > 0 && (
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.place_id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => onSelectAddress(item)}>
                      <View style={styles.searchResultItem}>
                        <Text>{item.display_name}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  style={styles.searchResultsList}
                />
              )}
  
              {/* MapView sử dụng OSM */}
              {location ? (
                <MapView
                  provider={PROVIDER_DEFAULT}
                  style={styles.map}
                  initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }}
                  region={location}
                  onPress={async (e) => {
                    const { latitude, longitude } = e.nativeEvent.coordinate;
                    setLocation({
                      ...location,
                      latitude,
                      longitude,
                    });
                    setSelectedAddress(await getAddressFromCoordinates(latitude, longitude));
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}
                  /></MapView>
                ) : (
                  <Text>Đang tải vị trí...</Text>
                )}
    
                {/* Hiển thị địa chỉ đã chọn */}
                <View style={styles.addressContainer}>{selectedAddress ? <Text>Địa chỉ đã chọn: {selectedAddress}</Text> : <Text>Chưa chọn địa chỉ nào</Text>}</View>
                <TouchableOpacity style={styles.buttonApdung} onPress={handleUseaddress}>
                  <Text style={{ textAlign: "center" }}>Sử dụng địa chỉ này</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={getCurrentLocation} style={styles.buttonGetcurrent}>
                  <FontAwesome6 name="location-crosshairs" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      );
    }
    const styles = StyleSheet.create({
      modalContent: {
        height: "100%",
        width: "100%",
        backgroundColor: "#25292e",
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        position: "absolute",
        bottom: 0,
      },
      titleContainer: {
        height: 200,
        backgroundColor: "#464C55",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      title: {
        color: "#fff",
        fontSize: 16,
      },
      methodsContainer: {
        padding: 20,
      },
      container: {
        flex: 1,
      },
      map: {
        flex: 1,
      },
      addressContainer: {
        position: "absolute",
        bottom: 70,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 8,
        width: "90%",
        alignSelf: "center",
        elevation: 5,
      },
      buttonApdung: {
        position: "absolute",
        bottom: 10,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 8,
        height: 50,
        width: "90%",
        alignSelf: "center",
        elevation: 5,
      },
      buttonGetcurrent: {
        position: "absolute",
        top: 65,
        left: 20,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 8,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
    
        width: 50,
        alignSelf: "left",
        elevation: 5,
      },
      searchInput: {
        position: "absolute",
        top: 10,
        zIndex: 1,
        backgroundColor: "white",
        width: "90%",
        padding: 10,
        borderRadius: 8,
        alignSelf: "center",
        elevation: 5,
      },
      searchResultsList: {
        position: "absolute",
        top: 60,
        width: "90%",
        alignSelf: "center",
        backgroundColor: "white",
        zIndex: 1,
        elevation: 5,
      },
      searchResultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
      },
    });