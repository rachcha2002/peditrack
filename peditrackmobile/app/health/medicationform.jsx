import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker"; // Import Image Picker
import SubHeader from "../../components/SubScreenHeader";
import { router } from "expo-router";


export default function AddMedicationRoutineScreen() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dose: "",
    instruction: "",
    doctor: "",
    doctorContact: "",
    intervalDuration: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  const [selectedImage, setSelectedImage] = useState(null); // State to hold the selected image
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Handle DateTimePicker for Android by triggering time picker after date picker
  const showDatePicker = (field) => {
    DateTimePickerAndroid.open({
      value: formData[field],
      mode: "date",
      onChange: (event, selectedDate) => {
        if (event.type === "set") {
          const currentDate = selectedDate || formData[field];
          setFormData({ ...formData, [field]: currentDate });

          // After selecting date, show the time picker
          DateTimePickerAndroid.open({
            value: currentDate,
            mode: "time",
            is24Hour: true,
            onChange: (event, selectedTime) => {
              if (event.type === "set") {
                const finalDate = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate(),
                  selectedTime.getHours(),
                  selectedTime.getMinutes()
                );
                setFormData({ ...formData, [field]: finalDate });
              }
            },
          });
        }
      },
    });
  };

  // Handle iOS date and time change
  const handleDateChange = (event, selectedDate, field) => {
    if (Platform.OS === "android") return; // Skip for Android
    const currentDate = selectedDate || formData[field];
    setFormData({ ...formData, [field]: currentDate });
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Validate doctor contact length (only 10 numbers allowed)
  const validateDoctorContact = (text) => {
    if (/^\d{0,10}$/.test(text)) {
      setFormData({ ...formData, doctorContact: text });
    } else {
      Alert.alert("Invalid Input", "Doctor Contact must be a 10-digit number.");
    }
  };

  // Validate dose (allow only float numbers)
  const validateDose = (text) => {
    if (/^\d*\.?\d*$/.test(text)) {
      setFormData({ ...formData, dose: text });
    } else {
      Alert.alert("Invalid Input", "Dose must be a valid float number.");
    }
  };

  // Handle Image Picker
  const pickImage = async () => {
    // Request permissions to access media library
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      Alert.alert(
        "Permission Required",
        "Permission to access gallery is required."
      );
      return;
    }

    // Launch image picker
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // If image is picked and not canceled, update state
    if (!pickerResult.canceled) {
      setSelectedImage(pickerResult.assets[0].uri); // Set the selected image URI
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-white">
      <SubHeader title="Add New Medication Routine" goBackPath={"/health/medicationroutines"} />
        <ScrollView contentContainerStyle={{ padding: 20 }}>
         

          {/* Form Fields */}
          <View className="mb-4">
            <Text className="text-lg mb-2">Title</Text>
            <TextInput
              className="border border-gray-400 rounded-lg p-3"
              placeholder="Enter title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
          </View>

          <View className="mb-4">
            <Text className="text-lg mb-2">Description</Text>
            <TextInput
              className="border border-gray-400 rounded-lg p-3"
              placeholder="Enter description"
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
            />
          </View>

          <View className="mb-4">
            <Text className="text-lg mb-2">Dose (ml or mg)</Text>
            <TextInput
              className="border border-gray-400 rounded-lg p-3"
              placeholder="Enter dose"
              value={formData.dose}
              keyboardType="decimal-pad"
              onChangeText={validateDose}
            />
          </View>

          <View className="mb-4">
            <Text className="text-lg mb-2">Instruction</Text>
            <TextInput
              className="border border-gray-400 rounded-lg p-3"
              placeholder="Enter instruction"
              multiline
              numberOfLines={4}
              value={formData.instruction}
              onChangeText={(text) =>
                setFormData({ ...formData, instruction: text })
              }
            />
          </View>

          <View className="mb-4">
            <Text className="text-lg mb-2">Doctor</Text>
            <TextInput
              className="border border-gray-400 rounded-lg p-3"
              placeholder="Enter doctor name"
              value={formData.doctor}
              onChangeText={(text) =>
                setFormData({ ...formData, doctor: text })
              }
            />
          </View>

          <View className="mb-4">
            <Text className="text-lg mb-2">Doctor Contact (10 Digits)</Text>
            <TextInput
              className="border border-gray-400 rounded-lg p-3"
              placeholder="Enter doctor contact"
              keyboardType="phone-pad"
              value={formData.doctorContact}
              onChangeText={validateDoctorContact}
            />
          </View>

          <View className="mb-4">
            <Text className="text-lg mb-2">Interval Duration (Hours)</Text>
            <TextInput
              className="border border-gray-400 rounded-lg p-3"
              placeholder="Enter interval duration"
              keyboardType="numeric"
              value={formData.intervalDuration}
              onChangeText={(text) =>
                setFormData({ ...formData, intervalDuration: text })
              }
            />
          </View>

          {/* Start Date */}
          <View className="mb-4">
            <Text className="text-lg mb-2">Start Date</Text>
            <TouchableOpacity
              className="border border-gray-400 rounded-lg p-3"
              onPress={() => showDatePicker("startDate")} // Use showDatePicker
            >
              <Text>{formatDate(formData.startDate)}</Text>
            </TouchableOpacity>

            {/* iOS DateTimePicker */}
            {showStartDatePicker && Platform.OS === "ios" && (
              <DateTimePicker
                value={formData.startDate}
                mode="datetime"
                display="default"
                onChange={(event, selectedDate) =>
                  handleDateChange(event, selectedDate, "startDate")
                }
              />
            )}
          </View>

          {/* End Date */}
          <View className="mb-4">
            <Text className="text-lg mb-2">End Date</Text>
            <TouchableOpacity
              className="border border-gray-400 rounded-lg p-3"
              onPress={() => showDatePicker("endDate")} // Use showDatePicker
            >
              <Text>{formatDate(formData.endDate)}</Text>
            </TouchableOpacity>

            {/* iOS DateTimePicker */}
            {showEndDatePicker && Platform.OS === "ios" && (
              <DateTimePicker
                value={formData.endDate}
                mode="datetime"
                display="default"
                onChange={(event, selectedDate) =>
                  handleDateChange(event, selectedDate, "endDate")
                }
              />
            )}
          </View>

          {/* Image Picker */}
          <View className="mb-4">
            <Text className="text-lg mb-2">Medication Image</Text>
            <TouchableOpacity
              className="border border-gray-400 rounded-lg p-3 mb-3"
              onPress={pickImage}
            >
              <Text>{selectedImage ? "Change Image" : "Pick Image"}</Text>
            </TouchableOpacity>

            {selectedImage && (
              <Image
                source={{ uri: selectedImage }} // Ensure the correct URI is used
                style={{ width: 200, height: 200 }}
              />
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className="bg-purple-600 p-2 rounded-lg items-center mt-4"
            onPress={() => {
              // Handle form submission
              console.log(formData);
            }}
          >
            <Text className="text-white font-bold text-lg">Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
