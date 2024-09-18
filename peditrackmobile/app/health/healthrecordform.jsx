import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker"; // DateTimePicker for date selection
import { useGlobalContext } from "../../context/GlobalProvider";
import SubHeader from "../../components/SubScreenHeader";

export default function AddHealthRecordScreen() {
  const { user } = useGlobalContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [doctor, setDoctor] = useState("");
  const [images, setImages] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handle save logic
  const handleSave = () => {
    console.log("Saved!");
  };

  // Handle Date Picker change
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios"); // Close the picker on Android after selection
    setDate(currentDate);
  };

  // Handle image upload
  const handleImageUpload = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access the camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.cancelled) {
      setImages([...images, pickerResult.uri]); // Add selected image to the images array
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Header */}
        <SubHeader
          title="Add Health Record"
          goBackPath={"/health/healthrecords"}
        />

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Title Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Title</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 10,
                marginTop: 5,
              }}
              placeholder="Enter title"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Description
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 10,
                height: 100,
                textAlignVertical: "top",
                marginTop: 5,
              }}
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          {/* Date Picker */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Date</Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 10,
                marginTop: 5,
              }}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ flex: 1 }}>
                {date ? date.toDateString() : "Select a date"}
              </Text>
              <Ionicons name="calendar" size={24} color="gray" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
                themeVariant="dark" // Applies dark theme on both iOS and Android
                textColor="purple"
              />
            )}
          </View>
          {/* Doctor Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Doctor</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 10,
                marginTop: 5,
              }}
              placeholder="Enter doctor's name"
              value={doctor}
              onChangeText={setDoctor}
            />
          </View>

          {/* Image Upload */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Upload Images (Optional)
            </Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                height: 100,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 5,
                borderStyle: "dashed",
              }}
              onPress={handleImageUpload}
            >
              <Ionicons name="add-outline" size={30} color="gray" />
              <Text>Upload</Text>
            </TouchableOpacity>

            {/* Display uploaded images */}
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              {images.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={{
                    width: 80,
                    height: 80,
                    marginRight: 10,
                    borderRadius: 8,
                  }}
                />
              ))}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#7360F2",
              padding: 10,
              borderRadius: 8,
              alignItems: "center",
              marginTop: 20,
            }}
            onPress={handleSave}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
              Save
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
