import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import { axiosInstance } from '../../utils/axiosInstance'; 

export default function CreateCard({fetchPlans}) {
  const [isVisible,setIsVisible] = useState(false);
  const [error,setError] = useState("");
  const [fields,setFields] = useState({
    name:'',
    description:'',
    planDays:''
  });
  const handleClose =()=>{
    setIsVisible(false);
    setError("");
  }
  const handleOpen =()=>{
    setError("");
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
    
    if(Object.keys(update).length<3){
      setError("*Please fill all details");
    }
    else if(Number(update.planDays)>180||Number(pdate.planDays)<1){
      setError("*Please Enter Days between 1 to 180");
    }
    else{ 
      handleSubmit(update);
    }
  }

  const handleSubmit = async(update)=>{
    try{
      const response  = await axiosInstance.post('/api/plans/create',{
        name:update.name,
        description:update.description,
        planDays:Number(update.planDays)
      } );
      if(response){
        fetchPlans();
      }
    }
    catch(err){
      console.log(err.message);
    }
    finally{
      setIsVisible(false)
    }
  }
  return (
    <>
    <TouchableOpacity onPress={handleOpen}>
    <View style={styles.container}>
      <Text style={styles.createText}><Text style={{fontWeight:'bold',fontSize:30}}>+</Text> Create Plan</Text>
    </View>
    </TouchableOpacity>
    <Modal animationType='slide' transparent={true} onRequestClose={()=>setIsVisible(false)} visible={isVisible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeading}>Create Plan</Text>
          {error&& <Text style={{color:'red'}}>{error}</Text>}
          <ScrollView>
            <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Name</Text>
                <TextInput value={fields.name} onChangeText={(text)=>handleChange('name',text)} style={styles.modalInput} placeholder='Enter name'/>
            </View>
            <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Description</Text>
                <TextInput value={fields.description} onChangeText={(text)=>handleChange('description',text)} style={[styles.modalInput,{height:100,textAlignVertical:'top'}]} placeholder='Enter description'/>
            </View>
            <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Number of days</Text>
                <TextInput value={fields.planDays} keyboardType='number-pad' onChangeText={(text)=>handleChange('planDays',text)} style={styles.modalInput} placeholder='Enter no of days'/>
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
  )
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