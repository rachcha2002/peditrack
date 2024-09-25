import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Button,
  View,
  Alert,
  Image,
} from "react-native";
import * as FileSystem from "expo-file-system"; // For working with the local file system
import NetInfo from "@react-native-community/netinfo";
import * as ImagePicker from "expo-image-picker"; // For picking images
import { collection, addDoc } from "firebase/firestore"; // Firestore functions
import { db } from "../../lib/firebase"; // Your Firebase configuration

const filePath = `${FileSystem.documentDirectory}healthRecords.json`; // File where records will be saved
const imageFolder = `${FileSystem.documentDirectory}images/`; // Folder for saving images

export default function Health() {
  const [name, setName] = useState("");
  const [remark, setRemark] = useState("");
  const [imageUri, setImageUri] = useState(null); // For the picked image URI
  const [isConnected, setIsConnected] = useState(true); // To check network connection

  // Create the images folder if it doesn't exist
  useEffect(() => {
    const createImageFolder = async () => {
      const folderInfo = await FileSystem.getInfoAsync(imageFolder);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(imageFolder);
      }
    };

    createImageFolder();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      console.log(`Network is ${state.isConnected ? "online" : "offline"}`);
    });
    return () => unsubscribe();
  }, []);

  // Pick an image using Expo's ImagePicker and move it to the local images folder
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    // Ensure the result has assets and is not canceled
    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const pickedImageUri = result.assets[0].uri; // Get the URI from the assets array

      // Move the image to the local 'images' folder
      const imageName = pickedImageUri.split("/").pop(); // Extract the image file name
      const newPath = `${imageFolder}${imageName}`; // Destination path in the images folder

      try {
        await FileSystem.moveAsync({
          from: pickedImageUri,
          to: newPath,
        });
        setImageUri(newPath); // Set the new path as the image URI
        console.log("Image saved to:", newPath); // Log the new image path
      } catch (error) {
        console.error("Error moving the image:", error);
      }
    } else {
      console.log("Image picker was cancelled or no image was selected");
    }
  };

  // Function to sync with Firestore
  const syncWithFirestore = async (newRecord) => {
    try {
      // Add the record to Firestore
      const docRef = await addDoc(collection(db, "healthRecords"), {
        name: newRecord.name,
        remark: newRecord.remark,
        createdAt: newRecord.createdAt,
        imageUrl: newRecord.imageUrl, // Store the local path in Firestore
      });
      console.log(`Document written with ID: ${docRef.id}`);
      Alert.alert("Sync Success", "Record synced with Firestore.");
    } catch (error) {
      console.error("Error syncing with Firestore:", error);
      Alert.alert("Error", `Failed to sync with Firestore: ${error.message}`);
    }
  };

  // Function to add health data to the local file system and sync with Firestore if online
  const addData = async () => {
    if (name.trim() === "" || remark.trim() === "") {
      Alert.alert("Validation Error", "Please enter both name and remark");
      return;
    }

    const newRecord = {
      name,
      remark,
      imageUrl: imageUri, // Store the local image path (URI)
      createdAt: new Date().toISOString(),
      synced: false, // Mark as unsynced
    };

    console.log("Data to save:", newRecord); // Log the data being saved

    try {
      // Read existing records from local storage
      let records = [];
      const fileExists = await FileSystem.getInfoAsync(filePath);
      if (fileExists.exists) {
        const fileContent = await FileSystem.readAsStringAsync(filePath);
        records = JSON.parse(fileContent);
      }

      // Add the new record
      records.push(newRecord);

      // Save the updated records to the file system
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(records));

      Alert.alert("Success", "Health record saved locally.");

      // If connected, sync the record with Firestore
      if (isConnected) {
        await syncWithFirestore(newRecord);
      } else {
        Alert.alert("Offline", "Record saved locally but not yet synced.");
      }

      // Clear the form fields
      setName("");
      setRemark("");
      setImageUri(null); // Reset the image URI
    } catch (error) {
      console.error("Error saving health record:", error);
      Alert.alert("Error", `Failed to save the record: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Remark"
        value={remark}
        onChangeText={setRemark}
      />
      <Button title="Pick Image" onPress={pickImage} />
      {/* Display the selected image */}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Add Health Record" onPress={addData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});
