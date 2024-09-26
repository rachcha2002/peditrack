import {React, useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useGlobalContext } from '../../context/GlobalProvider';
import { icons, images } from '../../constants';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';
import MainHeader from '../../components/MainHeader';
import Icon from 'react-native-vector-icons/Ionicons'
import GoogleMapView from '../../components/GoogleMapView';
import * as Location from 'expo-location'

const location = () => {
  const [selectedFacility, setSelectedFacility] = useState('Hospitals');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);
    })();
  }, []);


  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="flex-1 bg-white">
        {/* Header */}
        <MainHeader title="Nearest Health Facilities"/>
      <View style={style.searchSection}>
        <Icon name="search" size={20} color="black" style={style.searchIcon}/>
        <TextInput 
        placeholder='Search for a Health Facility' 
        placeholderTextColor="gray" 
        style={style.input}>
        </TextInput>
      </View>
      <Text className="text-lg font-semibold text-black ml-3">Nearest Health Facilities Map</Text>

      {/* Buttons for facility types */}
      <View style={style.facilityButtons}>
        <TouchableOpacity
          style={style.button}
          onPress={() => setSelectedFacility('Hospitals')}
        >
          <Text 
          style={[
            style.buttonText,
            selectedFacility === 'Hospitals' ? style.selectedButton : null,
          ]}>
            Hospitals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={style.button} 
          onPress={() => setSelectedFacility('Pharmacies')}
        >
          <Text 
          style={[
            style.buttonText,
            selectedFacility === 'Pharmacies' ? style.selectedButton : null,
          ]}>Pharmacies</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={style.button}
          onPress={() => setSelectedFacility('MOHs')}
        >
          <Text style={[
            style.buttonText,
            selectedFacility === 'MOHs' ? style.selectedButton : null,
          ]}>
          MOHs</Text>
        </TouchableOpacity>
      </View>
      <View style={style.facilityButtons}>
        <TouchableOpacity
          style={style.button}
          onPress={() => setSelectedFacility('Private Hospitals')}
        >
          <Text 
           style={[
            style.buttonText,
            selectedFacility === 'Private Hospitals' ? style.selectedButton : null,
          ]}>
            Private Hospitals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={style.button}
          onPress={() => setSelectedFacility('Dispensaries')}
        >
          <Text 
          style={[
            style.buttonText,
            selectedFacility === 'Dispensaries' ? style.selectedButton : null,
          ]}
          >Dispensaries</Text>
        </TouchableOpacity>
        </View>
        <GoogleMapView/>
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