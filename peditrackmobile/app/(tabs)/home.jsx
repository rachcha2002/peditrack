import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons, images } from "../../constants";
import { router } from "expo-router";
import { Colors } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

// Get screen dimensions
const { width } = Dimensions.get("window");

const Home = () => {
  const { user } = useGlobalContext();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-white h-full">
        <StatusBar backgroundColor={Colors.PRIMARY} barStyle="light-content" />
        <View
          style={{
            padding: 10,
            backgroundColor: Colors.PRIMARY,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            flexDirection: "column",
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Image
              source={images.peditracklogo} // Replace with the correct path for your logo
              style={{
                width: 140,
                height: 40,
              }}
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => {
                router.push("/profile/profilescreen");
              }}
            >
              <Image
                source={{ uri: user?.imageUrl }}
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 50,
                }}
              />
            </TouchableOpacity>
          </View>

          {/* Menura and Bell Icon Row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginLeft: 5,
            }}
          >
            <View>
              <Text className="text-2xl font-psemibold text-white">
                {user?.name}
              </Text>
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
            </View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Image
                source={icons.bellwhite} // Replace with the correct path for the bell icon
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Home Screen Content */}

        {/* Baby Health & Growth Card with Image Background */}
        <View className="rounded-3xl overflow-hidden m-2">
          <ImageBackground
            source={images.home1} // Adjust image path
            style={{ width: "100%", height: 150, justifyContent: "flex-end" }}
          >
            {/* Dark overlay */}
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
              }}
            />

            {/* Text positioned at bottom-left */}
            <View style={{ padding: 16 }}>
              <Text style={{ color: "#fff", fontSize: 25, fontWeight: "bold" }}>
                Plan Every Step Your
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 25,
                  fontWeight: "bold",
                  marginTop: 4,
                }}
              >
                Child's Care
              </Text>
            </View>
          </ImageBackground>
        </View>

        <View
          className="bg-white rounded-lg p-4 shadow-lg w-11/12 self-center"
          style={styles.elevation}
        >
          <View className="flex-row items-center">
            {/* Baby Image */}
            <Image
              source={{
                uri: "https://www.example.com/baby.jpg", // Replace with actual image URL
              }}
              className="w-20 h-20 rounded-full mr-4"
            />

            {/* Baby Info */}
            <View>
              <Text className="text-lg font-bold text-[#6256B1]">Thisal</Text>
              <View className="flex-row">
                <Text className="font-bold">Age:</Text>
                <Text className="ml-2">1 Year 2 months</Text>
              </View>
              <View className="flex-row">
                <Text className="font-bold">Weight:</Text>
                <Text className="ml-2">3 kg</Text>
              </View>
              <View className="flex-row">
                <Text className="font-bold">Height:</Text>
                <Text className="ml-2">40 cm</Text>
              </View>
            </View>
          </View>

          {/* Next Vaccination */}
          <Text className="mt-4">
            <Text className="font-bold">Next Vaccination:</Text>
            <Text className="ml-2">16/12/2024 (DPT 4, OPV 4)</Text>
          </Text>

          {/* Feedings */}
          <Text className="mt-2">
            <Text className="font-bold text-lg">Feedings</Text>
          </Text>
          <Text>
            <Text className="font-bold">Next Feeding Time:</Text>
            <Text className="ml-2">10.00 AM Smashed Fruit</Text>
          </Text>

          {/* Health */}
          <Text className="mt-2">
            <Text className="font-bold text-lg">Health</Text>
          </Text>
          <Text>
            <Text className="font-bold">Status:</Text>
            <Text className="ml-2">Ongoing fever</Text>
          </Text>
          <Text>
            <Text className="font-bold">Next Medication Time:</Text>
            <Text className="ml-2">10.00 AM Paracetamol</Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",

            marginTop: 5,
          }}
        >
          {/* First Row with Three cards */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              router.push("/health/healthrecords");
            }}
          >
            <Image
              source={images.recordsicon} // Adjust image path
              style={{ width: 50, height: 50 }}
            />
            <Text style={{ color: "black", marginTop: 5 }}>Health Records</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              router.push("/health/growthmilestones");
            }}
          >
            <Image
              source={images.growthicon} // Adjust image path
              style={{ width: 50, height: 50 }}
            />
            <Text style={{ color: "black", marginTop: 5 }}>
              Growth Milestones
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              router.push("/vaccination/upcomingvaccinelist");
            }}
          >
            <Image
              source={images.VaccineAccess} // Adjust image path
              style={{ width: 50, height: 50 }}
            />
            <Text style={{ color: "black", marginTop: 5 }}>
              Vaccine Log
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

// Styles with dynamic width and height for responsive design
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.27, // Cards will take up about 27% of the screen width
    height: width * 0.27, // Square cards
    margin: 10, // Add margin between cards
  },
  elevation: {
    elevation: 8, // Add elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default Home;
