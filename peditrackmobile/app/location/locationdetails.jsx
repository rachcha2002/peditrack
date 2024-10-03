import { View, Text } from 'react-native'
import {React, useEffect} from 'react'
import { useRoute } from '@react-navigation/native'
import { useSearchParams } from 'expo-router';
import Locationdetail_Item from './locationdetail_Item';

export default function Locationdetails() {
const route = useRoute();
const place = route.params?.place;

useEffect(() => {
  console.log(place); // Log the place object
}, [place]);

return (
    <View style={{padding:20,flex:1,backgroundColor:'white'}}>
      <Locationdetail_Item place={place}/>
    </View>
)
}