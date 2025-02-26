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
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../utils/axiosInstance';
import Toast from 'react-native-toast-message';

const DEFAULT = "---";

export default function AddressDetails({ user, edit, fetchUser }) {
  const [isModalVisible, setModalVisible] = useState(false); 
  const role = useSelector((state) => state.auth.data?.data.role);
  const [error,setError] = useState('');
  const [fields, setFields] = useState({ 
    currentAddress: user.currentAddress ||'' ,
    permanentAddress: user.permanentAddress ||''  ,  
  });

  const showToast = (state,message) => {     
    Toast.show({
      type: state,  
      text1: "Profile Update",
      text2: message,
      position: "top",   
      swipeable:true,
      visibilityTime:1500, 
    });
  };

  useEffect(() => {
    if (user) {
      setFields({ 
        currentAddress: user.currentAddress  ||'' ,
        permanentAddress: user.permanentAddress ||''  ,  
      });
    }
  }, [user]);

  const handleEdit = () => {
    setModalVisible(true);
  };

  const handleSave = () => { 
    let update = {};
    if(fields.currentAddress==''||fields.permanentAddress==''){
      showToast('error','*Please fill all details');
    }
    else if(fields.currentAddress?.length>255||fields.permanentAddress?.length>255){
      showToast('error','Address should not exceed 255 characters');
    }
    else if((!/^(?=.*[a-zA-Z])[a-zA-Z0-9,-.&]{10,}$/.test(fields.currentAddress)) || 
    (!/^(?=.*[a-zA-Z])[a-zA-Z0-9,-.&]{10,}$/.test(fields.permanentAddress))){
      showToast('error','Please enter valid address');
    }
    else{
      handleSubmit(fields);
    } 
  };

  const handleSubmit = async(update) => {
    try {
      const response = await axiosInstance.patch(`/api/users/update/${user.id}`, {
        ...update
      });

      if (response) {
        fetchUser();  
        setModalVisible(false);   
      }
    } catch (err) {
      const msg = JSON.stringify(err.response.data.message)||'Address not updated.Please try later';
      showToast('error',msg);
    } 
  };

  const handleChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Address</Text>
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
        <View style={styles.row }>
          <Text style={[styles.label,{flex:1}]}>Current Address</Text>
          <Text style={[styles.value,{flex:1}]}>{user.currentAddress || DEFAULT}</Text>
        </View>
        <View style={styles.row }>
          <Text style={[styles.label,{flex:1}]}>Permanent Address</Text>
          <Text style={[styles.value,{flex:1}]}>{user.permanentAddress || DEFAULT}</Text>
        </View> 
      </View>
 
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
        <Toast/>
          <View style={styles.modalContent}>
            
            <Text style={styles.modalHeading}>Edit Address Details</Text>
            <ScrollView>  
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Current Address</Text>
                <TextInput
                  style={styles.modalInput}
                  value={fields.currentAddress}
                  onChangeText={(text) => handleChange('currentAddress', text)}
                />
              </View> 
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Permanent Address</Text>
                <TextInput
                  style={styles.modalInput}
                  value={fields.permanentAddress}
                  onChangeText={(text) => handleChange('permanentAddress', text)}
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
  error: {
    color: 'red',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'rgb(217, 217, 217)',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
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
