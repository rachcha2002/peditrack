import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import LocationItem from './LocationItem'

export default function LocationList({locationList}) {
const navigator = useNavigation(); 

const onLocationClick = (item) => {
   navigator.navigate('locationdetails',{place:item});
}

   // If locationList is not an array, handle it
   if (!Array.isArray(locationList) || locationList.length === 0) {
    return <Text>No locations found.</Text>; // Display a message when there are no locations
   }
   console.log("Location List:", locationList);
  return (
    <View style={{marginLeft:10}}>
      <Text>Found {locationList.length} Facilities</Text>
      <FlatList
        data={locationList.filter(item => item)} // Filter out any undefined or null items
        keyExtractor={(item) => item.place_id} // Fallback to index if id is undefined
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() =>onLocationClick(item)}>
          <LocationItem place={item} />
          </TouchableOpacity>
        )}
      />
    </View>
  )
}