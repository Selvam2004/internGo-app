import {
  View,
  Text, 
  TouchableOpacity,
  ScrollView,
  StyleSheet, 
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import EditPlan from "../../components/plans/EditPlan";
import AddMilestone from "../../components/plans/AddMilestone";
import ErrorPage from "../User/Error";
import { axiosInstance } from "../../utils/axiosInstance";
import Milestones from "../../components/plans/Milestones";

export default function PlanDetails({ route }) {
  const { id } = route.params;
  const [milestones, setMilestones] = useState([]);
  const addMilestoneRef = useRef(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(false); 

  const fetchMilestone = async()=>{
    try{
      setError(false)
      const response = await axiosInstance.get(`/api/plans/${id}`);
      if(response){
        const res = response.data?.data?.milestones; 
        setMilestones(res);
      }
    }
    catch(err){ 
      setError(true);
    }
    finally{
      setLoading(false);
    }
  }
  useEffect(()=>{
   setLoading(true);
   fetchMilestone();
  },[])



  return (
    <>
    {
      error?<ErrorPage onRetry={fetchMilestone}/>: 
    <View style={styles.container}>
      <ScrollView style={{padding:5}} showsVerticalScrollIndicator={false} >
      <EditPlan id={id} />
      <TouchableOpacity onPress={() => addMilestoneRef.current?.openCard()}>
      <View style={styles.addButton}>
        <Icon name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add Milestone</Text>
      </View>
     </TouchableOpacity>

     <AddMilestone id={id} fetchMilestone={fetchMilestone} ref={addMilestoneRef}/>

      {
      loading?<View><Text style={{textAlign:'center',margin:50}}>Loading...</Text></View>:

      

        <Milestones id={id} milestones={milestones}/>
         
      }
      </ScrollView>
      

    </View>
    }
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f9f9f9" },
  


  addButton: {
    backgroundColor: "#007bff",
    padding: 12,
    marginBottom:20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  }, 
  
});
