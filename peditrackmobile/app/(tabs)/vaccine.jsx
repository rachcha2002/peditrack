import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Image, Alert } from "react-native";
import * as FileSystem from "expo-file-system"; // For accessing the local file system

const filePath = `${FileSystem.documentDirectory}healthRecords.json`; // Path to the saved records

export default function HealthRecordList() {
  const [records, setRecords] = useState([]); // State to store health records
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Fetch the health records from the local JSON file
  const fetchHealthRecords = async () => {
    try {
      // Check if the file exists
      const fileExists = await FileSystem.getInfoAsync(filePath);
      if (!fileExists.exists) {
        setLoading(false); // No data to load
        Alert.alert("No records found", "No health records available.");
        return;
      }

      // Read the file content
      const fileContent = await FileSystem.readAsStringAsync(filePath);
      const parsedRecords = JSON.parse(fileContent);

      // Update the state with the records
      setRecords(parsedRecords);
    } catch (error) {
      console.error("Error reading health records:", error);
      Alert.alert("Error", "Failed to load health records.");
    } finally {
      setLoading(false); // Stop loading after fetching the data
    }
  };

  // Load the health records when the component mounts
  useEffect(() => {
    fetchHealthRecords();
  }, []);

  // Render each record as a card
  const renderRecord = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Name: {item.name}</Text>
      <Text style={styles.remark}>Remark: {item.remark}</Text>
      <Text style={styles.date}>
        Created at: {new Date(item.createdAt).toLocaleString()}
      </Text>
      {/* Display the image if available */}
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loading}>Loading health records...</Text>
      ) : (
        <FlatList
          data={records}
          renderItem={renderRecord}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  remark: {
    fontSize: 16,
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  loading: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
});
