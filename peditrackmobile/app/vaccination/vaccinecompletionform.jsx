import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView,StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SubScreenHeader from "../../components/SubScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from '@react-navigation/native';

const vaccinecompletionform = () => {
  const route = useRoute();
  const { vaccine } = route.params;
  const [batchNo, setBatchNo] = useState('');
  const [vaccinatedDate, setVaccinatedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [vaccinatedTime, setVaccinatedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [specialNotes, setSpecialNotes] = useState('');

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || vaccinatedDate;
    setShowDatePicker(false);
    setVaccinatedDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || vaccinatedTime;
    setShowTimePicker(false);
    setVaccinatedTime(currentTime);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
    <SafeAreaView className="bg-white h-full">
      <SubScreenHeader title="Vaccination Completion Form" goBackPath={"/vaccine"} />
    <ScrollView contentContainerStyle={{ flexGrow: 1}}>
        <View>
        <Text style={{ marginTop: 20, textAlign: 'center', fontSize: 22, fontWeight: 'bold', color: '#7360F2', paddingHorizontal: 20, marginBottom: 10 }}>{vaccine.name}</Text>
        </View>
        <View className="m-4 bg-white rounded-lg shadow-lg p-4 mb-2 rounded-2xl border-2 border-[#d3cdfb]">
        <View className="mb-4">
          <Text style={styles.label}>Batch No</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Enter Batch No"
            value={batchNo}
            onChangeText={setBatchNo}
          />
        </View>

        <View className="mb-4">
          <Text style={styles.label}>Vaccinated Date and Time</Text>
          <View className="flex flex-row justify-between">
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-[48%]"
            >
              <Text>
                {vaccinatedDate
                  ? vaccinatedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                  : 'DD/MM/YYYY'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-[48%]"
            >
              <Text>{vaccinatedTime ? vaccinatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '00:00'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={vaccinatedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={vaccinatedTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        <View className="mb-4">
          <Text style={styles.label}>Special Notes</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Add Special Notes"
            value={specialNotes}
            onChangeText={setSpecialNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity className="bg-[#7360F2] py-3 m-5 rounded-lg">
          <Text className="text-center text-white text-lg">Complete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  }
});

export default vaccinecompletionform;
