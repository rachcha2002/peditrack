import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router"; // Use this hook for accessing passed params
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import SubHeader from "../../components/SubScreenHeader";
import * as Notifications from "expo-notifications";
import * as FileSystem from "expo-file-system";
import {
  updateDoc,
  doc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore"; // Firestore update functionality
import { db } from "../../lib/firebase"; // Firestore database instance

const medicationFilePath = `${FileSystem.documentDirectory}medicationRecords.json`; // File path for local storage

export default function MedicationDetailsScreen() {
  // Get medication details from params
  const {
    title,
    description,
    imageUri,
    dose,
    startDate,
    endDate,
    instruction,
    doctor,
    doctorContact,
    intervalDuration,
    routine,
    babyName,
    userMail,
    ID, // The ID to identify the record
  } = useLocalSearchParams();

  // Check if routine is already an object
  let parsedRoutine;
  try {
    parsedRoutine = typeof routine === "string" ? JSON.parse(routine) : routine;
  } catch (error) {
    console.error("Error parsing routine: ", error);
    parsedRoutine = []; // Handle error case and set routine as an empty array
  }

  const [showPicker, setShowPicker] = useState(false); // State to show/hide DateTimePicker (iOS only)
  const [notificationSettings, setNotificationSettings] = useState({
    before10Min: false,
    before5Min: false,
    onTime: false,
  });

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editedRoutine, setEditedRoutine] = useState([...parsedRoutine]);
  const [currentDateTime, setCurrentDateTime] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Request permission for notifications
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission not granted",
          "You need to enable notifications to receive reminders."
        );
      }
    };

    requestPermissions();
  }, []);

  // Format Date
  const formatDate = (date) => {
    return `${new Date(date).toLocaleDateString()} @ ${new Date(
      date
    ).toLocaleTimeString()}`;
  };

  // Toggle checkbox settings
  const toggleCheckbox = (key) => {
    setNotificationSettings((prevSettings) => ({
      ...prevSettings,
      [key]: !prevSettings[key],
    }));
  };

  // Handle DateTime change
  const onChange = (event, selectedDate) => {
    if (event.type === "set" && currentIndex !== null) {
      const updatedRoutine = [...editedRoutine];
      updatedRoutine[currentIndex].dateAndTime = selectedDate.toISOString();

      // Update subsequent times with the interval duration
      for (let i = currentIndex + 1; i < updatedRoutine.length; i++) {
        const previousDate = new Date(updatedRoutine[i - 1].dateAndTime);
        const newDate = new Date(previousDate);
        newDate.setHours(newDate.getHours() + parseInt(intervalDuration));
        updatedRoutine[i].dateAndTime = newDate.toISOString();
      }

      setEditedRoutine(updatedRoutine);
      setShowPicker(false);
    } else {
      setShowPicker(false);
    }
  };

  // Open DateTimePicker for Android
  const openAndroidDatePicker = (index) => {
    setCurrentIndex(index);
    DateTimePickerAndroid.open({
      value: new Date(editedRoutine[index].dateAndTime),
      onChange,
      mode: "datetime",
      is24Hour: true,
    });
  };

  // Schedule a notification
  const scheduleNotification = async (date, message) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Medication Reminder",
        body: message,
      },
      trigger: {
        date: date,
      },
    });
  };

  // Schedule notifications for each routine time
  const scheduleRoutineNotifications = async (routine) => {
    try {
      for (let item of routine) {
        const medicationTime = new Date(item.dateAndTime);

        // Schedule "On Time" notification
        if (notificationSettings.onTime) {
          await scheduleNotification(
            medicationTime,
            "It's time to take your medication!"
          );
        }

        // Schedule "5 min before" notification
        if (notificationSettings.before5Min) {
          const fiveMinutesBefore = new Date(
            medicationTime.getTime() - 5 * 60 * 1000
          );
          await scheduleNotification(
            fiveMinutesBefore,
            "Take your medication in 5 minutes!"
          );
        }

        // Schedule "10 min before" notification
        if (notificationSettings.before10Min) {
          const tenMinutesBefore = new Date(
            medicationTime.getTime() - 10 * 60 * 1000
          );
          await scheduleNotification(
            tenMinutesBefore,
            "Take your medication in 10 minutes!"
          );
        }
      }

      // Alert after scheduling all notifications
      Alert.alert("Success", "All medication reminders have been set!");
    } catch (error) {
      console.error("Error scheduling notifications:", error);
      Alert.alert("Error", `Failed to set notifications: ${error.message}`);
    }
  };

  // Save routine to local storage and Firestore, and schedule notifications
  const saveRoutine = async () => {
    try {
      await saveRoutineLocally(editedRoutine); // Save locally
      await saveRoutineToFirestore(editedRoutine); // Sync with Firestore
      await scheduleRoutineNotifications(editedRoutine); // Schedule notifications
      setModalVisible(false);
      Alert.alert("Success", "Routine saved and notifications scheduled.");
    } catch (error) {
      console.error("Error saving routine:", error);
      Alert.alert("Error", `Failed to save routine: ${error.message}`);
    }
  };

  // Save routine to local storage
  const saveRoutineLocally = async (updatedRoutine) => {
    try {
      let localRecords = [];
      const fileExists = await FileSystem.getInfoAsync(medicationFilePath);
      if (fileExists.exists) {
        const fileContent = await FileSystem.readAsStringAsync(
          medicationFilePath
        );
        localRecords = JSON.parse(fileContent);
      }

      // Find the record to update based on the babyName, userMail, and ID
      const recordIndex = localRecords.findIndex(
        (record) =>
          record.babyName === babyName &&
          record.ID === ID &&
          record.userMail === userMail
      );

      if (recordIndex !== -1) {
        localRecords[recordIndex].routine = updatedRoutine;
        await FileSystem.writeAsStringAsync(
          medicationFilePath,
          JSON.stringify(localRecords)
        );
        Alert.alert("Success", "Routine updated locally.");
      } else {
        Alert.alert("Error", "Record not found.");
      }
    } catch (error) {
      console.error("Error saving routine locally:", error);
      Alert.alert("Error", `Failed to save routine locally: ${error.message}`);
    }
  };

  // Save routine to Firestore
  const saveRoutineToFirestore = async (updatedRoutine) => {
    try {
      // Query Firestore for the document that matches babyName, userMail, and ID
      const q = query(
        collection(db, "medicationRoutines"),
        where("babyName", "==", babyName),
        where("userMail", "==", userMail),
        where("ID", "==", ID)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        Alert.alert("Error", "Record not found in Firestore.");
        return;
      }

      // Assuming there is only one document that matches
      const docRef = querySnapshot.docs[0].ref;

      // Update the routine field in the found document
      await updateDoc(docRef, { routine: updatedRoutine });
      Alert.alert("Success", "Routine synced with Firestore.");
    } catch (error) {
      console.error("Error saving routine to Firestore:", error);
      Alert.alert(
        "Error",
        `Failed to save routine to Firestore: ${error.message}`
      );
    }
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
        <SubHeader title={title} goBackPath={"/health/medicationroutines"} />
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {/* Medication Details - Image and Description */}
            <View className="flex-row mb-5 bg-white rounded-lg">
              <Image
                source={{ uri: imageUri }}
                className="w-32 h-32 rounded-lg mr-5"
              />
              <View className="flex-1 justify-around">
                <Text className="text-[18px]">{description}</Text>
                <Text>
                  <Text className="font-bold text-[18px]">Dose:</Text>
                  <Text className="text-[18px]"> {dose}</Text>
                </Text>

                <Text>
                  <Text className="font-bold text-[18px]">Date:</Text>
                  <Text className="text-[18px]">
                    {new Date(startDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </Text>
              </View>
            </View>

            {/* Instructions and Started Date in one row */}
            <View className="flex-row mb-2">
              <Text className="font-bold mr-2 text-[18px]">Instructions:</Text>
              <Text className="text-[18px]">{instruction}</Text>
            </View>

            <View className="flex-row mb-2">
              <Text className="font-bold mr-2 text-[18px]">Started Date:</Text>
              <Text className="text-[18px]">
                {formatDate(new Date(startDate))}
              </Text>
            </View>

            <View className="flex-row mb-2">
              <Text className="font-bold text-[18px]">Ending Date:</Text>
              <Text className="text-[18px] ml-1">
                {formatDate(new Date(endDate))}
              </Text>
            </View>

            <View className="flex-row mb-2">
              <Text className="font-bold text-[18px]">Interval Duration:</Text>
              <Text className="text-[18px] ml-1">{intervalDuration} Hours</Text>
            </View>

            {/* Prescription Details in two columns */}
            <Text className="text-xl font-bold mb-2 mt-1 text-[#6256B1]">
              Prescription Details
            </Text>
            <View className="flex-row mb-5">
              <View className="flex-1">
                <Text className="font-bold text-[18px]">Doctor:</Text>
                <Text className="text-[18px] ml-4">Dr.{doctor}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-bold text-[18px]">Contact:</Text>
                <Text className="text-[18px] ml-4">{doctorContact}</Text>
              </View>
            </View>

            {/* Input for Interval Duration and Ending Date */}
            <View
              className="bg-white p-4 rounded-lg shadow-xl shadow-black elevation-8 mb-16
            "
            >
              <Text className="font-bold mb-2 text-[18px]">
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
              onPress={() => setModalVisible(true)} // Open modal
            >
              <Text className="text-white text-lg font-bold">
                All Track Record
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Routine Timeline</Text>
              <ScrollView contentContainerStyle={styles.timelineContainer}>
                {editedRoutine && editedRoutine.length > 0 ? (
                  editedRoutine.map((item, index) => (
                    <View key={index} style={styles.timelineItem}>
                      <Text style={styles.timelineText}>
                        {formatDate(item.dateAndTime)}
                      </Text>
                      {new Date(item.dateAndTime) > new Date() && (
                        <TouchableOpacity
                          onPress={() => {
                            setCurrentIndex(index);
                            if (Platform.OS === "android") {
                              openAndroidDatePicker(index); // Android-specific picker
                            } else {
                              setCurrentDateTime(new Date(item.dateAndTime));
                              setShowPicker(true); // iOS Picker
                            }
                          }}
                          style={styles.editButton}
                        >
                          <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))
                ) : (
                  <Text>No routines available.</Text>
                )}
              </ScrollView>

              {/* DateTime Picker for iOS */}
              {showPicker && Platform.OS === "ios" && (
                <DateTimePicker
                  value={currentDateTime || new Date()}
                  mode="datetime"
                  is24Hour={true}
                  display="spinner"
                  onChange={onChange}
                />
              )}

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={saveRoutine}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)} // Close modal
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    height: "70%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  timelineContainer: {
    paddingVertical: 10,
  },
  timelineItem: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timelineText: {
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "#6256B1",
    padding: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: "white",
  },
  saveButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#6256B1",
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#6256B1",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});
