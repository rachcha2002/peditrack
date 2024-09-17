import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // For the X close icon
import SubHeader from "../../components/SubScreenHeader"; // Assume your header component
import { useGlobalContext } from "../../context/GlobalProvider"; // Assume your global context
import { images } from "../../constants"; // Assuming you have images like profile photo and logo
import { router } from "expo-router";

export default function HealthRecordsScreen() {
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null); // Track selected record

  // Dummy data for records
  const [records, setRecords] = useState([
    {
      id: 1,
      title: "NICU special treatment",
      date: "25-Sep-23",
      details: "For jaundice (yellowish skin) at birth",
      age: "Age 0 months",
      doctor: "Dr.Chamath Pallawandana",
      relatedDocuments: [
        "https://via.placeholder.com/100", // Sample image URLs
        "https://via.placeholder.com/100",
      ],
    },
    {
      id: 2,
      title: "Antibiotic treatment",
      date: "25-Nov-23",
      details: "For jaundice (yellowish skin) at birth",
      age: "Age 8 months",
      doctor: "Dr.Namal Perera",
      relatedDocuments: ["https://via.placeholder.com/100"],
    },
  ]);

  // Refresh function (dummy for now)
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate adding a new record
    setTimeout(() => {
      setRecords([
        ...records,
        {
          id: 3,
          title: "New Treatment",
          date: "12-Dec-23",
          details: "New record added dynamically",
          age: "Age 12 months",
          doctor: "Dr.Anura Fernando",
          relatedDocuments: [
            "https://via.placeholder.com/100",
            "https://via.placeholder.com/100",
          ],
        },
      ]);
      setRefreshing(false);
    }, 2000);
  };

  // Open modal with selected record
  const openModal = (record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecord(null);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <SubHeader title="Health Records" goBackPath={"/health"} />

        <View style={{ flex: 1 }}>
          {/* ScrollView with refresh control */}
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Basic Information Section */}
            <View className="p-4 bg-white rounded-lg ml-3 mr-3 mt-2  shadow-xl shadow-black elevation-8">
              <Text className="text-xl font-bold mb-1 text-[#6256B1]">
                Basic Information
              </Text>
              <View className="flex-row">
                <Image
                  source={user?.imageUrl || images.profile}
                  className="w-36 h-36 rounded-lg mr-4"
                />
                <View>
                  <Text className="text-lg">
                    <Text className="font-bold">Name:</Text> Thisal Perera
                  </Text>
                  <Text className="text-lg">
                    <Text className="font-bold">DOB:</Text> 2023 Sep 18
                  </Text>
                  <Text className="text-lg">
                    <Text className="font-bold">Initial Weight:</Text> 2.5kg
                  </Text>
                  <Text className="text-lg">
                    <Text className="font-bold">Blood Group:</Text> O+
                  </Text>
                </View>
              </View>
              <View className="flex-column">
                {/* Display initial information with bold text before the ":" */}
                <Text className="text-lg">
                  <Text className="font-bold">Initial Height:</Text> 40cm
                </Text>
                <Text className="text-lg">
                  <Text className="font-bold">Initial Circumference:</Text> 20cm
                </Text>
                <Text className="text-lg">
                  <Text className="font-bold">Current Age:</Text> 12 months
                </Text>
                <Text className="text-lg">
                  <Text className="font-bold">Birth Place:</Text> Nawaloka
                  Hospital Colombo
                </Text>

                {/* Special Remarks as an unordered list */}
                <Text className="text-lg font-bold">Special Remarks:</Text>
                <View className="pl-4">
                  <View className="flex-row items-center">
                    <Text className="text-lg">•</Text>
                    <Text className="text-lg ml-2">
                      Jaundice (yellowish skin) at birth
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Records Section */}
            <View className="p-4">
              <Text className="text-xl font-bold mb-2 text-[#6256B1]">
                Records
              </Text>

              {records.map((record) => (
                <TouchableOpacity
                  key={record.id}
                  onPress={() => openModal(record)} // Open modal when a record is pressed
                >
                  <View className="bg-white rounded-lg shadow-xl shadow-black elevation-8 p-2 mb-4">
                    <View className="flex-row justify-between">
                      <Text className="text-lg font-bold">{record.title}</Text>
                      <Text className="text-sm text-gray-600 mt-2">
                        {record.date}
                      </Text>
                    </View>
                    <Text className="text-md text-gray-600">
                      {record.details}
                    </Text>
                    <Text className="text-md text-gray-600">{record.age}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Modal to display record details */}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 10,
                  width: "80%",
                  position: "relative", // Position the X mark in the top-right
                }}
              >
                {/* X mark to close the modal */}
                <TouchableWithoutFeedback onPress={closeModal}>
                  <Ionicons
                    name="close"
                    size={24}
                    color="black"
                    style={{ position: "absolute", top: 10, right: 10 }}
                  />
                </TouchableWithoutFeedback>

                {selectedRecord && (
                  <>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: "bold",
                        marginBottom: 8,
                      }}
                    >
                      {selectedRecord.title}
                    </Text>
                    {/* Description */}
                    <View style={{ marginBottom: 10 }}>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        Description:
                      </Text>
                      <Text style={{ fontSize: 16 }}>
                        {selectedRecord.details}
                      </Text>
                    </View>

                    {/* Age */}
                    <View style={{ marginBottom: 10 }}>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        Age:
                      </Text>
                      <Text style={{ fontSize: 16 }}>{selectedRecord.age}</Text>
                    </View>

                    {/* Date */}
                    <View style={{ marginBottom: 10 }}>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        Date:
                      </Text>
                      <Text style={{ fontSize: 16 }}>
                        {selectedRecord.date}
                      </Text>
                    </View>

                    {/* Doctor */}
                    <View style={{ marginBottom: 10 }}>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        Doctor:
                      </Text>
                      <Text style={{ fontSize: 16 }}>
                        {selectedRecord.doctor}
                      </Text>
                    </View>

                    {/* Display images for related documents */}
                    <Text
                      style={{
                        fontSize: 16,
                        marginBottom: 6,
                        fontWeight: "bold",
                      }}
                    >
                      Related Documents:
                    </Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {selectedRecord.relatedDocuments.map((doc, index) => (
                        <Image
                          key={index}
                          source={{ uri: doc }}
                          style={{
                            width: 80,
                            height: 80,
                            marginRight: 10,
                            marginBottom: 10,
                            borderRadius: 5,
                          }}
                        />
                      ))}
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>

          {/* "Add New Record" Button */}
          <TouchableOpacity
            className="bg-[#6256B1] py-1 rounded-md items-center"
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
            }}
            onPress={() => {router.push('/health/healthrecordform')}}
          >
            <Text className="text-white text-lg font-bold">Add New Record</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
