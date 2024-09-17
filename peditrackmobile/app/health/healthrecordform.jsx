import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // For icons like calendar or image upload
import { useGlobalContext } from "../../context/GlobalProvider"; // Assume your global context

export default function AddHealthRecordScreen() {
  const { user } = useGlobalContext(); // Assuming you use global context for user info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [doctor, setDoctor] = useState("");
  const [images, setImages] = useState([]);

  const handleSave = () => {
    // Logic to save the new record
    console.log("Saved!");
  };

  const handleImageUpload = () => {
    // Logic to upload an image (e.g., using Expo's ImagePicker or similar)
    console.log("Image Upload");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView
          contentContainerStyle={{
            padding: 20,
          }}
        >
          {/* Form Header */}
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#6C63FF",
              marginBottom: 20,
            }}
          >
            Add Health Records
          </Text>

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
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Description</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 10,
                height: 100,
                textAlignVertical: "top", // To align the text at the top
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
              onPress={() => console.log("Show date picker")}
            >
              <Text style={{ flex: 1 }}>{date ? date : "Select a date"}</Text>
              <Ionicons name="calendar" size={24} color="gray" />
            </TouchableOpacity>
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

          {/* Save Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#6C63FF",
              padding: 15,
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
