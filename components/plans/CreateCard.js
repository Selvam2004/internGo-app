import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import { axiosInstance } from '../../utils/axiosInstance'; 
import DateTimePicker from 'react-native-modal-datetime-picker';
import Toast from 'react-native-toast-message';

export default function CreateCard({fetchPlans}) {
  const [isVisible,setIsVisible] = useState(false); 
  const [fields,setFields] = useState({
    name:'',
    description:'',
    planDays: '',
    startDate: '',
    endDate:''
  });

    const showToast = (state, message) => {
      Toast.show({
        type: state,
        text1: "Plan Creation",
        text2: message,
        position: "top",
        swipeable: true,
        visibilityTime: 1500,
      });
    };

  const [isDateVisible, setIsDateVisible] = useState(false);
  const [currentField, setCurrentField] = useState('startDate');
  const handleDateConfirm = (date) => {

    
    if (currentField == 'startDate'&&Number(fields.planDays)>0) {
      const endDate = new Date(date);
      endDate.setDate(new Date(date).getDate()+fields.planDays)
      setFields({
        ...fields,
        endDate: endDate.toISOString().split("T")[0],
        startDate: date.toISOString().split("T")[0],
      });      
    }
    else {
          const formattedDate = date.toISOString().split("T")[0];
          setFields({ ...fields, [currentField]: formattedDate }); 
    }
    setIsDateVisible(false);
  };
  const handleClose =()=>{
    setIsVisible(false); 
  }
  const handleOpen =()=>{ 
    setIsVisible(true)
  }
  const handleChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave=()=>{
    let update = {}
    Object.keys(fields).map((key)=>{
      if(fields[key].trim()!=""){
        update[key]= fields[key];
      }
    })  

    if(Object.keys(update).length<5){
      showToast('error',"Please fill all details");
    }
    else if (Number(update.planDays) > 180 || Number(update.planDays) < 1) {
      showToast("error", "Please Enter Days between 1 to 180");
    }
    else if (((new Date(update.endDate) - new Date(update.startDate)) / (1000 * 60 * 60 * 24))<0) {
      showToast('error','End date must be after start date')
    }
    else if (
      ((new Date(update.endDate) - new Date(update.startDate)) /
        (1000 * 60 * 60 * 24)) >
      update.planDays
    ) {
      showToast("error", "End Date cannot exceed Plan days");
    } else {
      handleSubmit(update);
    }
  }

  const handleDateOpen = (field) => {
    setCurrentField(field);
    setIsDateVisible(true);
  }
  const handleSubmit = async(update)=>{
    try{
      const response  = await axiosInstance.post('/api/plans/create',{
        name:update.name,
        description:update.description,
        planDays: Number(update.planDays),
        startDate: update.startDate,
        endDate:update.endDate
      } );
      if(response){
        fetchPlans();
        setIsVisible(false);
      }
    }
    catch(err){
      const msg = JSON.stringify(err.response.data.message) || 'Plan not created';
      showToast('error', msg);
    } 
  }
  return (
    <>
      <TouchableOpacity onPress={handleOpen}>
        <View style={styles.container}>
          <Text style={styles.createText}>
            <Text style={{ fontWeight: "bold", fontSize: 30 }}>+</Text> Create
            Plan
          </Text>
        </View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
        visible={isVisible}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Create Plan</Text>
            <ScrollView>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Name</Text>
                <TextInput
                  value={fields.name}
                  onChangeText={(text) => handleChange("name", text)}
                  style={styles.modalInput}
                  placeholder="Enter name"
                />
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Description</Text>
                <TextInput
                  value={fields.description}
                  onChangeText={(text) => handleChange("description", text)}
                  style={[
                    styles.modalInput,
                    { height: 100, textAlignVertical: "top" },
                  ]}
                  placeholder="Enter description"
                />
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Number of days</Text>
                <TextInput
                  value={fields.planDays}
                  keyboardType="number-pad"
                  onChangeText={(text) => handleChange("planDays", text)}
                  style={styles.modalInput}
                  placeholder="Enter no of days"
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
    container:{
        backgroundColor:'rgb(204, 204, 204)',
        width:"90%",
        margin:'auto',
        paddingVertical:80,
        borderRadius:10, 
        alignItems:'center'
    },
    createText:{
      color:'black',
      fontSize:24,
    },
    modalOverlay:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent:{
      backgroundColor: '#fff',
      width: '90%',
      borderRadius: 8,
      padding: 20,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      elevation: 5,
    },
    modalHeading: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
    },
    modalField: {
      marginBottom: 16,
    },
    modalLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#555',
      marginBottom: 6,
    },
    modalInput: {
      borderWidth: 1,
      borderColor: 'rgb(217, 217, 217)',
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 13,
      fontSize: 14,
      color: '#333',
    },
    saveButton: {
      marginTop: 20,
      paddingVertical: 12,
      backgroundColor: '#1E90FF',
      borderRadius: 5,
      alignItems: 'center',
    },
    saveButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    closeButton: {
      marginTop: 20,
      paddingVertical: 12,
      backgroundColor: '#ff4d4d',
      borderRadius: 5,
      alignItems: 'center',
    },
    closeButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
} )