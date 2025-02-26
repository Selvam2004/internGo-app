import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useRef, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { axiosInstance } from '../../utils/axiosInstance';
import Toast from "react-native-toast-message";
import Icon from 'react-native-vector-icons/Feather'

export default function AddUsers() { 
  const [loading, setLoading] = useState(false); 
  const [passwordVisible, setPasswordVisisble] = useState(false);

  const [fields, setFields] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Mentors',
  });

  const showToast = (state, message) => {
    Toast.show({
      type: state,
      text1: "User Management",
      text2: message,
      position: "top",
      swipeable: true,
      visibilityTime: 1500,
    });
  };

  const handleChange = (field, value) => {
    setFields({ ...fields, [field]: value });
  };

  const handleSave = async () => { 
    if (validate()) {
      setLoading(true);
      try {
        const response = await axiosInstance.post(`/api/auth/createUser`, fields);
        if (response) {
          showToast('success', 'User added successfully ✅');
          setFields({ name: '', email: '', password: '', role: 'Mentors' });
        }
      } catch (err) {
        const message = JSON.stringify(err?.response?.data?.message) || "User not added ❌";
        showToast('error', message);
      } finally {
        setLoading(false);
      }
    } 
  };

  const validate = () => {
    let err = "";
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!/^[a-z][a-z0-9._]+@(?:finestcoder\.com|codingmart\.com)$/.test(fields.email)) {
      err = "*Please enter a valid email";
    }
    if(!passwordRegex.test(fields.password)){
        err="*Please enter strong password";
    }
    Object.keys(fields).forEach(key => {
      if (fields[key].trim() === '') {
        err = "*Please enter all fields to submit";
      }
    });
    if (err) { 
      showToast('error',err)
      return false;
    }
    return true;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add New User</Text>
      <View style={styles.userContainer}> 

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name:</Text>
          <TextInput style={styles.input} placeholder='Enter name' onChangeText={(text) => handleChange('name', text)} value={fields.name} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput autoCapitalize='none'  style={styles.input} placeholder='Enter email' onChangeText={(text) => handleChange('email', text)} value={fields.email} />

        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password:</Text>
          <View style={[styles.input,{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:10}]}>
           <TextInput  placeholder='Enter password'  secureTextEntry={!passwordVisible} onChangeText={(text) => handleChange('password', text)} value={fields.password} />
           <TouchableOpacity onPress={()=>setPasswordVisisble(!passwordVisible)}>{passwordVisible?<Icon name='eye' style={{paddingRight:10}} size={15}/>:<Icon name='eye-off' style={{paddingRight:10}} size={15}/>}</TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Role:</Text>
          <View style={[styles.input,{padding:0}]}>
            <Picker mode='dropdown' selectedValue={fields.role} onValueChange={(text) => handleChange('role', text)}>
              <Picker.Item label='Intern' value='Interns' />
              <Picker.Item label='Mentor' value='Mentors' />
              <Picker.Item label='Admin' value='Admins' />
            </Picker>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity disabled={loading} onPress={handleSave}>
            <View style={[styles.button, loading && { backgroundColor: 'skyblue' }]}>
              <Text style={styles.buttonText}>Add User</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Toast />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  userContainer: {
    padding: 10,
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    marginVertical: 10,
    marginBottom: 40,
  },
  inputContainer: {
    padding: 20,
    paddingVertical: 10,
  },
  label: {
    fontWeight: '600',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    padding: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    borderRadius: 5,
    backgroundColor: '#1E90FF',
    padding: 10,
  },
  buttonText: {
    color: 'white',
    padding: 5,
  },
});
