import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker"; // For picking images
import * as FileSystem from "expo-file-system"; // For saving data locally
import NetInfo from "@react-native-community/netinfo"; // For network status
import { addDoc, collection } from "firebase/firestore"; // For syncing with Firestore
import { db } from "../../lib/firebase"; // Your Firestore config
import { Picker } from "@react-native-picker/picker";
import { icons, images } from "../../constants";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const filePath = `${FileSystem.documentDirectory}babyProfiles.json`; // File path for local storage

const BabyProfileForm = () => {
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [babyName, setBabyName] = useState("");
  const [initialWeight, setInitialWeight] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [initialHeight, setInitialHeight] = useState("");
  const [initialCircumference, setInitialCircumference] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [specialRemarks, setSpecialRemarks] = useState("");
  const [lastVaccinated, setLastVaccinated] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState(new Date()); // vaccinationDate state
  const [profileImage, setProfileImage] = useState(null); // To store the picked image URI
  const [showDobPicker, setShowDobPicker] = useState(false); // Separate state for DOB picker
  const [showVaccinationPicker, setShowVaccinationPicker] = useState(false); // Separate state for Vaccination picker

  const { user } = useGlobalContext();
  const navigation = useNavigation();

  const navigateHome = () => {
    router.push("/home");
  };

  const navigateProfile = () => {
    router.push("/profile");
  };

  // Handle Date Picker change for Date of Birth
  const onDateOfBirthChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDobPicker(false);
    setDateOfBirth(currentDate);
  };

  // Handle Date Picker change for Vaccination Date
  const onVaccinationDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || vaccinationDate;
    setShowVaccinationPicker(false);
    setVaccinationDate(currentDate); // Update the vaccination date state
  };

  // Handle image picking
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access the camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (
      !pickerResult.canceled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      const selectedImageUri = pickerResult.assets[0].uri; // Get the URI from the assets array
      setProfileImage(selectedImageUri);
      console.log("Image picked:", selectedImageUri); // Corrected log statement
    } else {
      console.log("Image picking canceled or no image selected");
    }
  };

  // Handle save form data locally and optionally sync with Firestore
  const handleSave = async () => {
    if (!babyName || !initialWeight || !bloodGroup) {
      Alert.alert("Validation Error", "Please fill all required fields.");
      return;
    }

    const newProfile = {
      babyName,
      dateOfBirth: dateOfBirth.toISOString(),
      initialWeight,
      bloodGroup,
      initialHeight,
      initialCircumference,
      birthPlace,
      specialRemarks,
      lastVaccinated,
      vaccinationDate: vaccinationDate.toISOString(),
      profileImage,
      createdAt: new Date().toISOString(),
      userMail: user.email,
    };

    const weightRecord = {
      babyName,
      userMail: user.email,
      date: dateOfBirth.toISOString(),
      weight: parseFloat(initialWeight),
      age: 0,
      remarks: "",
      //createdAt: new Date().toISOString(),
    };

    const heightRecord = {
      babyName,
      userMail: user.email,
      date: dateOfBirth.toISOString(),
      height: parseFloat(initialHeight),
      age: 0,
      remarks: "",
      //createdAt: new Date().toISOString(),
    };

    const circumferenceRecord = {
      babyName,
      userMail: user.email,
      date: dateOfBirth.toISOString(),
      circum: parseFloat(initialCircumference),
      recordName: "Initial Record",
      age: 0,
      remarks: "No remarks",
      //createdAt: new Date().toISOString(),
    };

    try {
      // Save to local storage
      let profiles = [];
      const fileExists = await FileSystem.getInfoAsync(filePath);
      if (fileExists.exists) {
        const fileContent = await FileSystem.readAsStringAsync(filePath);
        profiles = JSON.parse(fileContent);
      }
      profiles.push(newProfile);
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(profiles));

      // Save weight record to local storage
      const weightFilePath = `${FileSystem.documentDirectory}weightRecords.json`;
      let weightRecords = [];
      const weightFileExists = await FileSystem.getInfoAsync(weightFilePath);
      if (weightFileExists.exists) {
        const weightFileContent = await FileSystem.readAsStringAsync(
          weightFilePath
        );
        weightRecords = JSON.parse(weightFileContent);
      }
      weightRecords.push(weightRecord);
      await FileSystem.writeAsStringAsync(
        weightFilePath,
        JSON.stringify(weightRecords)
      );

      // Save height record to local storage
      const heightFilePath = `${FileSystem.documentDirectory}heightRecords.json`;
      let heightRecords = [];
      const heightFileExists = await FileSystem.getInfoAsync(heightFilePath);
      if (heightFileExists.exists) {
        const heightFileContent = await FileSystem.readAsStringAsync(
          heightFilePath
        );
        heightRecords = JSON.parse(heightFileContent);
      }
      heightRecords.push(heightRecord);
      await FileSystem.writeAsStringAsync(
        heightFilePath,
        JSON.stringify(heightRecords)
      );

      // Save circumference record to local storage
      const circumferenceFilePath = `${FileSystem.documentDirectory}circumferenceRecords.json`;
      let circumferenceRecords = [];
      const circumferenceFileExists = await FileSystem.getInfoAsync(
        circumferenceFilePath
      );
      if (circumferenceFileExists.exists) {
        const circumferenceFileContent = await FileSystem.readAsStringAsync(
          circumferenceFilePath
        );
        circumferenceRecords = JSON.parse(circumferenceFileContent);
      }
      circumferenceRecords.push(circumferenceRecord);
      await FileSystem.writeAsStringAsync(
        circumferenceFilePath,
        JSON.stringify(circumferenceRecords)
      );

      Alert.alert("Success", "Profile saved locally.");

      // Optionally sync with Firestore if online
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        // Save the main profile to Firestore
        await addDoc(collection(db, "babyProfiles"), newProfile);

        // Sync weight record with Firestore
        await addDoc(collection(db, "weight"), weightRecord);

        // Sync height record with Firestore
        await addDoc(collection(db, "height"), heightRecord);

        // Sync circumference record with Firestore
        await addDoc(collection(db, "circumference"), circumferenceRecord);

        Alert.alert("Success", "Profile and records synced with Firestore.");
      } else {
        Alert.alert(
          "Offline",
          "Profile and records saved locally. Will sync when online."
        );
      }

      // Reset the form after saving
      resetForm();
      router.push("/profile");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", `Failed to save the profile: ${error.message}`);
    }
  };

  const resetForm = () => {
    setBabyName("");
    setInitialWeight("");
    setBloodGroup("");
    setInitialHeight("");
    setInitialCircumference("");
    setBirthPlace("");
    setSpecialRemarks("");
    setLastVaccinated("");
    setProfileImage(null);
    setDateOfBirth(new Date());
    setVaccinationDate(new Date());
  };
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
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <>
          <View className="bg-white pt-3 px-4 shadow-md">
            {/* Top Row: Back Button, Logo, Bell Icon, and Profile Picture */}
            <View className="flex-row justify-between items-center">
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => router.push("/profile/profilescreen")}
              >
                <Image
                  source={icons.backarrow} // Replace with the correct path for the back arrow icon
                  className="w-8 h-8"
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
                  <Ionicons
                    name="notifications-outline"
                    size={26}
                    color="black"
                  />
                </TouchableOpacity>
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
              </View>
            </View>

            {/* Title */}
            <View className="mt-2">
              <Text className="text text-2xl font-bold text-[#000000]">
                Add Baby Profile
              </Text>
            </View>
          </View>
          <ScrollView style={{ padding: 16 }}>
            {/* Image Picker */}
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  borderWidth: 2,
                  borderRadius: 8,
                  borderColor: "#6C63FF",
                  width: 150,
                  height: 150,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={{ width: 150, height: 150, borderRadius: 8 }}
                  />
                ) : (
                  <Icon
                    name="camera"
                    type="feather"
                    color="#6C63FF"
                    size={40}
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* Personal Information */}
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              Personal Information
            </Text>
            <TextInput
              placeholder="Baby’s Name"
              style={styles.inputField}
              value={babyName}
              onChangeText={setBabyName}
            />
            <TouchableOpacity onPress={() => setShowDobPicker(true)}>
              <View style={styles.inputField}>
                <Icon
                  name="calendar"
                  type="feather"
                  size={20}
                  style={{ marginRight: 10 }}
                />
                <Text>{dateOfBirth.toDateString()}</Text>
              </View>
            </TouchableOpacity>
            {showDobPicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="default"
                onChange={onDateOfBirthChange} // Use the correct handler
              />
            )}

            {/* Medical Information */}
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              Medical Information
            </Text>
            <TextInput
              placeholder="Initial Weight (kg)"
              style={styles.inputField}
              value={initialWeight}
              onChangeText={setInitialWeight}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Blood Group"
              style={styles.inputField}
              value={bloodGroup}
              onChangeText={setBloodGroup}
            />
            <TextInput
              placeholder="Initial Height (cm)"
              style={styles.inputField}
              value={initialHeight}
              onChangeText={setInitialHeight}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Initial Circumference (cm)"
              style={styles.inputField}
              value={initialCircumference}
              onChangeText={setInitialCircumference}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Birth Place"
              style={styles.inputField}
              value={birthPlace}
              onChangeText={setBirthPlace}
            />
            <TextInput
              placeholder="Special Remarks"
              style={[
                styles.inputField,
                { height: 80, textAlignVertical: "top" },
              ]}
              value={specialRemarks}
              onChangeText={setSpecialRemarks}
              multiline
            />

            {/* Vaccination Information */}
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              Vaccination Information
            </Text>
            <TextInput
              placeholder="Last Vaccinated vaccine Name"
              style={styles.inputField}
              value={lastVaccinated}
              onChangeText={setLastVaccinated}
            />
            <TouchableOpacity onPress={() => setShowVaccinationPicker(true)}>
              <View style={styles.inputField}>
                <Icon
                  name="calendar"
                  type="feather"
                  size={20}
                  style={{ marginRight: 10 }}
                />
                <Text>{vaccinationDate.toDateString()}</Text>
              </View>
            </TouchableOpacity>
            {showVaccinationPicker && (
              <DateTimePicker
                value={vaccinationDate}
                mode="date"
                display="default"
                onChange={onVaccinationDateChange} // Use the correct handler
              />
            )}

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Save
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = {
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  saveButton: {
    backgroundColor: "#6C63FF",
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 30,
  },
};

export default BabyProfileForm;
