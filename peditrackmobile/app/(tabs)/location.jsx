import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { useGlobalContext } from '../../context/GlobalProvider';
import { icons, images } from '../../constants';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';
import MainHeader from '../../components/MainHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import GoogleMapView from '../location/GoogleMapView';
import * as Location from 'expo-location';
import { UserLocationContext } from '../../context/UserLocationContext';
import GlobalAPI from '../../services/GlobalAPI';
import CategoryList from '../location/CategoryList';
import LocationList from '../location/LocationList';

const LocationScreen = () => {
  const [selectedFacility, setSelectedFacility] = useState('hospital');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationList, setLocationList] = useState([]);
  const [placeList, setPlaceList] = useState([]);

  // New States for Search Functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocationList, setFilteredLocationList] = useState([]);

  // State to track the selected location for map centering
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        let userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);
      } catch (error) {
        console.log("Error getting location: ", error);
        setErrorMsg('Could not fetch location');
      }
    })();
  }, []);

  // Fetch places based on user location
  useEffect(() => {
    if (location) {
      const GetNearbySearchPlace = async (value) => {
        try {
          console.log("Location is available:", location.coords.latitude, location.coords.longitude);
          const resp = await GlobalAPI.nearByPlace(location.coords.latitude, location.coords.longitude, value);
          console.log("API Response:", resp);
          if (resp.data.status === "OK" && Array.isArray(resp.data.results)) {
            console.log("Google API Response:", resp.data.results);
            setLocationList(resp.data.results);
          } else {
            console.log("Google API Error:", resp.data.status);
            setLocationList([]);
          }
          const response = await GlobalAPI.searchByText(value).then((response) => {
            setPlaceList(response.data.results);
          });
        } catch (error) {
          console.log("Error fetching places:", error);
          setLocationList([]);
        }
      };

      GetNearbySearchPlace(selectedFacility);
    }
  }, [location, selectedFacility]);

  // Filter locationList based on searchQuery
  useEffect(() => {
    if (searchQuery) {
      const filtered = locationList.filter((place) => {
        const query = searchQuery.toLowerCase();
        const nameMatch = place.name.toLowerCase().includes(query);
        const vicinityMatch = place.vicinity.toLowerCase().includes(query);
        // Add more fields if needed (e.g., types, categories)
        return nameMatch || vicinityMatch;
      });
      setFilteredLocationList(filtered);
    } else {
      setFilteredLocationList(locationList);
    }
  }, [searchQuery, locationList]);

  // Handle selection of a location
  const onSelectLocation = (place) => {
    setSelectedLocation(place);
  };

  // Function to clear search query
  const clearSearch = () => {
    setSearchQuery('');  // Reset the search input when the modal closes
  };

  // Render error message if it exists
  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!location) {
    return <Text>Loading location...</Text>;
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        {/* Header */}
        <MainHeader title="Nearest Health Facilities"/>
        <UserLocationContext.Provider value={{location, setLocation}}>
          {/* Search Bar */}
          <View style={styles.searchSection}>
            <Icon name="search" size={20} color="black" style={styles.searchIcon}/>
            <TextInput 
              placeholder='Search for a Health Facility' 
              placeholderTextColor="gray" 
              style={styles.input}
              onChangeText={(value) => setSearchQuery(value)}
              value={searchQuery}
            />
          </View>

          {/* Map Title */}
          <Text style={styles.mapTitle}>Nearest Health Facilities Map</Text>

          {/* Category List */}
          <CategoryList setSelectedCategory={setSelectedFacility}/>

          {/* Google Map View */}
          <GoogleMapView locationList={locationList} selectedLocation={selectedLocation}/>

          {/* Location List */}
          {Array.isArray(filteredLocationList) && filteredLocationList.length > 0 ? (
            <LocationList locationList={filteredLocationList} 
            onSelect={onSelectLocation} 
            onModalClose={clearSearch} 
            />
          ) : (
            <Text>No locations found.</Text>
          )}
        </UserLocationContext.Provider>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 0, // to align with the icon
    paddingRight: 10,
    color: '#424242',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: '#6D31ED',
    height: 40,
    margin: 10,
  },
  searchIcon: {
    padding: 10,
  },
  facilityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 1,
    alignItems: 'center',
  },
  selectedButton: {
    color: '#6D31ED', // Highlighted button color (e.g., purple)
  },
  buttonText: {
    color: '#3D3D4D',
    fontWeight: 'bold',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
  }
});

export default LocationScreen;
