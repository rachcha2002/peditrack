import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "../../components/SubScreenHeader";

export default function MedicationRoutinesScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false); // State to track refreshing
  const videoRef = React.useRef(null);

  // Toggle video playback
  const togglePlayback = () => {
    if (isPlaying) {
      videoRef.current.pauseAsync();
    } else {
      videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  // Function to handle when the video playback ends
  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      // Replay the video from the beginning when it ends
      videoRef.current.replayAsync();
      setIsPlaying(true); // Optionally set the play button to 'pause' state if you want it to play immediately
    }
  };

  // Sample medication data
  const medications = [
    {
      id: 1,
      name: "Ibuprofen-Nurofen",
      description: "For inflammation including cold symptoms",
      nextDose: "10:30 AM",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Paracetamol",
      description: "Pain relief and fever reducer",
      nextDose: "02:00 PM",
      image: "https://via.placeholder.com/150",
    },
  ];

  // Function to handle refreshing
  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false); // Stop refreshing after 2 seconds (replace with real logic if needed)
    }, 2000);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Header */}
        <SubHeader title="Medication Routines" goBackPath={"/health"} />

        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ padding: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing} // Controls the refreshing indicator
                onRefresh={onRefresh} // Calls the refresh function when pulled down
              />
            }
          >
            {/* Video Card with Overlayed Play/Pause Button */}
            <View style={styles.card}>
              <Video
                ref={videoRef}
                source={{ uri: "https://www.w3schools.com/html/mov_bbb.mp4" }}
                style={styles.video}
                resizeMode="cover"
                shouldPlay={false}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate} // Detect when video ends
              />
              <TouchableOpacity
                onPress={togglePlayback}
                style={styles.playButton}
              >
                <Ionicons
                  name={isPlaying ? "pause-circle" : "play-circle"}
                  size={50}
                  color="purple" // Purple color for play/pause button
                />
              </TouchableOpacity>
            </View>

            {/* Video Name */}
            <Text style={styles.videoName}>
              How to give medicine to a child using an oral syringe
            </Text>

            <Text style={styles.sectionTitle}>Current Medication</Text>

            {medications.map((medication) => (
              <TouchableOpacity
                key={medication.id}
                style={styles.medicationCard}
                onPress={() =>
                  router.push({
                    pathname: "/health/medicationdetails",
                    params: { ...medication },
                  })
                }
              >
                {/* Notification Icon */}
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="gray"
                  style={styles.notificationIcon}
                />
                {/* Card Title on Top Left */}
                <Text style={styles.medicationTitle}>{medication.name}</Text>
                <View style={styles.medicationContent}>
                  <Image
                    source={{ uri: medication.image }}
                    style={styles.medicationImage}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.medicationDescription}>
                      {medication.description}
                    </Text>
                    <Text style={styles.medicationNextDose}>
                      Next Dose: {medication.nextDose}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add New Routine</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Elevation for Android shadow
    marginBottom: 20,
    position: "relative", // For overlay positioning
  },
  video: {
    width: "100%",
    height: 250, // Increased height for video card
  },
  playButton: {
    position: "absolute",
    top: "40%", // Center the button vertically
    left: "45%", // Center the button horizontally
  },
  videoName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "gray",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#6256B1",
  },
  medicationCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    position: "relative", // To position notification icon
  },
  medicationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10, // Give some spacing between title and image
  },
  medicationContent: {
    flexDirection: "row", // Image and text side by side
  },
  medicationImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  medicationDescription: {
    fontSize: 14,
    color: "black",
    marginVertical: 5,
  },
  medicationNextDose: {
    fontSize: 14,
    color: "black",
  },
  notificationIcon: {
    position: "absolute",
    top: 10, // Push to top of the card
    right: 10, // Align right in the card
  },
  addButton: {
    backgroundColor: "#6256B1",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    margin: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
