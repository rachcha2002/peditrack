import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useGlobalContext } from "../context/GlobalProvider";
import { useNavigation } from "@react-navigation/native";
import { icons, images } from "../constants";
import { router } from "expo-router";

const SubScreenHeader = ({ title, goBackPath }) => {
  const { user } = useGlobalContext();
  const navigation = useNavigation();

  const navigateHome = () => {
    router.push('/home');
  };

  const navigateProfile = () => {
    router.push('/profile');
  };

  return (
    <View className="bg-white py-0.75 px-4 shadow-md">
      {/* Top Row: Back Button, Logo, Bell Icon, and Profile Picture */}
      <View className="flex-row justify-between items-center">
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.push(goBackPath)}>
          <Image
            source={icons.backarrow} // Replace with the correct path for the back arrow icon
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Logo */}
        <TouchableOpacity onPress={navigateHome}>
          <Image
            source={images.peditracklogo} // Replace with the correct path for your logo
            className="w-28 h-10"
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Bell Icon and Profile Picture */}
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity>
            <Image
              source={icons.bellblack} // Replace with the correct path for the bell icon
              className="w-6 h-8"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateProfile}>
            <Image
              source={{ uri: user.imageUrl }}
              className="w-8 h-8 rounded-full"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title (conditionally rendered with dynamic margin) */}
      {title ? (
        <View className="mt-2">
          <Text className="text text-2xl font-bold text-[#6256B1]">{title}</Text>
        </View>
      ) : (
        <View className="mt-1" />  
      )}
    </View>
  );
};

export default SubScreenHeader;
