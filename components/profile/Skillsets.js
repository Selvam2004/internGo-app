import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { axiosInstance } from '../../utils/axiosInstance';
import Toast from 'react-native-toast-message';

export default function Skillsets({edit,user,fetchUser}) {
    const role = useSelector((state) => state.auth.data?.data.role);
    const [isModalVisible, setModalVisible] = useState(false); 
    const [addSkill, setAddSkill] = useState(""); 
    const [skill,setSkill] = useState(user.skills||[]);
    useEffect(()=>{
        if(user){
            setSkill(user.skills||[]);
        }
    },[user])

    const showToast = (state, message) => {
      Toast.show({
        type: state,
        text1: 'Skills update',
        text2: message,
        position: 'top',
        swipeable: true,
        visibilityTime: 1500,
      });
    };

    const handleSave =  ()=>{
      if(addSkill.trim()==''){
        if(skill.length<user.skills?.length){
          handleSubmit(skill);
        }
        else{
          showToast('error','Please enter the skill');
        }        
      }
      else if(!/^[a-zA-Z\s]+$/.test(addSkill)){
        showToast('error','Please enter valid skill');
      }
      else if(skill.includes(addSkill)){
        showToast('error','Skill already added');
      }
      else{ 
        handleSubmit([...skill,addSkill.trim()]); 
      }
    } 
    const handleSubmit=async(skill)=>{
        try{ 
            const response = await axiosInstance.patch(`/api/users/update/${user.id}`, {
                skills:[...skill]
              } ); 
              if(response){
                fetchUser();
                setModalVisible(false);
                setAddSkill("");
              }
        }
        catch(err){
          const msg = JSON.stringify(err?.response?.data?.message)||'Skill not updated.Try again later';
          showToast('error',msg);
        } 
    }
    const handleRemove = (text)=>{
        const newSkills = skill.filter(skl=>skl!=text);
        setSkill(newSkills);
    }
  return (
    <View style={styles.container}>

      <View style={styles.headerRow}>
        <Text style={styles.heading}>Skills</Text>
        <TouchableOpacity
          style={[
            styles.editButton,
            { flexDirection: 'row', display: role === 'Admins' ? (edit ? '' : 'none') : '' },
          ]}
          onPress={()=>setModalVisible(true)}
        >
          <Icon name="edit" style={styles.editIcon} size={18} color="white" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {(user.skills&&user.skills.length>0)?<View style={{flexDirection:'row',flexWrap:'wrap'}}>
        {user.skills.map((skl,i)=>{
            return (
                <View key={i} style={styles.batch}><Text>{skl}</Text></View>
            )
        })}
      </View>:<View style={[styles.box,{alignItems:'center'}]}><Text>No Skills to display</Text></View>}

        <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Toast/>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Add Skills</Text>
            <View>   
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Skill name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={addSkill}
                  onChangeText={(text) => setAddSkill(text)}
                />
              </View>  
            </View>
            {skill&& <View style={{flexDirection:'row',flexWrap:'wrap'}}>
        {skill.map((skl,i)=>{
            return (
                <TouchableOpacity key={i} onPress={()=>handleRemove(skl)}>
                <View style={styles.batch}>
                    <Text>{skl}</Text>
                    <Text style={styles.cancel}>x</Text>
                </View>
                </TouchableOpacity>
            )
        })}
      </View>}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={()=>setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  )
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
      cancel:{
        position:'absolute',
        right:-5,
        top:-5,
        borderRadius:100,
        backgroundColor:'red', 
        paddingHorizontal:6,
        padding:2,
        fontSize:10
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
      box: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      },
      batch:{
        padding:10,
        borderRadius:10,
        backgroundColor:'skyblue',
        elevation:10,
        shadowColor:'gray',
        shadowOffset:{width:2,height:2},
        shadowRadius:5,
        margin:5
      }
})