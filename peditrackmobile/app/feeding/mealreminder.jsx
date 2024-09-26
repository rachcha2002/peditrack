import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import SubScreenHeader from '../../components/SubScreenHeader';
import { router } from 'expo-router'; // Direct import of router

const MealReminders = () => {
  const [reminders, setReminders] = useState(null);

  // Load reminders from the file system
  useEffect(() => {
    const loadReminders = async () => {
      const fileUri = FileSystem.documentDirectory + 'reminders.json';
      const fileExists = await FileSystem.getInfoAsync(fileUri);

      if (fileExists.exists) {
        const remindersJSON = await FileSystem.readAsStringAsync(fileUri);
        const savedReminders = JSON.parse(remindersJSON);
        setReminders(savedReminders);
      }
    };

    loadReminders();
  }, []);

  if (!reminders) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
         <SubScreenHeader  goBackPath={'/feeding'} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No meal reminders found.</Text>
        </View>
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            onPress={() => router.push('/feeding/setreminder')} // Directly use router.push
            style={{ backgroundColor: '#7360f2', padding: 12, borderRadius: 8 }}>
            <Text style={{ textAlign: 'center', color: '#ffffff', fontSize: 16 }}>Add Reminder</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Render each meal
  const renderMealReminder = ({ item, index }) => (
    <View key={index} style={{ padding: 16, margin: 8, backgroundColor: '#ffffff', borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Meal {item.meal}</Text>
      <Text style={{ fontSize: 14 }}>Time: {item.time}</Text>
      <Text style={{ fontSize: 14 }}>Notification Times: {getNotificationTimesString(reminders.notificationTimes)}</Text>
      <Text style={{ fontSize: 14 }}>Days: {reminders.selectedDays.join(', ')}</Text>
      {/* Edit Button */}
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/feeding/setreminder', params: { editMode: true, meal: item, index } })} // Directly use router.push
        style={{ marginTop: 10, padding: 10, backgroundColor: '#7360f2', borderRadius: 6, width: '50%' }}>
        <Text style={{ textAlign: 'center', color: '#ffffff' }}>Edit Reminder</Text>
      </TouchableOpacity>
    </View>
  );

  // Convert notification times object to a string
  const getNotificationTimesString = (notificationTimes) => {
    return Object.keys(notificationTimes)
      .filter(time => notificationTimes[time])
      .join(', ');
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#ffffff', flex: 1 }}>
      <SubScreenHeader goBackPath={'/feeding'} />
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Meal Reminders</Text>
      </View>

      <FlatList
        data={reminders.meals}
        renderItem={renderMealReminder}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Add a button to go to SetReminder screen */}
      <View style={{ padding: 16 }}>
        <TouchableOpacity
          onPress={() => router.push('/feeding/setreminder')} // Directly use router.push
          style={{ backgroundColor: '#7360f2', padding: 12, borderRadius: 8 }}>
          <Text style={{ textAlign: 'center', color: '#ffffff', fontSize: 16 }}>Add Reminder</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MealReminders;
