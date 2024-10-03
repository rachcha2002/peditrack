import { View, Text } from 'react-native'
import React from 'react'

export default function Locationdetail_Item({place}) {
  return (
    <View>
      <Text style={{fontSize:26,fontWeight:'bold'}}>
        {place.name}
      </Text>
      <View 
      style={{
        display:'flex',
        alignItems:'center',
        gap:5,
        flexDirection:'row',
        marginTop:10}}
       > 
      <Text>{place.vicinity}</Text>
      </View>
    </View>
  )
}