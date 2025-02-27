import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Checkbox, Button } from "react-native-paper";
import ErrorPage from "../../components/error/Error";
import { axiosInstance } from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import  InteractionCard from "../../components/interactions/InteractionCard";

export default function Interactions() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const { userId } = useSelector((state) => state.auth.data?.data);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);

  const fetchInteractions = async () => {
    try {
      setError(false);
      const response = await axiosInstance.post(`/api/interactions/${userId}`, {
        interactionStatus: selectedStatus,
        date: selectedDate.toString(),
      });
      setInteractions(response.data.data?.data || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    fetchInteractions();
  };

  useEffect(() => {
    setLoading(true);
    fetchInteractions();
  }, []);

  const toggleStatus = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };
  const handleError = () => {
    setLoading(true);
    fetchInteractions();
  };

  const handleFilter = () => {
    setLoading(true);
    fetchInteractions();
    setModalVisible(false);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      showsVerticalScrollIndicator={false}
      style={styles.container}
    >
      {error ? (
        <ErrorPage onRetry={handleError} />
      ) : (
        <>
          <Text style={styles.header}>Interactions</Text>
          <TouchableOpacity
            style={styles.filterBadge}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.filterBadgeText}>Filters</Text>
          </TouchableOpacity>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator />
              <Text>Loading...</Text>
            </View>
          ) : interactions.length > 0 ? (
            <View style={{ paddingBottom: 30 }}>
              {interactions.map((intr) => (
                <InteractionCard key={intr.id} interaction={intr} />
              ))}
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No Interactions Available</Text>
            </View>
          )}
        </>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Filter Interactions</Text>
            <Text style={styles.label}>Select Status:</Text>
            <Checkbox.Item
              label="Completed"
              color="#007BFF"
              status={
                selectedStatus.includes("COMPLETED") ? "checked" : "unchecked"
              }
              onPress={() => toggleStatus("COMPLETED")}
            />
            <Checkbox.Item
              label="Pending"
              color="#007BFF"
              status={
                selectedStatus.includes("PENDING") ? "checked" : "unchecked"
              }
              onPress={() => toggleStatus("PENDING")}
            />
            <Checkbox.Item
              label="Feedback Pending"
              color="#007BFF"
              status={
                selectedStatus.includes("FEEDBACK_PENDING")
                  ? "checked"
                  : "unchecked"
              }
              onPress={() => toggleStatus("FEEDBACK_PENDING")}
            />

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text style={styles.datePickerText}>
                {selectedDate ? selectedDate : "Select Date"}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={datePickerVisible}
              mode="date"
              onConfirm={(date) => {
                setSelectedDate(date.toISOString().split("T")[0]);
                setDatePickerVisible(false);
              }}
              onCancel={() => setDatePickerVisible(false)}
            />

            <View style={styles.modalButtonContainer}>
              <Button
                mode="outlined"
                textColor="#007BFF"
                onPress={() => {
                  setSelectedStatus([]);
                  setSelectedDate("");
                }}
              >
                Clear
              </Button>
              <Button
                mode="outlined"
                textColor="#007BFF"
                onPress={() => setModalVisible(false)}
              >
                Close
              </Button>
              <Button
                mode="contained"
                buttonColor="#007BFF"
                onPress={handleFilter}
              >
                Apply
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 20, marginBottom: 10, fontWeight: "bold" },
  filterBadge: {
    backgroundColor: "#007BFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  filterBadgeText: { color: "#fff", fontWeight: "bold" },
  loaderContainer: {
    justifyContent: "center",
    flexDirection:'row',
    height: 500,
    alignItems: "center",
  },
  noDataContainer: { height: 500, justifyContent: "center" },
  noDataText: { fontSize: 15, fontWeight: "400", textAlign: "center" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  modalHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  label: { fontSize: 16, marginBottom: 5 },
  datePickerButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  datePickerText: { fontSize: 16 },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
