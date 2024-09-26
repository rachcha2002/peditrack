import { View, Text, TouchableOpacity, Platform, TextInput, StyleSheet, Image } from 'react-native'
import React, { useState, useEffect } from "react";
import SubScreenHeader from "../../components/SubScreenHeader";
import { ScrollView } from "react-native";
import { icons, images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { vaccineList } from './vaccineList';
import { useNavigation } from '@react-navigation/native';

const upcomingvaccinelist = () => {
  const [fromDate, setFromDate] = useState(null);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const navigation = useNavigation();
  const completedVaccines = vaccineList.filter(vaccine => vaccine.status === "completed");

  const handleDateChange = (event, selectedDate) => {
    setShowFromDatePicker(false);
    if (selectedDate) {
      setFromDate(selectedDate);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <SubScreenHeader title="Completed Vaccines" goBackPath={"/vaccine"} />

      <View className="m-4 flex flex-row justify-between space-x-4 mb-4">
        <View style={{ flex: 1 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-[#ffffff] rounded-2xl border-2 border-[#7360F2]">
            <TextInput
              className="flex-1 text-[#7360F2] mt-1 font-pregular"
              placeholder="Search by vaccine name"
              placeholderTextColor="#7360F2"
              value={""}
            // onChangeText={setSearchCrop}
            />
          </View>


          <View className=" mt-4 flex-row items-center justify-between space-x-4 h-14 px-4 bg-[#ffffff] rounded-2xl border-2 border-[#7360F2] ">
            <TouchableOpacity
              className="flex-1"
              onPress={() => setShowFromDatePicker(true)}
            >
              <Text className="text-[#7360F2] mt-1 font-pregular">
                {fromDate ? fromDate.toLocaleDateString() : "Search by Date"}
              </Text>
            </TouchableOpacity>
          </View>

          {showFromDatePicker && (
            <DateTimePicker
              value={fromDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
            />
          )}
        </View>
      </View>
      <ScrollView className="flex-1 bg-white">
        {completedVaccines.map((vaccine) => (
          <TouchableOpacity
            key={vaccine.id}
            onPress={() => navigation.navigate('completedvaccinedetails', { vaccine })}  
          >
            <View className="m-4 bg-white rounded-lg shadow-lg px-4 mb-2 rounded-2xl border-2 border-[#d3cdfb]" key={vaccine.id} style={styles.card}>
              <Image source={vaccine.image} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.vaccineName}>{vaccine.name}</Text>
                <Text style={styles.dueDate}>Date: {vaccine.dueDate}</Text>
                <Text style={styles.time}>Time: {vaccine.Time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  image: {
    width: 90,
    height: 110,
    borderRadius: 10,
    marginRight: 20,
  },
  details: {
    flex: 1,
  },
  vaccineName: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15
  },
  dueDate: {
    fontSize: 18,
    marginLeft: 25,
    color: "#00000",
    marginBottom: 5
  },
  time: {
    fontSize: 18,
    marginLeft: 25,
    color: "#00000",
    marginBottom: 10
  },
});

export default upcomingvaccinelist