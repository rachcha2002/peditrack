import { View, Text, TouchableOpacity, ScrollView, ImageBackground, StyleSheet, } from 'react-native';
import React from 'react'
import { images } from '../../constants';
import { SafeAreaView } from "react-native-safe-area-context";
import MainHeader from '../../components/MainHeader';
import { Svg, Circle } from 'react-native-svg';
import { useWindowDimensions } from 'react-native';
import { router } from 'expo-router';

const vaccine = () => {
  const { width } = useWindowDimensions();
  const circleSize = width * 0.3;
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="flex-1 bg-white">
        <MainHeader title="Vaccination Routine" />
        <View className="flex-1 p-3 ">
          <View className="bg-white rounded-lg shadow-lg px-4 mb-2 rounded-2xl border-2 border-[#7360F2]">
            <Text className="text-lg text-[#7360F2] text-center font-bold mb-2">Current Progress</Text>
            <View className="flex-row items-center justify-between mb-1">
              <Text style={{ fontSize:15}} className="text-sm text-[#7360F2] text-center font-bold">
                Previous Vaccine{"\n"}JE 
              </Text>
              <View className="flex-1 items-center">
                <Svg width={circleSize} height={circleSize}>
                  <Circle
                    cx={circleSize / 2}
                    cy={circleSize / 2}
                    r={circleSize / 2 - 10}
                    stroke="#776acc"
                    strokeWidth="15"
                  />
                  <Circle
                    cx={circleSize / 2}
                    cy={circleSize / 2}
                    r={circleSize / 2 - 10}
                    strokeWidth="10"
                    fill="#ffffff"
                    strokeDasharray="251.2"
                    strokeDashoffset="150"
                    strokeLinecap="round"
                    rotation="270"
                    origin={`${circleSize / 2}, ${circleSize / 2}`}
                  />
                  <Text className="inset-0 text-center text-[#7360F2] text-lg font-bold" style={{ fontSize:30, lineHeight: circleSize }}>
                    40%
                  </Text>
                </Svg>
              </View>
              <Text style={{ fontSize:15}} className="text-sm text-[#7360F2] text-center font-bold">
                Next Vaccine{"\n"}MMR (1st Dose)
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.pcontainer}>
          <TouchableOpacity style={styles.pcard}
            onPress={() => router.push("vaccination/upcomingvaccinelist")}>
            <ImageBackground
              source={images.Upcoming}
              style={styles.pcardImage}
              resizeMode="cover"
            >
              <View style={styles.ptextContainer}>
                <Text style={styles.pcardTitle}>Upcoming{"\n"} Vaccines</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pcard}
            onPress={() => router.push("vaccination/completedvaccinelist")}>
            <ImageBackground
              source={images.completed}
              style={styles.pcardImage}
              resizeMode="cover"
            >
              <View style={styles.ptextContainer}>
                <Text style={styles.pcardTitle}>Completed{"\n"} Vaccines</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  pcontainer: {
    width: "98%",
    marginLeft:3,
    padding:8
  },
  pcard: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pcardImage: {
    width: "100%",
    height: 190,
  },
  ptextContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
  },
  pcardTitle: {
    height: "100%",
    fontSize: 57,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default vaccine