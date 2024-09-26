import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SubScreenHeader from '../../components/SubScreenHeader';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router'; // Assuming you're using expo-router for navigation

const SetReminder = () => {
  const [meals, setMeals] = useState([{ meal: 'A', time: '7:00 AM' }, { meal: 'B', time: '12:00 PM' }]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [notificationTimes, setNotificationTimes] = useState({
    '1 hour': false,
    '30 min': false,
    '15 min': false,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [newMealTime, setNewMealTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const router = useRouter(); // Use router for navigation

  // Request notification permissions
  useEffect(() => {
    const getNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };

    getNotificationPermission();
    loadReminders(); // Load saved reminders on mount
  }, []);

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const toggleNotificationTime = (time) => {
    setNotificationTimes({
      ...notificationTimes,
      [time]: !notificationTimes[time],
    });
  };

  const addMeal = () => {
    const formattedTime = newMealTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMeal = {
      meal: String.fromCharCode('A'.charCodeAt(0) + meals.length),
      time: formattedTime,
    };
    setMeals([...meals, newMeal]);
    setModalVisible(false);
  };

  const handleConfirm = (selectedDate) => {
    setShowTimePicker(false);
    setNewMealTime(selectedDate);
  };

  const scheduleNotification = async (meal, timeBeforeMeal) => {
    const now = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (const day of selectedDays) {
      const dayIndex = daysOfWeek.indexOf(day);
      const dayDifference = dayIndex - now.getDay();
      const nextDay = new Date(now);
      nextDay.setDate(now.getDate() + (dayDifference >= 0 ? dayDifference : 7 + dayDifference));

      const [hour, minute] = meal.time.split(':');
      nextDay.setHours(parseInt(hour), parseInt(minute), 0, 0);

      const notificationTime = new Date(nextDay.getTime() - timeBeforeMeal * 60 * 1000); // Subtract timeBeforeMeal in milliseconds

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Meal ${meal.meal}`,
          body: `It's time for Meal ${meal.meal}`,
        },
        trigger: {
          date: notificationTime,
          repeats: true,
        },
      });
    }
  };

  const handleSetReminder = async () => {
    for (const time of Object.keys(notificationTimes)) {
      if (notificationTimes[time]) {
        const timeBeforeMeal = parseInt(time.split(' ')[0]);
        for (const meal of meals) {
          await scheduleNotification(meal, timeBeforeMeal);
        }
      }
    }
    await saveReminders(); // Save the reminder settings to the file system
    router.push('/feeding/mealreminder'); // Navigate to mealreminder screen
  };

  const saveReminders = async () => {
    const reminders = {
      meals,
      selectedDays,
      notificationTimes,
    };

    const remindersJSON = JSON.stringify(reminders);
    await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'reminders.json', remindersJSON);
  };

  const loadReminders = async () => {
    const fileUri = FileSystem.documentDirectory + 'reminders.json';
    const fileExists = await FileSystem.getInfoAsync(fileUri);

    if (fileExists.exists) {
      const remindersJSON = await FileSystem.readAsStringAsync(fileUri);
      const savedReminders = JSON.parse(remindersJSON);
      setMeals(savedReminders.meals);
      setSelectedDays(savedReminders.selectedDays);
      setNotificationTimes(savedReminders.notificationTimes);
    }
  };

  const deleteMeal = (index) => {
    const updatedMeals = meals.filter((_, i) => i !== index);
    setMeals(updatedMeals);
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <SafeAreaView style={{ backgroundColor: '#ffffff', flex: 1 }}>
      <ScrollView className="flex-1 bg-white p-4">
        <SubScreenHeader title="Meal Reminder" goBackPath="/feeding/mealreminder" />

        {/* Meal Blocks */}
        <View className="flex-wrap flex-row justify-start mb-4 mt-4">
          {meals.map((meal, index) => (
            <View key={index} className="w-1/2 p-2">
              <View className="bg-gray-100 rounded-md p-4 relative">
                <Text className="text-lg font-bold">Meal {meal.meal}</Text>
                <Text className="text-sm">{meal.time}</Text>
                {/* Delete Icon */}
                <TouchableOpacity 
                  onPress={() => deleteMeal(index)}
                  style={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {/* Add Meal Button */}
          <TouchableOpacity onPress={() => setModalVisible(true)} className="w-1/2 p-2 justify-center items-center">
            <View className="bg-gray-200 rounded-md p-4 justify-center items-center">
              <Ionicons name="add-circle-outline" size={40} color="#7360f2" />
              <Text className="text-purple-600">Add Meal</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Notification Settings */}
        <View className="mb-4">
          <Text className="text-lg font-bold">Notification Settings</Text>
          {Object.keys(notificationTimes).map((time, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleNotificationTime(time)}
              className="flex-row items-center my-2"
            >
              <View
                className={`h-5 w-5 border-2 rounded-full mr-2 ${notificationTimes[time] ? 'border-purple-600 bg-purple-600' : 'border-gray-400'}`}
              />
              <Text className="text-base">{time} before meal</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Day Selection */}
        <View className="mb-4">
          <Text className="text-lg font-bold mb-2">Days</Text>
          <View className="flex-row flex-wrap">
            {daysOfWeek.map((day, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleDay(day)}
                className={`px-3 py-1 m-1 rounded-full border-2 ${
                  selectedDays.includes(day) ? 'border-purple-600 text-purple-600' : 'border-gray-400 text-gray-600'
                }`}
              >
                <Text>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Set Reminder Button */}
        <TouchableOpacity className="mt-4 py-3 bg-purple-600 rounded-md" onPress={handleSetReminder}>
          <Text className="text-center text-white text-lg">Set Reminder</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for Adding a Meal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={90} tint="dark" className="flex-1 justify-center items-center">
          <View className="w-3/4 bg-white p-6 rounded-lg">
            <Text className="text-lg font-bold mb-4">Add Meal Time</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} className="border-b-2 border-gray-300 mb-4 p-2">
              <Text>{newMealTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addMeal} className="mt-4 py-3 bg-purple-600 rounded-md">
              <Text className="text-center text-white text-lg">Add Meal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} className="mt-4 py-2">
              <Text className="text-center text-purple-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      {/* DateTimePickerModal */}
      <DateTimePickerModal
        isVisible={showTimePicker}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={() => setShowTimePicker(false)}
      />
    </SafeAreaView>
  );
};

export default SetReminder;
