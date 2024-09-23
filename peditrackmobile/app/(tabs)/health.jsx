import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Button, View, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system'; // Import expo-file-system
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo for network detection
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // Your Firestore configuration file

// Define the path to the local file
const filePath = `${FileSystem.documentDirectory}healthRecords.json`;

export default function Health() {
  const [name, setName] = useState('');
  const [remark, setRemark] = useState('');
  const [isConnected, setIsConnected] = useState(true); // Network connection state

  // Check network connectivity on mount
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      console.log(`Network is ${state.isConnected ? 'online' : 'offline'}`);
    });

    return () => unsubscribe();
  }, []);

  // Function to add health record locally and to Firestore if online
  const addData = async () => {
    if (name.trim() === '' || remark.trim() === '') {
      Alert.alert('Validation Error', 'Please enter both name and remark');
      return;
    }

    const newRecord = {
      name,
      remark,
      createdAt: new Date().toISOString(),
      synced: false, // Mark as unsynced initially
    };

    try {
      // Read existing records from the file
      let records = [];
      const fileExists = await FileSystem.getInfoAsync(filePath);
      if (fileExists.exists) {
        const fileContent = await FileSystem.readAsStringAsync(filePath);
        records = JSON.parse(fileContent);
      }

      // Add the new record to the existing records
      records.push(newRecord);

      // Save the updated records back to the file
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(records));

      // If connected, attempt to sync the new record to Firestore
      if (isConnected) {
        await syncWithFirestore(records);
      } else {
        Alert.alert('Offline', 'You are offline. Record saved locally and will sync when you are back online.');
      }

      // Clear form fields
      setName('');
      setRemark('');
    } catch (error) {
      console.error('Error adding health record:', error);
      Alert.alert('Error', `Failed to add the record: ${error.message}`);
    }
  };

  // Function to sync all unsynced records with Firestore
  const syncWithFirestore = async (records) => {
    try {
      const unsyncedRecords = records.filter(record => !record.synced);

      if (unsyncedRecords.length === 0) {
        return; // No unsynced records, skip sync
      }

      for (const record of unsyncedRecords) {
        if (!record.synced) {
          const docRef = await addDoc(collection(db, 'healthRecords'), {
            name: record.name,
            remark: record.remark,
            createdAt: record.createdAt,
          });
          console.log(`Record synced successfully with Firestore. Document ID: ${docRef.id}`);
          // Mark as synced in local storage
          record.synced = true;
        }
      }

      // Save the updated records with "synced" status back to the file
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(records));
      Alert.alert('Sync Success', 'Unsynced records have been synced with Firestore');
    } catch (error) {
      console.error('Error syncing with Firestore:', error);
      Alert.alert('Error', `Failed to sync records with Firestore: ${error.message}`);
    }
  };

  // Sync unsynced data whenever network is restored
  useEffect(() => {
    const syncDataIfNeeded = async () => {
      if (isConnected) {
        try {
          const fileExists = await FileSystem.getInfoAsync(filePath);
          if (fileExists.exists) {
            const fileContent = await FileSystem.readAsStringAsync(filePath);
            const records = JSON.parse(fileContent);
            const unsyncedRecords = records.filter(record => !record.synced);

            if (unsyncedRecords.length > 0) {
              console.log('Unsynced records found. Attempting to sync...');
              await syncWithFirestore(records);
            }
          }
        } catch (error) {
          console.error('Error syncing data when connected:', error);
        }
      }
    };

    syncDataIfNeeded();
  }, [isConnected]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Remark"
        value={remark}
        onChangeText={setRemark}
      />
      <Button title="Add Health Record" onPress={addData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
});
