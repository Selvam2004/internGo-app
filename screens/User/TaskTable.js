import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { axiosInstance } from '../../utils/axiosInstance'
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native-paper';

 

export default function TaskTable({route}) {
    const {date} = route.params;  
    const {userId} = useSelector(state=>state.auth.data?.data); 
     
    const [dailyTask, setDailyTask] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [initial,setInitial] = useState(false);
   

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate()+1); 
    const showButton = (today.toISOString().split('T')[0] == date) || (tomorrow.toISOString().split('T')[0] == date);
    const heading = [
      "Task Name",
      "Activities Planned",
      "Activities Completed",
      "Estimated Time",
      "Actual Time",
      "Status"
    ];


    const handleRowChange = (rowId, field, value) => {
      setDailyTask(
        dailyTask.map((t) =>
          t.id === rowId
            ? {
                ...t,
                [field]:value
              }
            : t
        )
      );
    };

    const showToast = (state,message) => {     
      Toast.show({
        type: state,  
        text1: "Daily update",
        text2: message,
        position: "top",  
        swipeable:true,
        visibilityTime:1500, 
      });
    }; 
  
    
    const handleAddRow = () => {
      setDailyTask(  [
                  ...dailyTask,
                  {
                    id:new Date().toISOString(), 
                    taskName:'',
                    activitiesPlanned:'',
                    activitiesCompleted:'',
                    estimatedTime:'',
                    actualTime:'',
                    taskProgress:'PENDING' 
                  },
                ] )
    };

    const handleDeleteRow = (rowId) => { 
      setDailyTask(dailyTask.filter((row) => row.id !== rowId));
      if(Number(rowId)){
         submitTaskDelete(rowId);
      }
  
    };
  
    const submitTaskDelete =  async(rowId)=>{
      try{ 
          await axiosInstance.delete(`/api/dailyUpdates/delete/${rowId}`)
      }
      catch(err){
        console.log(err.response.data)
      }
    }

    const fetchDailyTask = async()=>{
      try{ 
        const response = await axiosInstance.get(`/api/dailyUpdates/${userId}?date=${date}`);
        if(response){
          setDailyTask(response.data.data?.tasks||[])  
        } 
      }
      catch(err){
        setError(JSON.stringify(err.response.data?.message)||'Error retrieving task Details.Try again later') 
      }
      finally{
        setLoading(false);
        setInitial(false);
      }
    }
    useEffect(()=>{
      setLoading(true);
      setInitial(true);
      fetchDailyTask()
    },[])

    const handleSave =()=>{
      setError("");
      if(validate()){          
        const tasks = convertTask(); 
        handleSubmitTask(tasks);
      }
    }

    const validate = ()=>{
      let err= ''
      dailyTask?.forEach((field) => {
        if (
          field.taskName?.trim() == "" || 
          field.activitiesPlanned?.trim() == ""||
          field.estimatedTime == ""||  
          field.estimatedTime == "0"
        ) {
          
          err="*Please fill necessary fields to save"; 
        }
      });
      if(err){
        setError(err)
        return false
      }
      dailyTask.forEach((task) => {
        if ((Number(task.estimatedTime) && Number(task.estimatedTime) > 3) || 
            (Number(task.actualTime) && Number(task.actualTime) > 3)) {
          err = "*Time should not exceed 3 hours";
        }
      });
      dailyTask.forEach((task) => {
        if ((!/^(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*(),\s]+$/.test(task.taskName)) || 
           (!/^(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*(),\s]+$/.test(task.activitiesPlanned))) {
          err = "*Enter valid name and description";
        }
      });      
      
      if(err){
        setError(err)
        return false
      }
      else{
        return true
      }      
    }

    const convertTask = ()=>{
      let tasks = [];
      tasks = dailyTask.map(d=>{ 
        const newTask={}
        newTask.taskData = {
          taskName:d.taskName,
          activitiesPlanned:d.activitiesPlanned,
          activitiesCompleted:d.activitiesCompleted,
          estimatedTime:Number(d.estimatedTime),
          actualTime:Number(d.actualTime),
          taskProgress:d.taskProgress||'PENDING'
        }
        if(Number(d.id)){
          newTask.taskId=d.id
        }
        return newTask
      })

      return tasks;
    }

    const handleSubmitTask = async(tasks)=>{
      try{
        setLoading(true);
        const response = await axiosInstance.post(`/api/dailyUpdates/${userId}/create`,{
          date:date,
          tasks:tasks
        })
        if(response){
          showToast('success','Task updated successfully!');
          fetchDailyTask();
        }
      }
      catch(err){
        showToast('error','Task not updated'); 
      }
      finally{
        setLoading(false);
      }
    }

  return (
    <ScrollView  style={styles.container}>
      <Text style={styles.heading}>{new Date(date).toDateString()} Updates</Text>
      <View  style={styles.tableBox}>
            {error && (
                  <Text style={{ color: "red" }}>{error}</Text>
                 )}
           <ScrollView  horizontal showsHorizontalScrollIndicator={false}>
              <View >
                <View style={styles.headerRow}>
                  {heading.map((field) => (
                    <Text key={field} style={styles.headerText}>
                      {field}
                    </Text>
                  ))} 
                  {showButton&& <Text  style={styles.headerText}>
                       Delete
                    </Text>}
                </View>                

                  { 
                 !initial&&dailyTask.length>0&&
                  dailyTask.map((row) => (
                    <View key={row.id} style={styles.row}>
                      <TextInput
                        style={styles.input}
                        value={row.taskName}
                        placeholder="Task Name"
                        onChangeText={(text) =>
                          handleRowChange( row.id, "taskName", text)
                        } 
                        editable={showButton }
                        multiline
                      />
                      <TextInput
                        style={styles.input}
                        value={row.activitiesPlanned}
                        placeholder="Activities Planned"
                        onChangeText={(text) =>
                          handleRowChange( 
                            row.id,
                            "activitiesPlanned",
                            text
                          )
                        } 
                        editable={showButton }
                        multiline
                      />
                      <TextInput
                        style={styles.input}
                        value={row.activitiesCompleted}
                        placeholder="Activities Completed"
                        onChangeText={(text) =>
                          handleRowChange( 
                            row.id,
                            "activitiesCompleted",
                            text
                          )
                        } 
                        editable={showButton }
                        multiline
                      />
                       <TextInput
                        style={styles.input}
                        value={row.estimatedTime?.toString()}
                        placeholder="Estimated time"
                        onChangeText={(text) =>
                          handleRowChange( 
                            row.id,
                            "estimatedTime",
                            text
                          )
                        } 
                        keyboardType='numeric'
                        editable={showButton }
                        multiline
                      /> 
                       <TextInput
                        style={styles.input}
                        value={row.actualTime?.toString()}
                        placeholder="actual time"
                        onChangeText={(text) =>
                          handleRowChange( 
                            row.id,
                            "actualTime",
                            text
                          )
                        } 
                        keyboardType='numeric'
                        editable={showButton }
                        multiline
                      />  
                      <View style={styles.input}>
                        <Picker     
                          selectedValue={row.taskProgress}
                          onValueChange={(text) =>
                            handleRowChange( 
                              row.id,
                              "taskProgress",
                              text
                            )
                          }
                           style={{ flex: 1 , height: "100%" ,color:row.taskProgress=='PENDING'?'red':'green'}}
                           enabled={showButton}
                        >
                          <Picker.Item label="PENDING" value="PENDING" />
                          <Picker.Item label="COMPLETED" value="COMPLETED" />
                        </Picker>
                      </View>
 
                       {showButton&& <TouchableOpacity
                          style={styles.delete}
                          onPress={() => handleDeleteRow(row.id)}
                        >
                          <View style={{ flex: 1, justifyContent: "center" }}>
                            <Text style={{ textAlign: "center" }}>
                              <Icon name="close" color="red" size={24} /> 
                            </Text>
                          </View>
                        </TouchableOpacity> 
                        }
                    </View>
                  ))
                   }

              </View>
            </ScrollView>

           {initial?
                  <View style={{flexDirection:'row',justifyContent:'center',height:'100',alignItems:'center'}}>
                    <ActivityIndicator size={20}/>
                    <Text style={{textAlign:'center',fontWeight:'600'}}>  Loading...</Text>
                  </View>:dailyTask.length==0&&<View style={{height:100,justifyContent:'center'}}><Text style={{textAlign:'center'}}>No Tasks to Display</Text></View>}
          
          {showButton&& <View style={styles.footer}> 
                  <TouchableOpacity onPress={() => handleAddRow()}>
                    <View style={styles.addButton}>
                      <Icon name="add" size={20} color="#fff" />
                      <Text style={styles.addButtonText}> Add Row </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity disabled={loading} onPress={handleSave}>
                    <View
                      style={[styles.addButton, { backgroundColor: loading?'lightgreen':"green" }]}
                    >
                      <Text style={styles.addButtonText}> Save Changes </Text>
                    </View>
                  </TouchableOpacity> 
            </View>
            }
      </View>
            <Toast/>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container:{
    padding:10,
  },
  tableBox: {
    marginBottom: 40,
    padding: 5,
    paddingVertical:15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, 
  },
  heading:{
    fontSize:20,
    fontWeight:'bold', 
    padding:20
  },   
  row: {
    flexDirection: "row",
    alignItems: "center",  
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    paddingVertical: 8,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  headerText: {
    width: 150,
    paddingVertical:10,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: 150,
    height: "100%",
    borderWidth: 1, 
    borderColor: "#ccc",  
    marginVertical:9,
    textAlign: "center", 
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 5,
    margin: 5,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  delete: {
    width: 150,
    height: "100%",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc", 
  },
});