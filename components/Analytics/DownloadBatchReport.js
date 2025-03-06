import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useSelector } from "react-redux";

export default function DownloadBatchReport({ batches,years,isVisible, setIsVisible }) {
  const [selectedYear, setSelectedYear] = useState("");
    const [selectedBatch, setSelectedBatch] = useState(""); 
    const [disabled, setDisabled] = useState(false);
    const token = useSelector((state) => state.auth?.data?.data?.token);
  const showToast = (state, message) => {
    Toast.show({
      type: state,
      text1: "Download Report",
      text2: message,
      position: "top",
      swipeable: true,
      visibilityTime: 1500,
    });
  }; 
    
    const handleDownload = async () => {
        try {
            showToast("success", "Download started...");  
            setDisabled(true);
      const url = `https://interngo-1.onrender.com/api/feedbacks/download?token=${token}&batch=${selectedBatch}&year=${selectedYear}`;
            const fileName = `${selectedBatch}_${selectedYear}_Report.xlsx`;
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;       
            const { uri } = await FileSystem.downloadAsync(url, fileUri); 
            await Sharing.shareAsync(uri, {
                    dialogTitle: `Share ${fileName}`,
            });
            await FileSystem.deleteAsync(uri);    
            setSelectedBatch("");
            setSelectedYear("");
            setIsVisible(false);
        }
        catch (err) {
            const msg = JSON.stringify(err.response.data.message)||'Report not downloaded';
            showToast('error', msg);        
        }
        finally {
            setDisabled(false);
        }
    }

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.heading}>Download Report</Text>

          <Text style={styles.label}>Select Year</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedYear}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
            >
              <Picker.Item label="Select Year" color="gray" enabled={false} />
              {years.map((key, ind) => (
                <Picker.Item key={ind} label={key} value={key} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Select Batch</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedBatch}
              onValueChange={(itemValue) => setSelectedBatch(itemValue)}
            >
              <Picker.Item label="Select Batch" color="gray" enabled={false} />
              {batches.map((key, ind) => (
                <Picker.Item key={ind} label={key} value={key} />
              ))}
            </Picker>
          </View>
 
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.downloadButton,
                (!selectedYear || !selectedBatch || disabled) && styles.disabledButton,
              ]}
              onPress={handleDownload}
              disabled={!selectedYear || !selectedBatch || disabled}
            >
              <Text style={styles.buttonText}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>
          </View>
          <Toast/>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: 300,
    borderRadius: 10,
    elevation: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    fontWeight: "600",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#E74C3C",
  },
  downloadButton: {
    backgroundColor: "#007BFF",
  },
  disabledButton: {
    backgroundColor: "skyblue",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
