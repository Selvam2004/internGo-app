import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import React, { useCallback,  useState } from "react";
import CreateCard from "../../components/plans/CreateCard";
import Plans from "../../components/plans/Plans"; 
import { axiosInstance } from "../../utils/axiosInstance";
import ErrorPage from "../User/Error";
import { useFocusEffect } from "@react-navigation/native";


export default function CreatePlan() { 
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [plans,setPlans] = useState([]);

  const fetchPlans  = async()=>{
    try{
      setLoading(true);
      setError("");  
      const response = await axiosInstance.get('/api/plans')
      if(response){ 
        setPlans(response.data.data);
      }
    }
    catch(err){ 
      setError(err.response);
    }
    finally{
      setLoading(false);
    }
  }
  useFocusEffect(
    useCallback(() => { 
      fetchPlans();
    }, [])
  ); 
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {loading?(
                <View style={styles.loadingContainer}> 
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>loading...</Text>
                </View>
             ):
      error?<ErrorPage onRetry={fetchPlans}/>:
      <View>
      <Text style={styles.heading}>Create</Text>
      <CreateCard  fetchPlans={fetchPlans}/>
      <Plans plan={plans}/>
      </View>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex:1,
    padding:20
  },
  heading: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom:10
  },
  loadingContainer: {
    position: 'absolute',
    flexDirection:'row',
    top: 300,
    left:120,
    justifyContent: 'center',
    alignItems: 'center', 
    zIndex: 1,  
},
loadingText: { 
    padding:5,
    fontSize: 16,
    color: '#000',  
}
});
