import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import SubScreenHeader from "../../components/SubScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const upcomingvaccinedetails = () => {
    const route = useRoute();
    const { vaccine } = route.params;
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const navigation = useNavigation();

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    const onChangeTime = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(false);
        setTime(currentTime);
    };

    return (
        <SafeAreaView className="bg-white h-full">
            <SubScreenHeader title="Upcoming Vaccines" goBackPath={"vaccination/upcomingvaccinelist"} />
            <View>
                <Text style={styles.header}>{vaccine.name}</Text>
            </View>
            <View style={styles.card}>
                <Image
                    source={vaccine.image}
                    style={styles.image}
                />
                <Text style={styles.desc}>
                    {vaccine.description}
                </Text>
                <View style={styles.detailsContainer}>
                    <Text style={styles.label}>
                        Appointment Date: <Text style={styles.value}>{date.toDateString()}</Text>
                    </Text>
                    <Text style={styles.label}>
                        Appointment Time: <Text style={styles.value}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </Text>
                </View>
                <Text style={styles.change}>Change Date and Time</Text>
                <View style={styles.detailsContainer}>
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} >
                            <Text style={styles.value}>{date.toDateString()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.changeButton}>
                            <Text style={styles.buttonText}>Change Date</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                            <Text style={styles.value}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.changeButton}>
                            <Text style={styles.buttonText}>Change Time</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Date and Time Pickers */}
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                    />
                )}
                {showTimePicker && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        display="default"
                        onChange={onChangeTime}
                    />
                )}

                {/* Complete Vaccine Button */}
                <TouchableOpacity style={styles.completeButton} onPress={() => navigation.navigate('vaccinecompletionform', { vaccine })}>
                    <Text style={styles.completeButtonText}>Complete Vaccine</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        margin: 10,
        alignItems: 'center',
    },
    header: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        color: '#7360F2',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 240,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    detailsContainer: {
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    desc: {
        textAlign: 'center',
        fontSize: 18,
        color: '#555',
        marginTop: 10,
        marginBottom: 20,
    },
    change: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7360F2',
        marginBottom: 10, textAlign: 'left',
        width: '100%',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        width: '80%',
    },
    value: {
        marginLeft: 10,
        fontSize: 18,
        color: '#555',
    },
    changeButton: {
        backgroundColor: '#7360F2',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    completeButton: {
        backgroundColor: '#7360F2',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    completeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
export default upcomingvaccinedetails
