import {React, useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useGlobalContext } from '../../context/GlobalProvider';
import { icons, images } from '../../constants';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';
import MainHeader from '../../components/MainHeader';
import Icon from 'react-native-vector-icons/Ionicons'
import GoogleMapView from '../location/GoogleMapView';
import * as Location from 'expo-location'
import { UserLocationContext } from '../../context/UserLocationContext';
import GlobalAPI from '../../services/GlobalAPI';
import CategoryList from '../location/CategoryList';
import LocationList from '../location/LocationList';

const location = () => {
  const [selectedFacility, setSelectedFacility] = useState('hospital');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationList, setLocationList] = useState([]);

  useEffect(() => {
    (async () => {
      try{
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }catch (error){
      console.log("Error getting location: ", error);
      setErrorMsg('Could not fetch location');
    }}
  )();
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
        } catch (error) {
          console.log("Error fetching places:", error);
          setLocationList([]);
        }
      };

      GetNearbySearchPlace(selectedFacility);
    }
  }, [location, selectedFacility]); // Add `location` as a dependency

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
        <UserLocationContext.Provider value={{location,setLocation}}>
      <View style={style.searchSection}>
        <Icon name="search" size={20} color="black" style={style.searchIcon}/>
        <TextInput 
        placeholder='Search for a Health Facility' 
        placeholderTextColor="gray" 
        style={style.input}>
        </TextInput>
      </View>
      <Text className="text-lg font-semibold text-black ml-3">Nearest Health Facilities Map</Text>
      <CategoryList setSelectedCategory={setSelectedFacility}/>
      <GoogleMapView locationList={locationList}/>
      {Array.isArray(locationList) && locationList.length > 0 ? (
        <LocationList locationList={locationList} />
        ) : (
       <Text>No locations found.</Text>
     )}
        </UserLocationContext.Provider>
        </ScrollView>
        </SafeAreaView>
        
  )
}

const style = StyleSheet.create({
  input:{
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
  }
})

export default location;