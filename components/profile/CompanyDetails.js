import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal, 
  ScrollView, 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { axiosInstance } from '../../utils/axiosInstance';
import { TextInput } from 'react-native-gesture-handler';

const DEFAULT = "---";

export default function EmployeeDetails({ user,edit, fetchUser , token }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false); 
  const role = useSelector((state) => state.auth.data?.data.role); 
  
  const [fields, setFields] = useState({
    designation: user.designation  ,
    status: user.status  ,
    employeeId: user.employeeId  ,
    certificates_submission_status: user.certificates_submission_status ,
    dateOfJoining: user.dateOfJoining?.split('T')[0]  ,
    batch: user.batch  ,
    phase: user.phase  ,
    year:Number(user.year)

  });
  
  useEffect(()=>{
    if(user){
      setFields({
        designation: user.designation ,
        certificates_submission_status: user.certificates_submission_status  ,
        employeeId: user.employeeId  ,
        status: user.status  ,
        dateOfJoining: user.dateOfJoining?.split('T')[0]  ,
        batch: user.batch  ,
        phase: user.phase ,
        year:user.year  
      });
    }
  },[user])

  const handleEdit = () => {
    setModalVisible(true);
  };

  const handleSave = () => {
    let update = {};
    Object.keys(fields).forEach((key) => {
      if (fields[key] !== DEFAULT && fields[key] !== user[key]) {
        if(key=="year"){
          update[key]=Number(fields[key])
        }
        else{
          update[key] = fields[key];
        }        
      }
    });

    if (Object.keys(update).length > 0) { 
      handleSubmit(update);
    }
  };

  const handleSubmit = async(update)=>{
    try{  
      const response = await axiosInstance.patch(`/api/users/update/${user.id}`,{...update},
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          }
        }
      );
      if(response){
        fetchUser();
      }
    }
    catch(err){
      console.log(err);
    }
    finally{ 
      setModalVisible(false);  
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
    handleChange('dateOfJoining', formattedDate);
    hideDatePicker();
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Employee Details</Text>
        <TouchableOpacity
          style={[
            styles.editButton,
            { flexDirection: 'row', display: role === 'Admins' ? '' : 'none' },
          ]}
          onPress={handleEdit}
        >
          <Icon name="edit" style={styles.editIcon} size={18} color="white" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.table}> 

        <View style={styles.row}>
          <Text style={styles.label}>Designation</Text>
          <Text style={styles.value}>{user.designation || DEFAULT}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Employee Id</Text>
          <Text style={styles.value}>{user.employeeId || DEFAULT}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{user.status || DEFAULT}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date of Joining</Text>
          <Text style={styles.value}>{user.dateOfJoining?.split('T')[0] || DEFAULT}</Text>
        </View> 
        {(!edit||role=='Interns')&&<View style={styles.row}>
          <Text style={styles.label}>Batch</Text>
          <Text style={styles.value}>{user.batch || DEFAULT}</Text>
        </View>
        }

        {(!edit||role=='Interns') &&<View style={styles.row}>
          <Text style={styles.label}>Phase</Text>
          <Text style={styles.value}>{user.phase || DEFAULT}</Text>
        </View>
        }
        {(!edit||role=='Interns')&&<View style={styles.row}>
          <Text style={styles.label}>Year</Text>
          <Text style={styles.value}>{user.year || DEFAULT}</Text>
        </View>
        }
        {(!edit||role=='Interns')&&<View style={styles.row}>
          <Text style={styles.label}>Certificate Submission</Text>
          <Text style={styles.value}>{user.certificates_submission_status?"YES":"NO" || DEFAULT}</Text>
        </View>
        }
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Edit Employee Details</Text>
            <ScrollView >
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Designation</Text>
                <View style={styles.picker}>
                <Picker
                  selectedValue={fields.designation}
                  onValueChange={(value) => handleChange('designation', value)}
                >
                  <Picker.Item label="Select Designation" />
                  <Picker.Item label="frontend" value="frontend" />
                  <Picker.Item label="backend" value="backend" />
                  <Picker.Item label="testing" value="testing" />
                  <Picker.Item label="devops" value="devops" />
                </Picker>
                </View>
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Employee ID</Text>
                <View style={[styles.picker,{padding:15}]}> 
                  <TextInput value={fields.employeeId} onChangeText={(text)=>handleChange('employeeId',text)}/>
                 </View>
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Status</Text>
                <View style={styles.picker}>
                <Picker
                  selectedValue={fields.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <Picker.Item label="Select Status" />
                  <Picker.Item label="ACTIVE" value="ACTIVE" />
                  <Picker.Item label="NOT_ACTIVE" value="NOT_ACTIVE" />
                  <Picker.Item label="EXAMINATION" value="EXAMINATION" />
                  <Picker.Item label="SHADOWING" value="SHADOWING" />
                  <Picker.Item label="DEPLOYED" value="DEPLOYED" />
                </Picker>
                </View>
              </View>

              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Date of Joining</Text>
                <TouchableOpacity onPress={showDatePicker} style={styles.modalInput}>
                  <Text style={{ color: fields.dateOfJoining === DEFAULT ? '#aaa' : '#333',padding:8 }}>
                    {fields.dateOfJoining === DEFAULT ? 'Select Date' : fields.dateOfJoining}
                  </Text>
                </TouchableOpacity>
              </View>

              {!edit&&role=='Admins'&& <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Batch</Text>
                <View style={styles.picker}>
                <Picker
                  selectedValue={fields.batch}
                  onValueChange={(value) => handleChange('batch', value)}
                >
                  <Picker.Item label="Select Batch" />
                  <Picker.Item label="Batch 1" value="Batch 1" />
                  <Picker.Item label="Batch 2" value="Batch 2" />
                  <Picker.Item label="Batch 3" value="Batch 3" />
                </Picker>
                </View>
              </View>
                }
              {!edit&&role=='Admins'&&<View style={styles.modalField}>
                <Text style={styles.modalLabel}>Phase</Text>
                <View style={styles.picker}>
                <Picker
                  selectedValue={fields.phase}
                  onValueChange={(value) => handleChange('phase', value)}
                >
                  <Picker.Item label="Select Phase" />
                  <Picker.Item label="Phase 1" value="Phase 1" />
                  <Picker.Item label="Phase 2" value="Phase 2" />
                  <Picker.Item label="Phase 3" value="Phase 3" />
                </Picker>
                </View>
              </View>
                }          
               {!edit&&role=='Admins'&&<View style={styles.modalField}>
                <Text style={styles.modalLabel}>Year</Text>
                <View style={[styles.picker,{padding:15}]}> 
                  <TextInput keyboardType='numeric' value={fields.year} onChangeText={(text)=>handleChange('year',text)}/>
                 </View>
              </View>
                }      
              {!edit&&role=='Admins'&&<View style={styles.modalField}>
                <Text style={styles.modalLabel}>Certificate Submission Status</Text>
                <View style={styles.picker}>
                <Picker
                  selectedValue={fields.certificates_submission_status}
                  onValueChange={(value) => handleChange('certificates_submission_status', value)}
                >
                  <Picker.Item label="Select Status" />
                  <Picker.Item label="Yes" value={true}/>
                  <Picker.Item label="No" value={false} /> 
                </Picker>
                </View>
              </View>
                }
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

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={ handleDateConfirm}
        onCancel={hideDatePicker}
      /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginBottom:20
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
    height:"80%",
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
    padding:20,
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
    flexDirection: 'row',
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
    padding: 5,
    fontSize: 16,
    color: '#000',
  },
});