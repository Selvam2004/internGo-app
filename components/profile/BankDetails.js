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

const DEFAULT = "---";

export default function BankDetails({ user, edit, fetchUser, token }) {
  const [isModalVisible, setModalVisible] = useState(false); 
  const [error,setError] = useState("");
  const role = useSelector((state) => state.auth.data?.data.role);

  const [fields, setFields] = useState({ 
    accountNumber: user.bankDetails?.accountNumber||''  ,
    branch: user.bankDetails?.branch ||'' , 
    IFSC: user.bankDetails?.IFSC||''  , 
    bankName: user.bankDetails?.bankName ||''  , 
  });

  useEffect(() => {
    if (user) {
      setFields({ 
        accountNumber: user.bankDetails?.accountNumber||''   ,
        branch: user.bankDetails?.branch||''  , 
        IFSC: user.bankDetails?.IFSC ||'' , 
        bankName: user.bankDetails?.bankName ||'' , 
      });
    }
  }, [user]);

  const handleEdit = () => {
    setModalVisible(true);
  };

  const handleSave = () => { 
    let update = {};
    setError("");
    Object.keys(fields).forEach((key) => {
      if (fields[key] !== '' ) {
        update[key] = fields[key];
      }
    }); 
    if (Object.keys(update).length <4) { 
      setError("*Please fill all details")
    }  
    else if(!/^[a-zA-Z]+$/.test(update.bankName)){
      setError("*Enter valid Bank name")
    }
    else if(!/^[a-zA-Z]+$/.test(update.branch)){
      setError("*Enter valid branch name")
    }
    else if(update.accountNumber.length<8){
      setError("*Enter valid account name")
    }
    else{ 
        handleSubmit(update);
    }

  };

  const handleSubmit = async(update) => {
    try {
      const response = await axiosInstance.patch(`/api/users/update/${user.id}`, {
        bankDetails:{...update} 
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        }
      });

      if (response) {
        fetchUser();   
      }
    } catch (err) {
      console.log(err.response.data);   
    } finally {
      setModalVisible(false);    
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
        <Text style={styles.heading}>Bank Details</Text>
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
          <Text style={styles.label}>Bank name</Text>
          <Text style={styles.value}>{user.bankDetails?.bankName || DEFAULT}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Account Number</Text>
          <Text style={styles.value}>{user.bankDetails?.accountNumber || DEFAULT}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>IFSC</Text>
          <Text style={styles.value}>{user.bankDetails?.IFSC || DEFAULT}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Branch</Text>
          <Text style={styles.value}>{user.bankDetails?.branch || DEFAULT}</Text>
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
            <Text style={styles.modalHeading}>Edit Bank Details</Text>
            <Text style={{color:"red"}}>{error}</Text>
            <ScrollView>  
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Bank Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={fields.bankName}
                  onChangeText={(text) => handleChange('bankName', text)}
                />
              </View> 
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Account Number</Text>
                <TextInput
                  style={styles.modalInput}
                  value={fields.accountNumber}
                  keyboardType='phone-pad'
                  onChangeText={(text) => handleChange('accountNumber', text)}
                />
              </View> 
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>IFSC</Text>
                <TextInput
                  style={styles.modalInput}
                  value={fields.IFSC}
                  onChangeText={(text) => handleChange('IFSC', text)}
                />
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Branch</Text>
                <TextInput
                  style={styles.modalInput}
                  value={fields.branch}
                  onChangeText={(text) => handleChange('branch', text)}
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
