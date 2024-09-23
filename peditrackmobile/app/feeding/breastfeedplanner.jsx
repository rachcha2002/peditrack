import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker
import * as Notifications from 'expo-notifications';  
import SubScreenHeader from '../../components/SubScreenHeader';
import { Asset } from 'expo-asset';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const BreastFeedPlanner = () => {
  const [sessions, setSessions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [sessionTime, setSessionTime] = useState(new Date());
  const [sessionSide, setSessionSide] = useState('');
  const [sessionDuration, setSessionDuration] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false); // Control visibility of time picker
  const customsound = Asset.fromModule(require('../../assets/tones/hp.wav')).uri;

  const [bellStates, setBellStates] = useState({});

  const scheduleNotification = async (session) => {
    const triggerDate = session.time; 

    if (triggerDate <= new Date()) {
      console.error('Trigger date must be in the future.');
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Breastfeeding Reminder: Feed ${session.id}`,
          body: `It's time to breastfeed on the ${session.side} side for ${session.duration} minutes.`,
          sound: customsound,
        },
        trigger: { date: triggerDate },
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const addSession = () => {
    const currentDate = new Date(); 
    let scheduledTime = new Date(sessionTime); 

    scheduledTime.setFullYear(currentDate.getFullYear());
    scheduledTime.setMonth(currentDate.getMonth());
    scheduledTime.setDate(currentDate.getDate());

    if (scheduledTime <= currentDate) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const newSession = {
      id: sessions.length + 1,
      time: scheduledTime, 
      side: sessionSide,
      duration: sessionDuration,
    };

    setSessions([...sessions, newSession]);

    scheduleNotification(newSession);

    setModalVisible(false); 
  };

  // Handle when the time is selected
  const onChangeTime = (event, selectedDate) => {
    setShowTimePicker(false); 
    const currentDate = selectedDate || sessionTime;
    setSessionTime(currentDate);
  };

  const toggleBell = (sessionId) => {
    setBellStates((prevState) => ({
      ...prevState,
      [sessionId]: !prevState[sessionId],
    }));
  };

  const deleteSession = (sessionId) => {
    setSessions(sessions.filter((session) => session.id !== sessionId));
  };

  const renderRadioButton = (label) => (
    <TouchableOpacity
      onPress={() => setSessionSide(label)}
      className="flex-row items-center mb-2"
    >
      <View className={`h-5 w-5 rounded-full border-2 mr-2 ${sessionSide === label ? 'border-purple-600 bg-purple-600' : 'border-gray-400'}`} />
      <Text>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="bg-white flex-1">
      <SubScreenHeader title="Breastfeeding Planner" goBackPath="/feeding" />
      <View className="flex-1 p-4">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1">
            {sessions.length === 0 ? (
              <View className="flex-1 justify-center items-center">
                <Text className="text-center text-gray-500">No Sessions Added</Text>
              </View>
            ) : (
              sessions.reduce((resultArray, item, index) => {
                const chunkIndex = Math.floor(index / 2);
                if (!resultArray[chunkIndex]) {
                  resultArray[chunkIndex] = [];
                }
                resultArray[chunkIndex].push(item);
                return resultArray;
              }, []).map((row, rowIndex) => (
                <View key={rowIndex} className="flex-row -mx-1 mb-2">
                  {row.map((session) => (
                    <View key={session.id} className="w-1/2 px-1">
                      <View className="bg-gray-100 rounded-md p-4">
                        <View className="flex-row justify-between">
                          <Text className="text-lg font-bold">Feed {session.id}</Text>
                          <TouchableOpacity onPress={() => toggleBell(session.id)}>
                            <Ionicons
                              name={bellStates[session.id] ? 'notifications' : 'notifications-outline'}
                              size={24}
                              color={bellStates[session.id] ? '#7360f2' : 'black'}
                            />
                          </TouchableOpacity>
                        </View>
                        <Text className="text-sm">Time: {session.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        <Text className="text-sm">Side: {session.side}, Duration: {session.duration} min</Text>
                        <View className="flex-row mt-2 space-x-2">
                          <TouchableOpacity className="flex-1 bg-purple-200 rounded-md py-1 px-2">
                            <Text className="text-purple-600 text-center">Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => deleteSession(session.id)}
                            className="flex-1 bg-red-200 rounded-md py-1 px-2"
                          >
                            <Text className="text-red-600 text-center">Delete</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-5 left-5 right-5 bg-purple-600 rounded-md py-3 flex-row justify-center items-center"
      >
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text className="text-white text-lg ml-2">Add Sessions</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={90} tint="dark" className="flex-1 justify-center items-center">
          <View className="w-3/4 bg-white p-6 rounded-lg">
            <Text className="text-lg font-bold mb-4">Add Breastfeeding Session</Text>

            {/* Time Picker */}
            <TouchableOpacity onPress={() => setShowTimePicker(true)} className="border-b-2 border-gray-300 mb-4 p-2">
              <Text>{sessionTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={sessionTime}
                mode="time"
                display="default"
                onChange={onChangeTime}
              />
            )}

            <Text className="font-bold mb-2">Select Side:</Text>
            {renderRadioButton('Left')}
            {renderRadioButton('Right')}

            <TextInput
              placeholder="Enter Duration (min)"
              value={sessionDuration}
              onChangeText={setSessionDuration}
              keyboardType="numeric"
              className="border-b-2 border-gray-300 mb-4 p-2"
            />

            <TouchableOpacity onPress={addSession} className="mt-4 py-3 bg-purple-600 rounded-md">
              <Text className="text-center text-white text-lg">Add Session</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} className="mt-4 py-2">
              <Text className="text-center text-purple-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
};

export default BreastFeedPlanner;
