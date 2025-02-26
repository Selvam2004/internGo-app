import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { axiosInstance } from "../../utils/axiosInstance";
import { ActivityIndicator } from "react-native-paper";
import ErrorPage from "../../components/error/Error";

export default function Help() {
  const [requests, setRequests] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "LOW",
    recepient: "Admins",
    recepientId: "",
  });
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const mentors = useSelector((state) => state.mentors?.mentors)?.map(
    (val) => val.name
  );
  const userId = useSelector((state) => state.auth?.data?.data?.userId);

  useEffect(() => {
    setLoading(true);
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get(`api/helpdesk/${userId}`);
      setRequests(response.data.data || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleError = () => {
    setLoading(true);
    setError(false);
    fetchRequests();
  };
  const showToast = (type, message) => {
    Toast.show({
      type,
      text1: "Help Request",
      text2: message,
      position: "top",
      swipeable: true,
      visibilityTime: 1500,
    });
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { subject, description, recepient, recepientId } = formData;
    if (!subject || !description) {
      showToast("error", "Please fill all details");
      return;
    }
    if (recepient === "Mentors" && !recepientId) {
      showToast("error", "Please choose a mentor");
      return;
    }
    try {
      await axiosInstance.post(`api/helpdesk/`, {
        userId,
        ...formData,
        resolvedStatus: "PENDING",
      });
      showToast("success", "Your request has been submitted");
      setModalVisible(false);
      fetchRequests();
      setFormData({
        subject: "",
        description: "",
        priority: "LOW",
        recepient: "Admins",
        recepientId: "",
      });
    } catch (err) {
      showToast("error", "Help request not submitted");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Help Requests</Text>
      {error ? (
        <ErrorPage onRetry={handleError} />
      ) : (
        <>
          {loading ? (
            <View
              style={{
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
                height: 600,
              }}
            >
              <ActivityIndicator />
              <Text style={{ textAlign: "center", fontWeight: "600" }}>
                Loading...
              </Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.buttonText}>Create Help Request</Text>
              </TouchableOpacity>

              <FlatList
                data={requests}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item: request }) => (
                  <View key={request?.id} style={styles.card}>
                    <Text style={styles.subject}>{request?.subject}</Text>
                    <Text style={styles.description}>
                      {request?.description}
                    </Text>
                    <Text style={styles.details}>
                      <Text style={styles.boldText}>Priority:</Text>{" "}
                      {request?.priority}
                    </Text>
                    <Text style={styles.details}>
                      <Text style={styles.boldText}>Raised To:</Text>{" "}
                      {request?.recepient == "Admins" ? "Admin" : "Mentor"}
                    </Text>
                    {request?.recepient === "Mentors" && (
                      <Text style={styles.details}>
                        <Text style={styles.boldText}>Mentor:</Text>{" "}
                        {request?.recepientId || "Not available"}
                      </Text>
                    )}

                    <View style={styles.switchContainer}>
                      <Text style={styles.statusText}>
                        Status:{" "}
                        <Text
                          style={{
                            color:
                              request?.resolvedStatus == "PENDING"
                                ? "red"
                                : "green",
                          }}
                        >
                          {request?.resolvedStatus}
                        </Text>
                      </Text>
                    </View>
                  </View>
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
              />
            </>
          )}
        </>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <Toast />
          <View style={styles.modalContent}>
            <Text style={styles.header}>Create Help Request</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter subject"
              value={formData.subject}
              onChangeText={(value) => handleChange("subject", value)}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(value) => handleChange("description", value)}
            />
            <View
              style={{
                borderWidth: 1,
                borderRadius: 5,
                borderColor: "lightgray",
                marginBottom: 15,
              }}
            >
              <Picker
                selectedValue={formData.priority}
                onValueChange={(value) => handleChange("priority", value)}
                mode="dropdown"
              >
                <Picker.Item label="LOW" value="LOW" />
                <Picker.Item label="MEDIUM" value="MEDIUM" />
                <Picker.Item label="HIGH" value="HIGH" />
              </Picker>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderRadius: 5,
                borderColor: "lightgray",
                marginBottom: 15,
              }}
            >
              <Picker
                selectedValue={formData.recepient}
                onValueChange={(value) => handleChange("recepient", value)}
                mode="dropdown"
              >
                <Picker.Item label="Admin" value="Admins" />
                <Picker.Item label="Mentor" value="Mentors" />
              </Picker>
            </View>
            {formData.recepient === "Mentors" && (
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: "lightgray",
                }}
              >
                <Picker
                  selectedValue={formData.recepientId}
                  onValueChange={(value) => handleChange("recepientId", value)}
                  mode="dropdown"
                >
                  <Picker.Item
                    label="Select mentor"
                    color="gray"
                    value=""
                    enabled={false}
                  />
                  {mentors.map((mentor, index) => (
                    <Picker.Item key={index} label={mentor} value={mentor} />
                  ))}
                </Picker>
              </View>
            )}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  createButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#007BFF",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subject: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
    color: "#000",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 4,
    padding: 15,
    marginBottom: 15,
  },
  textArea: { height: 100 },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
});
