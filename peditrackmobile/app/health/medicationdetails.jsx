import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router"; // Use this hook for accessing passed params
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import SubHeader from "../../components/SubScreenHeader";
import { router } from "expo-router";

export default function MedicationDetailsScreen() {
  const { name, description, image } = useLocalSearchParams(); // Get the medication details from params

  const [intervalDuration, setIntervalDuration] = useState("6");
  const [endDate, setEndDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false); // State to show/hide DateTimePicker (iOS only)
  const [notificationSettings, setNotificationSettings] = useState({
    before10Min: false,
    before5Min: false,
    onTime: false,
  });

  // Function to show Android Date Picker
  const showAndroidDatePicker = () => {
    DateTimePickerAndroid.open({
      value: endDate,
      mode: "date",
      onChange: (event, selectedDate) => {
        if (event.type === "set") {
          setEndDate(selectedDate); // Set the selected date first
          showAndroidTimePicker(selectedDate); // Open the time picker afterward
        }
      },
    });
  };

  // Function to show Android Time Picker after selecting a date
  const showAndroidTimePicker = (selectedDate) => {
    DateTimePickerAndroid.open({
      value: selectedDate || endDate,
      mode: "time",
      is24Hour: true,
      onChange: (event, selectedTime) => {
        if (event.type === "set") {
          const finalDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            selectedTime.getHours(),
            selectedTime.getMinutes()
          );
          setEndDate(finalDate); // Set the final date with time
        }
      },
    });
  };

  // iOS: Handle date change and time together
  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  // Show DateTimePicker for iOS
  const showDatePicker = () => {
    if (Platform.OS === "android") {
      showAndroidDatePicker(); // For Android, start with the date picker
    } else {
      setShowPicker(true); // For iOS, show the picker directly
    }
  };

  // Format Date
  const formatDate = (date) => {
    return `${date.toLocaleDateString()} @ ${date.toLocaleTimeString()}`;
  };

  // Toggle checkbox settings
  const toggleCheckbox = (key) => {
    setNotificationSettings((prevSettings) => ({
      ...prevSettings,
      [key]: !prevSettings[key],
    }));
  };

  // Render checkbox with custom TouchableOpacity
  const renderCheckbox = (label, checked, onPress) => (
    <TouchableOpacity
      onPress={onPress}
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
    >
      <View
        style={{
          height: 20,
          width: 20,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: checked ? "#6256B1" : "#ccc",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
        }}
      >
        {checked ? (
          <View style={{ height: 12, width: 12, backgroundColor: "#6256B1" }} />
        ) : null}
      </View>
      <Text>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <SubHeader title={name} goBackPath={"/health/medicationroutines"} />
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {/* Medication Details - Image and Description */}
            <View className="flex-row mb-5 bg-white rounded-lg">
              <Image
                source={{ uri: image }}
                className="w-32 h-32 rounded-lg mr-5"
              />
              <View className="flex-1 justify-around">
                <Text className="text-[18px]">{description}</Text>
                <Text>
                  <Text className="font-bold text-[18px]">Dose:</Text>
                  <Text className="text-[18px]"> 10ml</Text>
                </Text>

                <Text>
                  <Text className="font-bold text-[18px]">Date:</Text>
                  <Text className="text-[18px]"> 21 Sep 2024</Text>
                </Text>
              </View>
            </View>

            {/* Instructions and Started Date in one row */}
            <View className="flex-row mb-2">
              <Text className="font-bold mr-2 text-[18px]">Instructions:</Text>
              <Text className="text-[18px]">Give after foods</Text>
            </View>

            <View className="flex-row mb-2">
              <Text className="font-bold mr-2 text-[18px]">Started Date:</Text>
              <Text className="text-[18px]">21 Sep 2024 @ 8:00 PM</Text>
            </View>

            {/* Prescription Details in two columns */}
            <Text className="text-xl font-bold mb-2 mt-2 text-[#6256B1]">
              Prescription Details
            </Text>
            <View className="flex-row mb-5">
              <View className="flex-1">
                <Text className="font-bold text-[18px]">Doctor:</Text>
                <Text className="text-[18px] ml-4">Dr. Marapana</Text>
              </View>
              <View className="flex-1">
                <Text className="font-bold text-[18px]">Contact:</Text>
                <Text className="text-[18px] ml-4">0711526669</Text>
              </View>
            </View>

            {/* Input for Interval Duration and Ending Date */}
            <View
              className="bg-white p-4 rounded-lg shadow-xl shadow-black elevation-8 mb-16
            "
            >
              <Text className="font-bold mb-2 text-[16px]">
                Interval Duration (Hours):
              </Text>
              <TextInput
                className="border border-gray-400 rounded-lg p-2 mb-3 text-[15px]"
                keyboardType="numeric"
                value={intervalDuration}
                onChangeText={(text) => setIntervalDuration(text)}
              />

              <Text className="font-bold mb-2 text-[16px]">Ending Date:</Text>
              <TouchableOpacity
                className="border border-gray-400 rounded-lg p-3 mb-3"
                onPress={showDatePicker} // Show the date picker
              >
                <Text className="text-[15px]">{formatDate(endDate)}</Text>
              </TouchableOpacity>

              {/* iOS DateTimePicker */}
              {Platform.OS === "ios" && showPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="datetime"
                  display="default"
                  onChange={onChangeDate}
                />
              )}

              <Text className="font-bold mb-2 text-[16px]">
                Notification Settings:
              </Text>
              <View>
                {renderCheckbox(
                  "10 min before time",
                  notificationSettings.before10Min,
                  () => toggleCheckbox("before10Min")
                )}
                {renderCheckbox(
                  "5 min before time",
                  notificationSettings.before5Min,
                  () => toggleCheckbox("before5Min")
                )}
                {renderCheckbox("On time!", notificationSettings.onTime, () =>
                  toggleCheckbox("onTime")
                )}
              </View>

              <TouchableOpacity className="bg-[#6256B1] p-3 mt-[-15px] rounded-lg items-center self-end">
                <Text className="text-white text-[16px] font-bold">Save</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
            className="bg-[#6256B1] py-1 rounded-md items-center mb-2"
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
            }}
            onPress={() => {
              router.push("/health/healthrecordform");
            }}
          >
            <Text className="text-white text-lg font-bold">
              All Track Record
            </Text>
          </TouchableOpacity>
          </ScrollView>
          
          
          
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
