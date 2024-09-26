import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

function GoogleMapView() {
  return (
    <View style={{
        marginTop:10,marginLeft:10,
        marginRight:10,marginBottom:10, 
        borderRadius:10, overflow:'hidden'
    }}>
      <MapView
      style={{
        width: Dimensions.get('screen').width*1.0, 
        height: Dimensions.get('screen').height*0.5,
    }}
    //provider={PROVIDER_GOOGLE}
    showsUserLocation={true}
      >
      </MapView>
    </View>
  )
}
export default GoogleMapView;
