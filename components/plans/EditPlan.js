import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import ErrorPage from "../../screens/User/Error";
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function EditPlan({ id }) { 
  const [isModalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [valid, setValid] = useState("");
  const [planDetails, setPlanDetails] = useState({});

  const [fields, setFields] = useState({});

  const fetchDetails = async () => {
    try { 
      const response = await axiosInstance.get(`/api/plans/${id}`);
      if (response) { 
        setPlanDetails(response.data?.data);
        setFields(response.data?.data); 
      }
    } catch (err) { 
      setError("something went wrong");
    }
  };
  

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleChange  =(key,value)=>{
    setFields({...fields,[key]:value});
  }
  const handleEdit =()=>{
    setModalVisible(true);
    setValid("");
  }
  const handleSave = () => {
    let isValid = true;  
    if(Number(fields.planDays)>180||Number(fields.planDays)<1){
      setValid("*Please Enter Days between 1 to 180");
      return;
    }
    Object.keys(fields).forEach((key) => {
        if(key!='count'){
      if (!fields[key] || (typeof fields[key] === "string" && fields[key].trim() === "")) { 
        isValid = false;
      }
    }
    }); 
    if (isValid) {
        setValid("");
        handleSubmit();
    }
    else{
        setValid("Enter all details"); 
    }
   
  };
  
  const handleClose = ()=>{
    setModalVisible(false)
  }
  
  const handleSubmit = async()=>{
    try{
        setValid("");
        const response = await axiosInstance.patch(`/api/plans/${id}/update`,{
            name:fields.name,
            planDays:Number(fields.planDays),
            description:fields.description
        })
        if(response){
            setPlanDetails(fields);
        }
    }
    catch(err){
        console.log(err);        
    }
    finally{
        setModalVisible(false);
    }
  }
  return (
    <>
    {!!error?<ErrorPage onRetry={fetchDetails}/>:
    <View style={styles.planHeader}>
        
      <View style={[styles.planDetailItem,{alignItems:'flex-end',marginBottom:7}]}>

        <View style={{flexDirection:'row',flex:6}}>
        <Text style={styles.planDetailLabel}>Plan Name:</Text>
        <Text  style={{flex:4}}>{planDetails.name||"Not Available"}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.editButton,
            { flexDirection: 'row',flex:1 },
          ]}
          onPress={handleEdit}
        >
          <Icon name="edit" style={styles.editIcon} size={18} color="white" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

       </View>

      <View style={styles.planDetailItem}>
        <Text style={styles.planDetailLabel}>Total Days:</Text>
        <Text style={styles.planDetailValue}>{planDetails.planDays || "0"}</Text>
      </View>
      <View style={styles.planDetailItem}>
        <Text style={styles.planDetailLabel}>Total Users:</Text>
        <Text style={styles.planDetailValue}>{planDetails.count ||"0"}</Text>
      </View>
      <View style={styles.planDetailItem}>
        <Text style={styles.planDetailLabel}>Description:</Text>
        <Text style={styles.planDetailValue}>{planDetails.description||"Not Available"}</Text>
      </View>
    </View>
    }
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Edit Plan Details</Text>
            <Text style={{display:valid?'':'none',color:'red'}}>{valid}</Text>
            <ScrollView>  
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Plan Name</Text>
                <TextInput
                  style={styles.modalInput} 
                  value={fields.name}
                  onChangeText={(text)=>handleChange('name',text)}
                />                
              </View>  
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Total Days</Text>
                <TextInput
                  style={styles.modalInput} 
                  value={fields.planDays?.toString()} 
                  onChangeText={(text)=>handleChange('planDays',text)}
                  keyboardType="number-pad"
                />                
              </View>  
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Description</Text>
                <TextInput
                  style={styles.modalInput} 
                  value={fields.description}
                  onChangeText={(text)=>handleChange('description',text)}
                />                
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
      </Modal>
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
     justifyContent:'space-between',
     marginBottom: 10
     },
  planDetailLabel: { 
    fontWeight: "bold", 
    width: 100 
},
  planDetailValue: { 
    flex: 1
 },
 editButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#1E90FF',
    borderRadius: 5, 
  },
  editText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
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
    padding:10,
    fontSize: 14,
    color: '#333',
  },
  picker: {
    borderWidth: 1,
    borderColor: 'rgb(217, 217, 217)',
    borderRadius: 5,
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
});
