import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useGlobalContext } from "../context/GlobalProvider"; // Adjust the path as needed
import { icons, images } from "../constants"; // Adjust the path as needed
import { router } from "expo-router";
import { Colors } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const MainHeader = ({ title }) => {
  const { user } = useGlobalContext();

  return (
    <View
      style={{
        padding: 15,
        backgroundColor :Colors.PRIMARY,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        flexDirection: "colomn",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Image
          source={images.peditracklogo} // Replace with the correct path for your logo
          style={{
            width: 140,
            height: 40,
            //marginLeft: -5,
            //marginRight: 18,
          }}
          resizeMode="contain"
        />
        <TouchableOpacity
          onPress={() => {
            router.push("/profile");
          }}
        >
          <Image
            source={{ uri: user.imageUrl }}
            style={{
              width: 45,
              height: 45,
              borderRadius: 50,
            }}
          />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text
        style={{
          color: "#fff",
          fontSize: 25,
          fontWeight: "bold",
          alignSelf: "center",
          marginTop: -2,
        }}
      >
        {title}
      </Text>

      {/* Menura and Bell Icon Row */}
      <View
        style={{
          //alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: -10,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => {
            // Handle dropdown menu
            console.log("Dropdown menu clicked");
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Thisal</Text>
          <Ionicons name="chevron-down" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 10,
          }}
        >
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
