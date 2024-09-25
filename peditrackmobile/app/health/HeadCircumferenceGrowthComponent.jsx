import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

const HeadCircumferenceGrowthComponent = ({ data }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newRecord, setNewRecord] = useState({
    recordName: "",
    date: "",
    headCircumference: "",
  });

  // Function to handle adding new record
  const handleAddRecord = () => {
    console.log("New Record Added:", newRecord);
    setIsModalVisible(false); // Close modal after adding
  };

  // Record card component to display each head circumference record
  const RecordCard = ({ record }) => (
    <View style={styles.recordCard}>
      <Text style={styles.recordName}>{record.recordName}</Text>
      <View style={styles.recordRow}>
        <Text style={styles.recordValue}>{record.circumference} cm</Text>
        <Text style={styles.recordAge}>Age: {record.age}</Text>
        <Text style={styles.recordDate}>{record.date}</Text>
      </View>
      <Text style={styles.recordRemarks}>Remarks: {record.remarks}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.headerTitle}>Head Circumference Growth</Text>
      <Text style={styles.warningText}>🔴 Only measure when needed</Text>

      {/* Display each record */}
      {data.map((record, index) => (
        <RecordCard key={index} record={record} />
      ))}

      {/* Add New Record Button */}
      <TouchableOpacity
        style={styles.addRecordButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addRecordButtonText}>Add New Record</Text>
      </TouchableOpacity>

      {/* Modal for adding new head circumference record */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Circumference</Text>

            {/* Record Name Input */}
            <Text style={styles.modalLabel}>Record Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter record name"
              value={newRecord.recordName}
              onChangeText={(text) =>
                setNewRecord({ ...newRecord, recordName: text })
              }
            />

            {/* Date Input */}
            <Text style={styles.modalLabel}>Date</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter date"
              value={newRecord.date}
              onChangeText={(text) =>
                setNewRecord({ ...newRecord, date: text })
              }
            />

            {/* Head Circumference Input */}
            <Text style={styles.modalLabel}>Head Circumference (cm)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter head circumference"
              keyboardType="decimal-pad"
              value={newRecord.headCircumference}
              onChangeText={(text) =>
                setNewRecord({ ...newRecord, headCircumference: text })
              }
            />

            {/* Add Button */}
            <TouchableOpacity
              style={styles.addButtonModal}
              onPress={handleAddRecord}
            >
              <Text style={styles.addButtonTextModal}>Add</Text>
            </TouchableOpacity>

            {/* Close Modal */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    width: screenWidth,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6256B1",
    marginBottom: 10,
    alignSelf: "flex-start", // Left align title
  },
  warningText: {
    fontSize: 14,
    color: "red",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  recordCard: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  recordName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6256B1",
    marginBottom: 8,
  },
  recordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  recordValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  recordAge: {
    fontSize: 16,
    color: "#777",
  },
  recordDate: {
    fontSize: 16,
    color: "#777",
  },
  recordRemarks: {
    fontSize: 14,
    color: "#777",
  },
  addRecordButton: {
    backgroundColor: "#6256B1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addRecordButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  viewBMIButton: {
    backgroundColor: "#6256B1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  viewBMIButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6256B1",
    marginBottom: 20,
    alignSelf: "flex-start", // Left align title
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  modalInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  addButtonModal: {
    backgroundColor: "#6256B1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonTextModal: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6256B1",
  },
});

export default HeadCircumferenceGrowthComponent;
