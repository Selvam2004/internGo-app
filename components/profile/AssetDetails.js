import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { axiosInstance } from '../../utils/axiosInstance'; 

const DEFAULT = "---";

export default function AssetDetails({ user, assets , fetchUser, token }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalAdd, setModalAdd] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [currentAssetIndex, setCurrentAssetIndex] = useState(null); 
  const [error,setError]= useState(""); 
  const [editError,setEditError]= useState(""); 
  const [currentFieldForDatePicker,setCurrentFieldForDatePicker] = useState("givenOn")
  const role = useSelector((state) => state.auth.data?.data.role);  

  const [fields, setFields] = useState({
    type: DEFAULT,
    name: DEFAULT,
    givenOn: DEFAULT,
    returnDate: DEFAULT,
  }); 

  const handleEdit = (index) => {
    setCurrentAssetIndex(index); 
    const asset = assets[index];  
    setFields({
      name: asset?.assetName || DEFAULT,
      type: asset?.assetType || DEFAULT,
      givenOn: asset?.givenOn?.split('T')[0] || DEFAULT,
      returnDate: asset?.returnDate?.split('T')[0] || DEFAULT,  
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    setEditError('');
    if (currentAssetIndex !== null) { 
      if(fields.name==''||fields.type==''){
        setEditError('*Please enter all details');
        return;
      }
      let update = { 
        assetName:fields.name,
        assetType:fields.type,
        givenOn:fields.givenOn
      };           
      
        if (fields.returnDate !== DEFAULT && fields.returnDate !== assets[currentAssetIndex]?.returnDate) {
        if(new Date(fields.returnDate)<new Date(assets[currentAssetIndex]?.givenOn)){
          setEditError('Enter valid return date');
          return;
        }
        update.returnedOn = fields.returnDate;
      } 

      if (Object.keys(update).length > 0) {
        handleSubmit(update,currentAssetIndex);
      }
    }
  };

  const handleSubmit = async (update,ind) => {
    try { 
      const response = await axiosInstance.patch(`/api/users/update/asset/${assets[ind].id}`, { 
        ...update,
      });

      if (response) {
        fetchUser();
        setModalVisible(false);
      }
    } catch (err) {
      const msg = JSON.stringify(err.response.data.message)||'Asset not added';
      setEditError(msg);
    } 
  };

  const handleChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const showDatePicker = (field) => {
    setCurrentFieldForDatePicker(field);
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateConfirm = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    handleChange(currentFieldForDatePicker, formattedDate);
    hideDatePicker();
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleAdd = ()=>{
    setFields({});
    setError("");
    setModalAdd(true);
  }
  const handleAddSave =async ()=>{
    
    if(Object.keys(fields).length<3){
      setError("Please fill all details");
    }
    else{
      try{ 
        const response = await axiosInstance.post('/api/users/create/assets',{
          userId:user.id,
          assetType:fields.type,
          assetName:fields.name,
          givenOn:fields.givenOn
        } )
        if(response){
          fetchUser();
          setModalAdd(false);
        }
      }
      catch(err){
        const msg = JSON.stringify(err.response.data.message)||'Asset not added';
        setError(msg);
      } 
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Asset Details</Text>
        <TouchableOpacity
          style={[
            styles.editButton,
            { flexDirection: 'row', display: role === 'Admins' ?  '' : 'none' },
          ]}
          onPress={handleAdd}
        >
          <Icon name="edit" style={styles.editIcon} size={18} color="white" />
          <Text style={styles.editText}>Add</Text>
        </TouchableOpacity>
      </View>
        <View style={styles.box}>
      {assets?assets.map((asset, index) => (
        <View key={index} style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{asset?.assetName || DEFAULT}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Type</Text>
            <Text style={styles.value}>{asset?.assetType || DEFAULT}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Given On</Text>
            <Text style={styles.value}>{asset?.givenOn?.split('T')[0] || DEFAULT}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Return Date</Text>
            <Text style={styles.value}>{asset?.returnDate?.split('T')[0] ||  "Not returned"}</Text>
          </View>
          {role === 'Admins' && (
            <View style={{alignItems:'flex-end' }}>
            <TouchableOpacity
              style={[styles.editButton, { flexDirection: 'row' }]}
              onPress={() => handleEdit(index)}
            >
              <Icon name="edit" style={styles.editIcon} size={18} color="white" />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            </View>
          )}
        </View>
      )):<View style={{alignItems:'center'}}><Text>No Assets to display</Text></View>}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Edit Asset Details</Text>
            <ScrollView>
            <Text style={{color:"red"}}>{editError}</Text>

              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={fields.name}
                  onChangeText={(text) => handleChange('name', text)}
                />
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Type</Text>
                <TextInput
                  style={styles.modalInput}
                  value={fields.type}
                  onChangeText={(text) => handleChange('type', text)}
                />
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Given On</Text>
                <TouchableOpacity onPress={() => showDatePicker('givenOn')} style={styles.modalInput}>
                  <Text style={{ color: fields.givenOn === DEFAULT ? '#aaa' : '#333' }}>
                    {fields.givenOn === DEFAULT ? 'Select Date' : fields.givenOn}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Return Date</Text>
                <TouchableOpacity onPress={() => showDatePicker('returnDate')} style={styles.modalInput}>
                  <Text style={{ color: fields.returnDate === DEFAULT ? '#aaa' : '#333' }}>
                    {fields.returnDate === DEFAULT ? 'Select Date' : fields.returnDate}
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
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalAdd}
        onRequestClose={() => setModalAdd(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Add Assets</Text>
            <Text style={{color:"red"}}>{error}</Text>
            <ScrollView>

              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Name</Text>
                <TextInput
                  style={[styles.modalInput,{paddingVertical:15}]}
                  value={fields.name}
                  onChangeText={(text) => handleChange('name', text)}
                />
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Type</Text>
                <TextInput
                  style={[styles.modalInput,{paddingVertical:15}]}
                  value={fields.type}
                  onChangeText={(text) => handleChange('type', text)}
                />
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Given On</Text>
                <TouchableOpacity onPress={() => showDatePicker('givenOn')} style={styles.modalInput}>
                  <Text style={{ color: !fields.givenOn  ? '#aaa' : '#333' ,padding:10}}>
                    {!fields.givenOn  ? 'Select Date' : fields.givenOn}
                  </Text>
                </TouchableOpacity>
              </View> 
            </ScrollView>
            <TouchableOpacity style={styles.saveButton} onPress={handleAddSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={()=>setModalAdd(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
 
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },
  box:{
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 20,
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
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12, 
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
  picker: {
    borderWidth: 1,
    borderColor: 'rgb(217, 217, 217)',
    borderRadius: 5,
    fontSize: 14,
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
