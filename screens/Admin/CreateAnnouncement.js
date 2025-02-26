import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { axiosInstance } from '../../utils/axiosInstance';

export default function CreateAnnouncement() {
  const [announcement, setAnnouncement] = useState('');
  
  const showToast = (state, message) => {
    Toast.show({
      type: state,
      text1: 'Announcement',
      text2: message,
      position: 'top',
      swipeable: true,
      visibilityTime: 1500,
    });
  };

  const handleSubmit = async() => {
    if (!announcement.trim()) {
      showToast('error', 'Please enter an announcement message!');
      return;
    }
    try{
      const response = await axiosInstance.post(`api/notifications/createAnnouncement`,{
        message:announcement
      })
      if(response){ 
      showToast('success', 'Announcement Created Successfully! ✅'); 
      setAnnouncement('');
      }
    }
    catch(err){ 
      const message = err?.response?.data?.message||'Announcement not created';
      showToast('error', message);
    }  


  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create Announcement</Text>
 
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Announcement:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter announcement message..."
          multiline
          value={announcement}
          onChangeText={setAnnouncement}
        />
      </View>
 
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Announcement</Text>
      </TouchableOpacity>

      <Toast />
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
