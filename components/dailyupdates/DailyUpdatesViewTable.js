import { View, Text, StyleSheet,  ScrollView  } from 'react-native'
import React from 'react'

export default function DailyUpdatesViewTable({user,dailyTask}) {
    const heading = [
        "Task Name",
        "Activities Planned",
        "Activities Completed",
        "Estimated Time",
        "Actual Time",
        "Status"
      ];
  return (
    <View  style={styles.tableBox}>
          <Text style={styles.userName}>{user?.name}</Text> 
           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>                
                <View style={styles.headerRow}>
                  {heading.map((field) => (
                    <Text key={field} style={styles.headerText}>
                      {field}
                    </Text>
                  ))}  
                </View> 
                

                  { 
                  dailyTask.length>0&&
                  dailyTask.map((row) => (
                    <View key={row.id} style={styles.row}>
                      <Text style={styles.input}>{row.taskName}</Text>
                      <Text style={styles.input}>{row.activitiesPlanned}</Text>
                      <Text style={styles.input}>{row.activitiesCompleted}</Text>
                      <Text style={styles.input}>{row.estimatedTime}</Text>
                      <Text style={styles.input}>{row.actualTime}</Text>
                      <Text style={[styles.input,{color:row.taskProgress=='PENDING'?'red':'green',fontWeight:'600'}]}>{row.taskProgress}</Text>                       
  
                    </View>
                  ))
                   }

              </View>
            </ScrollView>

           {dailyTask.length==0&&<View style={{height:100,justifyContent:'center'}}><Text style={{textAlign:'center'}}>No Tasks to Display</Text></View>}
 
      </View> 
  )
}


const styles = StyleSheet.create({ 
    tableBox: {
      marginBottom: 20,
      padding: 5,
      paddingVertical:15,
      backgroundColor: "#fff",
      borderRadius: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    userName:{
      fontWeight:'bold',
      padding:10,
      fontSize:15
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
      marginVertical:10,
      textAlignVertical:'center',
      textAlign: "center", 
      backgroundColor: "#fff",
    }, 
  });