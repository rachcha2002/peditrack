import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  styles,
  card,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage to handle session
import { useGlobalContext } from "../../context/GlobalProvider"; // Use the context to access user state
import { icons } from "../../constants";
import InfoBox from "../../components/InfoBox"; // Import icons
import BabyProfileList from "../profile/babyprofiles";

const Profile = () => {
  const { setUser, user } = useGlobalContext(); // Access the setUser function to update the state

  // Handle logout
  const handleLogout = async () => {
    try {
      // Remove the session from AsyncStorage
      await AsyncStorage.removeItem("userSession");

      // Clear the user state
      setUser(null);

      // Redirect to the root (login) page
      router.push("/");
    } catch (error) {
      Alert.alert("Logout failed", "An error occurred while logging out.");
      console.error("Error logging out:", error);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
        <TouchableOpacity
          onPress={handleLogout}
          className="flex w-full items-end mb-10"
        >
          <Image
            source={icons.logout}
            resizeMode="contain"
            className="w-7 h-7"
          />
        </TouchableOpacity>

        <View className="w-16 h-16 border border-green-950 rounded-lg flex justify-center items-center">
          <Image
            source={{ uri: user?.imageUrl }}
            className="w-[90%] h-[90%] rounded-lg"
            resizeMode="cover"
          />
        </View>

        <InfoBox
          title={user?.name}
          subtitle={user?.email}
          containerStyles="mt-5"
          titleStyles="text-lg"
        />
      </View>

      <View className="flex-1">
        <BabyProfileList />
        <TouchableOpacity
          onPress={() => {
            router.push("/profile/babyprofileform");
          }}
          style={{
            // Set width to make it a square button
            margin: 16, // Add margin around the button
            height: 40, // Set height equal to width
            backgroundColor: "#6C63FF", // Add a background color
            justifyContent: "center", // Center the text vertically
            alignItems: "center", // Center the text horizontally
            borderRadius: 10, // Rounded corners
            shadowColor: "#000", // Shadow for depth
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5, // Shadow for Android
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Add Baby Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
