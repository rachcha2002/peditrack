import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator ,TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';  // Import NetInfo for checking internet connection
import { collection, getDocs } from 'firebase/firestore';  // Firestore imports
import { db } from '../../lib/firebase';  // Firestore instance
import SubScreenHeader from '../../components/SubScreenHeader';  // SubScreenHeader component
import MealCard from '../../components/MealCard';  // MealCard component
import { router } from 'expo-router';

const MealBank = () => {
  const [meals, setMeals] = useState([]);  // State to hold fetched meals
  const [loading, setLoading] = useState(true);  // State for loading indicator
  const [isConnected, setIsConnected] = useState(null);  // State for checking internet connection

  // Check internet connection and fetch meals from Firestore
  useEffect(() => {
    const checkConnectionAndFetchMeals = async () => {
      // Check the network connection status
      const netInfo = await NetInfo.fetch();
      setIsConnected(netInfo.isConnected);

      if (netInfo.isConnected) {
        try {
          const mealCollection = collection(db, 'mealbank');  // Reference to the mealbank collection
          const mealSnapshot = await getDocs(mealCollection);  // Fetch documents from the collection
          // Extract data and document ID from each document
          const mealList = mealSnapshot.docs.map(doc => ({
            id: doc.id,  // Get document ID
            ...doc.data()  // Get document data
          }));
          setMeals(mealList);  // Update state with fetched meals
        } catch (error) {
          console.error('Error fetching meals:', error);
        }
      }
      setLoading(false);  // Set loading to false whether there's an internet connection or not
    };

    checkConnectionAndFetchMeals();
  }, []);  // Empty dependency array means this runs once when the component mounts

  // If loading is true, display the spinner
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6B46C1" />
      </SafeAreaView>
    );
  }

  // If there is no internet connection, display a message
  if (isConnected === false) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>No internet connection. Please check your connection and try again.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: '#ffffff', flex: 1 }}>
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* SubScreenHeader ensures all text is inside <Text> */}
        <SubScreenHeader title="Meal Bank" goBackPath={'/feeding'} />

        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>Suggestions</Text>
          {/* Loop through fetched meals and render MealCard for each */}
          {meals.map((meal) => (

            <TouchableOpacity onPress={()=>{router.push(`/feeding/${meal.id}`)}}>
            <MealCard key={meal.id} meal={meal} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>Trending</Text>
          {/* Optionally filter for trending meals and render */}
          {meals.slice(0, 3).map((meal) => (
            <TouchableOpacity onPress={()=>{router.push(`/feeding/${meal.id}`)}}>
            <MealCard key={meal.id} meal={meal} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MealBank;
