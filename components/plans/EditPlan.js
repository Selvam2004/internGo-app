import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView
} from "react-native";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance"; 
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";

export default function EditPlan({ plan }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDateVisible, setIsDateVisible] = useState(false); 

  const [planDetails, setPlanDetails] = useState({});
  const [currentField, setCurrentField] = useState("startDate");

  const showToast = (state, message) => {
    Toast.show({
      type: state,
      text1: "Plan Edit",
      text2: message,
      position: "top",
      swipeable: true,
      visibilityTime: 1500,
    });
  };

  const handleDateConfirm = (date) => {
    if (currentField == "startDate" && Number(fields.planDays) > 0) {
      const endDate = new Date(date);
      endDate.setDate(new Date(date).getDate() + fields.planDays);
      setFields({
        ...fields,
        endDate: endDate.toISOString().split("T")[0],
        startDate: date.toISOString().split("T")[0],
      });
    } else {
      const formattedDate = date.toISOString().split("T")[0];
      setFields({ ...fields, [currentField]: formattedDate });
    }
    setIsDateVisible(false);
  };
  const handleDateOpen = (field) => {
    setCurrentField(field);
    setIsDateVisible(true);
  };

  const [fields, setFields] = useState({});
  useEffect(() => {
    setPlanDetails({
      ...plan,
      startDate: plan.startDate?.split("T")[0],
      endDate: plan.endDate?.split("T")[0],
    });
    setFields({
      ...plan,
      startDate: plan.startDate?.split("T")[0],
      endDate: plan.endDate?.split("T")[0],
    });
  }, [plan]);

  const handleChange = (key, value) => {
    setFields({ ...fields, [key]: value });
  };
  const handleEdit = () => {
    setModalVisible(true);
  };
  const handleSave = () => {
    let isValid = true; 
    
    if (Number(fields.planDays) > 180 || Number(fields.planDays) < 1) {
      showToast("error", "*Please Enter Days between 1 to 180");
      return;
    } else if (
      ((new Date(fields.endDate) - new Date(fields.startDate)) /
        (1000 * 60 * 60 * 24)) <
      0
    ) {
      showToast("error", "End date must be after start date");
      return;
    } else if (
      (new Date(fields.endDate) - new Date(fields.startDate)) /
        (1000 * 60 * 60 * 24) >
      fields.planDays
    ) {
      showToast("error", "End Date cannot exceed Plan days");
      return;
    }
    Object.keys(fields).forEach((key) => { 
        if (
          !fields[key] ||
          (typeof fields[key] === "string" && fields[key].trim() === "")
        ) {
          isValid = false;
        }
      
    });
    if (isValid) {
      handleSubmit();
    } else {
      showToast("error", "Enter all details");
    }
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    try { 
      const response = await axiosInstance.patch(
        `/api/plans/${plan.id}/update`,
        {
          name: fields.name,
          planDays: Number(fields.planDays),
          description: fields.description,
          startDate: fields.startDate,
          endDate: fields.endDate
        }
      );
      if (response) { 
        setPlanDetails(fields);
        setModalVisible(false);
      }
    } catch (err) {
      const msg =
      JSON.stringify(err.response.data.message) || "Plan details not updated";
      showToast("error", msg);
    }
  };
  return (
    <>
      <View style={styles.planHeader}>
        <View
          style={[
            styles.planDetailItem,
            { alignItems: "flex-end", marginBottom: 7 },
          ]}
        >
          <View style={{ flexDirection: "row", flex: 6 }}>
            <Text style={styles.planDetailLabel}>Plan Name:</Text>
            <Text style={{ flex: 4 }}>
              {planDetails.name || "Not Available"}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.editButton, { flexDirection: "row", flex: 1 }]}
            onPress={handleEdit}
          >
            <Icon name="edit" style={styles.editIcon} size={18} color="white" />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.planDetailItem}>
          <Text style={styles.planDetailLabel}>Total Days:</Text>
          <Text style={styles.planDetailValue}>
            {planDetails.planDays || "0"}
          </Text>
        </View>
        <View style={styles.planDetailItem}>
          <Text style={styles.planDetailLabel}>Total Users:</Text>
          <Text style={styles.planDetailValue}>{planDetails.count || "0"}</Text>
        </View>
        <View style={styles.planDetailItem}>
          <Text style={styles.planDetailLabel}>Duration:</Text>
          <Text style={styles.planDetailValue}>
            {planDetails.startDate?.split("T")[0] +
              "  to  " +
              planDetails.endDate?.split("T")[0]}
          </Text>
        </View>
        <View style={styles.planDetailItem}>
          <Text style={styles.planDetailLabel}>Description:</Text>
          <Text style={styles.planDetailValue}>
            {planDetails.description || "Not Available"}
          </Text>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Edit Plan Details</Text>
            <ScrollView>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Plan Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={fields.name}
                  onChangeText={(text) => handleChange("name", text)}
                />
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Total Days</Text>
                <TextInput
                  style={styles.modalInput}
                  value={fields.planDays?.toString()}
                  onChangeText={(text) => handleChange("planDays", text)}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Description</Text>
                <TextInput
                  style={styles.modalInput}
                  value={fields.description}
                  onChangeText={(text) => handleChange("description", text)}
                />
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Start Date</Text>
                <TouchableOpacity onPress={() => handleDateOpen("startDate")}>
                  <Text style={styles.modalInput}>
                    {fields.startDate || "Choose Date"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>End Date</Text>
                <TouchableOpacity onPress={() => handleDateOpen("endDate")}>
                  <Text style={styles.modalInput}>
                    {fields.endDate || "Choose Date"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Toast />
      </Modal>
      <DateTimePicker
        isVisible={isDateVisible}
        mode="date"
        minimumDate={new Date()}
        onConfirm={handleDateConfirm}
        onCancel={() => setIsDateVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  planHeader: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  planDetailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  planDetailLabel: {
    fontWeight: "bold",
    width: 100,
  },
  planDetailValue: {
    flex: 1,
  },
  editButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "#1E90FF",
    borderRadius: 5,
  },
  editText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  modalField: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "rgb(217, 217, 217)",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    color: "#333",
  },
  picker: {
    borderWidth: 1,
    borderColor: "rgb(217, 217, 217)",
    borderRadius: 5,
    fontSize: 14,
    color: "#333",
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#1E90FF",
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
