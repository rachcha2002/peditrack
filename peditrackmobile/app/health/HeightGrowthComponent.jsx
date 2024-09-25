import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const HeightGrowthComponent = ({ data }) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [newHeight, setNewHeight] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("September");
  const [date, setDate] = useState("");
  const [selectedPoint, setSelectedPoint] = useState(null); // State for selected chart point

  // Safeguard for the `data` prop to handle empty or undefined data
  const getChartData = () => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
          },
        ],
      };
    }

    return {
      labels: data.map((item) => item.month), // X-axis labels (months)
      datasets: [
        {
          data: data.map((item) => item.height), // Y-axis values (heights)
          strokeWidth: 2, // Line thickness
        },
      ],
    };
  };

  // Function to handle adding new height record
  const handleAddHeight = () => {
    console.log("New Height Added:", newHeight, date, selectedMonth);
    setIsModalVisible(false); // Close modal after adding
  };

  // Function to handle data point click with safety checks
  const handleDataPointClick = (data) => {
    if (
      !data ||
      !data.datasets ||
      !data.datasets[0] ||
      !data.datasets[0].data
    ) {
      return; // Safeguard to ensure data exists
    }

    const pointIndex = data.index;
    if (pointIndex < 0 || pointIndex >= data.datasets[0].data.length) {
      return; // Ensure the index is valid
    }

    const selectedData = data.datasets[0].data[pointIndex];
    const selectedMonth = getChartData().labels[pointIndex];

    setSelectedPoint({
      height: selectedData,
      month: selectedMonth,
    });

    setIsModalVisible(true); // Show modal with point details
  };

  // Component to render data cards for "Last Month" and "This Month"
  const DataCard = ({
    title,
    value,
    date,
    status,
    isAddButton,
    onAddPress,
  }) => (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardDate}>{date}</Text>
      {status && <Text style={styles.cardStatus}>{status}</Text>}
      {isAddButton && (
        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View>
      {/* Chart */}
      <View style={styles.chartContainer}>
        <LineChart
          data={getChartData()}
          width={screenWidth * 0.9} // from react-native
          height={220}
          yAxisSuffix=" cm"
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(98, 86, 177, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#6256B1",
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          onDataPointClick={handleDataPointClick} // Trigger modal on point click
        />

        {/* Data Cards */}
        <View style={styles.dataCardContainer}>
          <DataCard
            title="Last Month Height"
            value="60 cm"
            date="25 Aug 2024"
            status="Normal"
          />
          <DataCard
            title="This Month Height"
            value="Pending"
            date="25 Sep 2024"
            isAddButton
            onAddPress={() => setIsModalVisible(true)} // Open modal on press
          />
        </View>

        {/* View Records Button */}
        <TouchableOpacity style={styles.viewRecordsButton}>
          <Text style={styles.viewRecordsButtonText}>View Height Records</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for selected data point */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Height Details</Text>

            {selectedPoint ? (
              <>
                <Text style={styles.modalLabel}>
                  Month: {selectedPoint.month}
                </Text>
                <Text style={styles.modalLabel}>
                  Height: {selectedPoint.height} cm
                </Text>
              </>
            ) : (
              <Text>No data selected</Text>
            )}

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
  chartContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  dataCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    marginTop: 20,
  },
  cardContainer: {
    width: "45%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6256B1",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: "#777",
    marginBottom: 8,
  },
  cardStatus: {
    fontSize: 12,
    color: "green",
  },
  addButton: {
    backgroundColor: "#6256B1",
    width: 30,
    height: 30,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  viewRecordsButton: {
    backgroundColor: "#6256B1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  viewRecordsButtonText: {
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
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
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

export default HeightGrowthComponent;
