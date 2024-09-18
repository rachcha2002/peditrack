import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router"; // Use this hook for accessing passed params
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "../../components/SubScreenHeader";

export default function MedicationDetailsScreen() {
  const { name, description, image } = useLocalSearchParams(); // Get the medication details from params

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Header */}
        <SubHeader title={name} goBackPath={"/health/medicationroutines"} />
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Medication Details - Image and Description */}
          <View style={styles.detailContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.descriptionText}>{description}</Text>
              <Text style={styles.text}>Dose: 10ml</Text>
              <Text style={styles.text}>Date: 21 Sep 2024</Text>
            </View>
          </View>

          {/* Instructions and Started Date in one row */}
          <View style={styles.row}>
            <Text style={styles.boldText}>Instructions: </Text>
            <Text>Give after foods</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.boldText}>Started Date: </Text>
            <Text>21 Sep 2024 @ 8:00 PM</Text>
          </View>

          {/* Prescription Details in two columns */}
          <Text style={styles.miniTitle}>Prescription Details:</Text>
          <View style={styles.prescriptionDetails}>
            <View style={styles.column}>
              <Text style={styles.boldText}>Doctor:</Text>
              <Text>Dr. Marapana</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.boldText}>Contact:</Text>
              <Text>0711526669</Text>
            </View>
          </View>

          {/* Elevated Card for the remaining details */}
          <View style={styles.card}>
            <Text style={styles.boldText}>Interval Duration (Hours):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              defaultValue="6"
            />

            <Text style={styles.boldText}>Ending Date:</Text>
            <TextInput
              style={styles.input}
              defaultValue="25 Sep 2024, 8:00 AM"
            />

            <Text style={styles.boldText}>Notification Settings:</Text>
            <View>
              <Text>10 min before time</Text>
              <Text>5 min before time</Text>
              <Text>On time!</Text>
            </View>

            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  detailContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-around",
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: "gray",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
    marginRight: 5,
  },
  miniTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  prescriptionDetails: {
    flexDirection: "row",
    marginBottom: 20,
  },
  column: {
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "purple",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "flex-end", // Align button to bottom right
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
