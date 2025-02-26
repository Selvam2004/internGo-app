import { View, Text, TextInput,StyleSheet, TouchableOpacity } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react' 
import { axiosInstance } from '../../utils/axiosInstance';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';

 const AddMilestone=forwardRef((props,ref)=>{
    const [valid, setValid] = useState("");
    const [showAddMilestoneCard, setShowAddMilestoneCard] = useState(false);
    const mentors = useSelector(state=>state.mentors?.mentors)?.map(val=>val.name)

    const [newMilestone, setNewMilestone] = useState({
        name: "", 
        mentorName: "",
        milestoneDays:0
      });

      const openMilestoneCard = () => {
        setNewMilestone({ name: "", milestoneDays: "", mentorName: "" });
        setValid("");
        setShowAddMilestoneCard(true);
      };

      useImperativeHandle(ref, () => ({
        openCard: () => openMilestoneCard(),
      }));



    const handleAddMilestone = () => {
        setValid("");         
        if (
          !newMilestone.name.trim() ||
          !newMilestone.milestoneDays.trim() ||
          !newMilestone.mentorName.trim()
        ) {
          setValid("Please enter all milestone details.");
          return;
        }
        handleSubmit();
        
      };
    const handleSubmit=async()=>{
        try{ 
            const response = await axiosInstance.post(`api/plans/${props.id}/create/milestone`,{
                name:newMilestone.name,
                mentorName:newMilestone.mentorName,
                milestoneDays:Number(newMilestone.milestoneDays)
            })
            if(response){    
                setShowAddMilestoneCard(false);
                props.fetchMilestone();
            }
        }
        catch(err){ 
          const msg = JSON.stringify(err.response?.data?.message)||"Milestone not added.Please try later";
          setValid(msg);
        } 
    }
  return (
    <>
    {showAddMilestoneCard&&
    <View style={styles.addMilestoneCard}>
            <Text style={styles.cardTitle}>Add Milestone</Text> 
            {valid&&<View><Text style={{display:valid?'':'none',color:'red'}}>{valid}</Text></View>}
            <TextInput 
                style={styles.cardInput}
                placeholder="Enter name"
                value={newMilestone.name}
                onChangeText={(text) =>
                  setNewMilestone({ ...newMilestone,name: text })
                }
              />               
              <TextInput 
              style={styles.cardInput}
              placeholder="Enter Days"
              value={newMilestone.milestoneDays}
              keyboardType="number-pad"
              onChangeText={(text) =>
                setNewMilestone({ ...newMilestone,milestoneDays: text })
              }
            />     
            <View style={[styles.cardInput,{padding:0}]}>       
             <Picker mode='dropdown'  selectedValue={newMilestone.mentorName} onValueChange={(text)=>setNewMilestone({ ...newMilestone,mentorName: text })}>
                <Picker.Item   label='Select mentor' value='' enabled={false} color="gray"/>
                {mentors.length>0&&mentors.map((mentor,id)=>(<Picker.Item key={id} label={mentor} value={mentor}/>))} 
              </Picker>
              </View>    
    
            <View style={styles.cardButtons}>
              <TouchableOpacity
                style={styles.cardButton}
                onPress={handleAddMilestone}
              >
                <Text style={styles.cardButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cardButtonCancel}
                onPress={() => setShowAddMilestoneCard(false)}
              >
                <Text style={styles.cardButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>}


    </>
  )
});

export default AddMilestone;

const styles = StyleSheet.create({
    addMilestoneCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        marginTop:10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
      },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
      },
      cardInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: "#fff",
      },
      cardButtons: { flexDirection: "row", justifyContent: "space-between" },
      cardButton: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
      },
      cardButtonCancel: {
        backgroundColor: "#dc3545",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
      },
      cardButtonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },

})