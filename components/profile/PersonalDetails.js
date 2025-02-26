import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView, 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { axiosInstance } from '../../utils/axiosInstance';
import Toast from 'react-native-toast-message';

const DEFAULT = "---";

export default function PersonalDetails({ user, edit ,fetchUser}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);  
  const role = useSelector((state) => state.auth.data?.data.role);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 15);
  const showToast = (state, message) => {
    Toast.show({
      type: state,
      text1: 'Profile update',
      text2: message,
      position: 'top',
      swipeable: true,
      visibilityTime: 1500,
    });
  };
  const [fields, setFields] = useState({ 
    name:user.name||'' ,
    dob: user.dateOfBirth?.split('T')[0]||''   ,
    personalEmail:user.personalEmail ||'' ,
    contact: user.phone_no ||''  , 
    gender: user.gender || "Select Gender",
    bloodGroup: user.bloodGroup || "Select Blood Group",
  });
  useEffect(()=>{
    if(user){
      setFields({ 
        name:user.name||'' ,
        dob: user.dateOfBirth?.split('T')[0]||''   ,
        personalEmail:user.personalEmail ||'' ,
        contact: user.phone_no ||'' , 
        gender: user.gender || "Select Gender",
        bloodGroup: user.bloodGroup || "Select Blood Group",
      })
    }
  },[user]);
  const handleEdit = () => {
        if(user){
      setFields({ 
        name:user.name||'' ,
        dob: user.dateOfBirth?.split('T')[0]||''   ,
        personalEmail:user.personalEmail ||'' ,
        contact: user.phone_no ||'' , 
        gender: user.gender || "Select Gender",
        bloodGroup: user.bloodGroup || "Select Blood Group",
      })
    }
    setModalVisible(true);
  };

  

  const handleSave = () => { 
    let update ={} 
    if(fields.name?.trim()==''){
      showToast('error','*Please enter your name') 
    }
    else if((fields.name.length<4)||(!/^[a-zA-Z\s]+$/.test(fields.name))){
      showToast('error','*Please enter valid name') 
    }
    else if(((user.personalEmail||'')!='')&&fields.personalEmail==''){
      showToast('error','Please enter your email')
    }
    else if(fields.personalEmail!=''&&!/^[a-z][a-z0-9.-]+@[a-z.]+\.[a-z]{2,}$/.test(fields.personalEmail)){
      showToast('error',"*Please enter valid email");  
    }
    else if(((user.phone_no||'')!='')&&fields.contact==''){
      showToast('error','Please enter your contact number')
    }
    else if(fields.contact!=''&&(fields.contact.length!=10||Number(fields.contact[0])<6)){
      showToast('error','Enter valid contact number');
    }
    else{

    if(fields.personalEmail!=''&&fields.personalEmail!=user.personalEmail){
      update.personalEmail=fields.personalEmail;
    }    
    if(fields.name!=user.name){
      update.name=fields.name.trim();
    }
    if(fields.dob!=''&&fields.dob!=user.dateOfBirth){
      update.dateOfBirth=fields.dob;
    } 
    if(fields.gender!="Select Gender"&&fields.gender!=user.gender){
      update.gender=fields.gender;
    }
    if(fields.bloodGroup!="Select Blood Group"&&fields.bloodGroup!=user.bloodGroup){
      update.bloodGroup=fields.bloodGroup;
    }
    if(fields.contact!=''&&fields.contact!=user.phone_no){ 
      update.phone_no=fields.contact; 
    }      
    if(Object.keys(update)>0){
      handleSubmit(update);  
    }
    else{
      setModalVisible(false);
    }        
    }
  };

  const handleSubmit = async(update)=>{
    try{ 
      const response = await axiosInstance.patch(`/api/users/update/${user.id}`,{...update});
      if(response){
        showToast('success','Profile Updated successfully!');
        fetchUser();
        setTimeout(()=>{
          setModalVisible(false); 
        },1000) 
      }
    }
    catch(err){
      const msg = err?.response?.data?.message||'Profile not updated';
      showToast('error',JSON.stringify(msg));
    } 
  }

  const handleChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };
 
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateConfirm = (date) => {
    const formattedDate = date.toISOString().split('T')[0];  
    handleChange('dob', formattedDate);
    hideDatePicker();
  };
  
  const handleClose = ()=>{
    setModalVisible(false); 
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Personal Details</Text>
        <TouchableOpacity
          style={[
            styles.editButton,
            { flexDirection: 'row', display: role === 'Admins' ? (edit ? '' : 'none') : '' },
          ]}
          onPress={handleEdit}
        >
          <Icon name="edit" style={styles.editIcon} size={18} color="white" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
 
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user.name|| DEFAULT}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Personal Email</Text>
          <Text style={[styles.value ]}>{user.personalEmail|| DEFAULT}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>DOB</Text>
          <Text style={styles.value}>{user.dateOfBirth?.split('T')[0]|| DEFAULT}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Contact</Text>
          <Text style={styles.value}>{user.phone_no|| DEFAULT}</Text>
        </View> 
        <View style={styles.row}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>{user.gender|| DEFAULT}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Blood Group</Text>
          <Text style={styles.value}>{user.bloodGroup|| DEFAULT}</Text>
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
          
            <Text style={styles.modalHeading}>Edit Personal Details</Text> 
            <ScrollView> 
            <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Personal Name</Text>
                <TextInput
                  style={[styles.modalInput,{paddingVertical:15}]}
                  value={fields.name}
                  placeholder='Enter Name'
                  onChangeText={(text) => handleChange('name', text)} 
                /> 
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>DOB</Text>
                <TouchableOpacity onPress={showDatePicker} style={[styles.modalInput,{paddingVertical:15}]}>
                  <Text style={{ color: fields.dob === DEFAULT ? '#aaa' : '#333' }}>
                    {fields.dob === DEFAULT ? 'Select Date' : fields.dob}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Personal Email</Text>
                <TextInput
                  style={[styles.modalInput,{paddingVertical:15}]}
                  value={fields.personalEmail}
                  autoCapitalize='none'
                  placeholder='Enter personal mail'
                  onChangeText={(text) => handleChange('personalEmail', text)} 
                /> 
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Contact</Text>
                <TextInput
                  style={[styles.modalInput,{paddingVertical:15}]}
                  value={fields.contact}
                  onChangeText={(text) => handleChange('contact', text)}
                  keyboardType="phone-pad"
                />                
              </View> 
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Gender</Text>
                <View style={styles.picker}>
                <Picker
                  selectedValue={fields.gender}
                  onValueChange={(value) => handleChange('gender', value)}                  
                >
                  <Picker.Item label="Select Gender"  enabled={false} color='lightgray'/>
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
                </View>
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Blood Group</Text>
                <View style={styles.picker}>
                <Picker
                  selectedValue={fields.bloodGroup}
                  onValueChange={(value) => handleChange('bloodGroup', value)}
                  
                >
                  <Picker.Item label="Select Blood Group" enabled={false} color='lightgray'/>
                  <Picker.Item label="A+" value="A+" />
                  <Picker.Item label="A-" value="A-" />
                  <Picker.Item label="B+" value="B+" />
                  <Picker.Item label="B-" value="B-" />
                  <Picker.Item label="O+" value="O+" />
                  <Picker.Item label="O-" value="O-" />
                  <Picker.Item label="AB+" value="AB+" />
                  <Picker.Item label="AB-" value="AB-" />
                </Picker>
                </View>

              </View>
            </ScrollView>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <Toast/>
          </View>
        </View>
      </Modal>
 
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date" 
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
        maximumDate={maxDate}
      /> 
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  error:{
    color:'red',
  },
  editButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#1E90FF',
    borderRadius: 5,
  },
  editText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  row: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'rgb(217, 217, 217)',
    flexWrap:'wrap'
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    flex:15
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex:28, 
    textAlign:'right'
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
    paddingHorizontal: 10,
    paddingVertical: 8,
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
  loadingContainer: {
    position: 'absolute',
    flexDirection:'row',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    zIndex: 1,  
},
loadingText: { 
    padding:5,
    fontSize: 16,
    color: '#000',  
}
});
