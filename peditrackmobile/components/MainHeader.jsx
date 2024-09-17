import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useGlobalContext } from '../context/GlobalProvider'; // Adjust the path as needed
import { icons, images } from '../constants'; // Adjust the path as needed
import { router } from 'expo-router';

const MainHeader = ({ title }) => {
  const { user } = useGlobalContext();

  return (
    <View className="bg-[#7360F2] p-4 rounded-b-3xl">
      <View className="flex-row justify-between items-center">
        <Image
          source={images.peditracklogo} // Replace with the correct path for your logo
          className="w-28 h-10"
          resizeMode="contain"
        />
        <TouchableOpacity onPress={()=>{router.push('/profile')}}>
        <Image
          source={{ uri: user.imageUrl }}
          className="w-10 h-10 rounded-full"
        />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text className="text-white mt-4 text-2xl font-bold text-center">{title}</Text>

      {/* Menura and Bell Icon Row */}
      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-white text-lg">Menura</Text>
        <TouchableOpacity>
          <Image
            source={icons.bellwhite} // Replace with the correct path for the bell icon
            className="w-8 h-8"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MainHeader;
