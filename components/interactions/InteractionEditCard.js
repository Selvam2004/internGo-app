import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { axiosInstance } from "../../utils/axiosInstance"; 
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const InteractionEditCard = ({ handleSubmitChange,interaction }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false); 
  const mentors = useSelector(state=>state.mentors?.mentors)?.map(val=>val.name)

  const [loading, setLoading] = useState(false); 
  const [isVisible, setIsVisible] = useState({
    date: false,
    time: false,
  });
  const [details, setDetails] = useState(interaction);
  const [editedDetails, setEditedDetails] = useState({
    assignedInterviewer: "",
    date: "",
    time: "",
    duration: "",
  });

  const showToast = (state,message) => {     
    Toast.show({
      type: state,  
      text1: "Interaction Schedule",
      text2: message,
      position: "top",  
      swipeable:true,
      visibilityTime:1500, 
    });
  };

  useEffect(() => { 
    
    setDetails({
      name: interaction.name,
      assignedIntern: interaction.assignedIntern,
      assignedMentor: interaction.assignedMentor,
      assignedInterviewer: interaction.assignedInterviewer,
      date: interaction.date?.split("T")[0],
      time: interaction.time,
      duration: interaction.duration,
      interactionStatus: interaction.interactionStatus,
    });
    setEditedDetails({
      assignedInterviewer: interaction.assignedInterviewer,
      date: interaction.date?.split("T")[0],
      time: interaction.time,
      duration: interaction.duration,
    });
    setIsScheduled(interaction.isScheduled);
  }, [interaction]);

  const handleSave = async () => {
    if(editedDetails.duration?.trim()==''){ 
        showToast('error','Please enter all details')
        return;
    }
    const selectedDate = new Date(editedDetails.date);
    const [hour,minute] = editedDetails.time?.split(':');
    selectedDate.setHours(hour,minute);
    const currentDate = new Date();
   
   if (selectedDate.toDateString() === currentDate.toDateString()) {
     if (selectedDate < currentDate) {
      showToast('error', 'You cannot select a past time'); 
       return;
     }
   } 
    try{

        setLoading(true);
        const response =await axiosInstance.patch(`/api/interactions/${interaction.id}/update`,{
          id:interaction.id,
            ...editedDetails
        })
        if(response){   
                      
            showToast('success','Updated successfully!!')
            handleSubmitChange(interaction.id,editedDetails);
            setTimeout(()=>{ 
              setModalVisible(false);
            },1000)
        }
    }
    catch(err){ 
        showToast('error',err.response.data?.message||'Details not updated.Please try later')
    }
    finally{ 
        setLoading(false);  
    }
  };

  const handleChange = (field, value) => {
    setEditedDetails({ ...editedDetails, [field]: value });
  };

  const handleDateConfirm = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setEditedDetails({ ...editedDetails, date: formattedDate });
    setIsVisible({ ...isVisible, date: false });
  };

  const handleTimeConfirm = (time) => { 
    const formattedTime = time.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }); 
    
    setEditedDetails({ ...editedDetails, time: formattedTime.toString() });
    setIsVisible({ ...isVisible, time: false });
  };
 
  const handleSchedule = async()=>{
    try{
      const sch=isScheduled;
      setIsScheduled(!isScheduled);              
      const response = await axiosInstance.get(`/api/interactions/${interaction.id}/toggleSchedule?isScheduled=${!sch}`); 
      showToast('info',`Interaction schedule changed successfully `)
    }
    catch(err){ 
      showToast('error',`Interaction schedule change failed`)
    }
  }
 const navigation = useNavigation();
  const handleViewFeedback = ()=>{
    navigation.navigate('View Feedback',{
      id:interaction.id
    })
  }

  return (
    <View style={styles.card}>
        
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={[
              styles.statusDot,
              details.interactionStatus === "COMPLETED"
                ? styles.greenDot
                :details.interactionStatus=='PENDING'? styles.redDot:styles.yellowDot
            ]}
          ></View>
          <Text style={styles.title}>{details.name}</Text>
        </View>
        {details.interactionStatus === "PENDING"&&<Switch
          value={isScheduled}
          onValueChange={handleSchedule}
          trackColor={{ false: "#ccc", true: "#28a745" }}
          thumbColor={"white"}
        />}
      </View>

      <View style={styles.namesContainer}>
        <View style={styles.nameItem}>
          <Text style={styles.label}>Intern</Text>
          <Text style={styles.value}>{details.assignedIntern}</Text>
        </View>
        <View style={styles.nameItem}>
          <Text style={styles.label}>Mentor</Text>
          <Text style={styles.value}>{details.assignedMentor}</Text>
        </View>
        <View style={styles.nameItem}>
          <Text style={styles.label}>Interviewer</Text>
          <Text style={styles.value}>{details.assignedInterviewer}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Icon name="access-time" size={16} color="#555" />
          <Text style={styles.detailText}>{details.time}</Text>
        </View>
        <View style={styles.detailItem}>
          <FontAwesome name="calendar" size={16} color="#555" />
          <Text style={styles.detailText}>{details.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="timer" size={16} color="#555" />
          <Text style={styles.detailText}>{details.duration}</Text>
        </View>
      </View>
        {details.interactionStatus === "PENDING"? 
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.editText}>Edit Interaction</Text>
      </TouchableOpacity>:
      details.interactionStatus === "COMPLETED"? 
            <TouchableOpacity
            style={styles.editButton}
            onPress={handleViewFeedback}
          >
            <Text style={styles.editText}>View Feedback</Text>
          </TouchableOpacity>:null}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
        <Toast/>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Interaction</Text>

            <Text style={styles.modalLabel}>Interviewer</Text>

            <View style={styles.input}>
              <Picker
                mode="dropdown"
                selectedValue={editedDetails.assignedInterviewer}
                onValueChange={(text) =>
                  handleChange("assignedInterviewer", text)
                }
              >
                 {mentors.length>0&&mentors.map((mentor,id)=>(<Picker.Item key={id} label={mentor} value={mentor}/>))} 

              </Picker>
            </View>

            <Text style={styles.modalLabel}>Date</Text>
            <TouchableOpacity
              onPress={() => setIsVisible({ ...isVisible, date: true })}
            >
              <View style={{ height: 70 }}>
                <Text
                  style={[
                    styles.input,
                    { flex: 1, padding: 15, textAlignVertical: "center" },
                  ]}
                >
                  {editedDetails.date || "Choose date"}
                </Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.modalLabel}>Time </Text>
            <TouchableOpacity
              onPress={() => setIsVisible({ ...isVisible, time: true })}
            >
              <View style={{ height: 70 }}>
                <Text
                  style={[
                    styles.input,
                    { flex: 1, padding: 15, textAlignVertical: "center" },
                  ]}
                >
                  {editedDetails.time || "Choose time"}
                </Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.modalLabel}>Duration</Text>
            <TextInput
              style={[styles.input,{padding:15}]}
              value={editedDetails.duration}
              onChangeText={(text) => handleChange("duration", text)}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.saveButton,loading&&{backgroundColor:'skyblue'}]} disabled={loading} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <DateTimePicker
        isVisible={isVisible.date}
        mode="date"
        minimumDate={new Date()}
        onConfirm={handleDateConfirm}
        onCancel={() => setIsVisible({ ...isVisible, date: false })}
      />
      <DateTimePicker
        isVisible={isVisible.time}
        mode="time"
        is24Hour={true}
        onConfirm={handleTimeConfirm}
        onCancel={() => setIsVisible({ ...isVisible, time: false })}
      />
    </View>
  );
};
export default InteractionEditCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    margin: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 4,
    marginRight: 8,
  },
  greenDot: {
    backgroundColor: "green",
  },
  redDot: {
    backgroundColor: "red",
  },
  yellowDot:{
    backgroundColor:'yellow'
  },
  namesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  nameItem: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    color: "#777",
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    paddingLeft: 5,
    fontSize: 12,
    color: "#555",
  },
  editButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  editText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5, 
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
});
