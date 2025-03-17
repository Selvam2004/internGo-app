import React, { useEffect, useState } from 'react';
import {
  View,
  Text, 
  ScrollView, 
  StyleSheet, 
} from 'react-native'; 
import ErrorPage from '../../components/error/Error';
import { axiosInstance } from '../../utils/axiosInstance'; 
import PerformanceChart from '../../components/Analytics/LineChart'; 
import InteractionAttendedCard from '../../components/Analytics/InteractionAttended';
import DownlodReport from '../../components/Analytics/DownlodReport';
import Toast from 'react-native-toast-message';
import { Rating } from 'react-native-ratings';

export default function SpecificAnalytics({route}) {
  const user = route.params.user;   
  const id = user.id; 
  
  const [feedback, setFeedback] = useState([]);
  const [interaction, setInteraction] = useState([]);  
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(false); 
  const [avg,setAvg] = useState(0); 
  useEffect(()=>{
    fetchInteraction();
  },[])
  const fetchInteraction = async()=>{
    try{
      setError(false);
      setLoading(true);
      const response = await axiosInstance.get(`api/feedbacks/intern/${id}`); 
      if(response){
        const data = response?.data?.data; 
        const dt = [];         
        data.forEach(fb => {
          dt.push({ [fb.interaction.name] : fb.avg_rating }) 
        });          
        setInteraction(data)
        setFeedback(dt)        
      }
    }
    catch(err){
      setError(true);           
    }
    finally{
      setLoading(false);
    }
  }

  const showToast = (state, message) => {
    Toast.show({
      type: state,
      text1: 'Download',
      text2: message,
      position: 'top',
      swipeable: true,
      visibilityTime: 1500,
    });
  };
  useEffect(()=>{
    const fb = feedback.map(f => {
      return Object.values(f)[0]
    })||[]; 
    let rating = fb?.reduce((acc, val) => acc + val, 0); 
    setAvg(rating/fb.length);
    
  },[feedback])
  return (
    <ScrollView style={styles.container}>
            {error?<ErrorPage onRetry={fetchInteraction}/>:
      loading?<View style={{height:500,justifyContent:'center'}}><Text style={{fontWeight:'600',textAlign:'center'}}>Loading...</Text></View>:
      Object.keys(feedback).length>0?<View style={{marginBottom:20}}> 
      <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
            color: "#000000",
            marginBottom: 10,
          }}
        >
          Performance Analysis
        </Text>
        <View>
       {Object.keys(feedback).length>0&&<PerformanceChart data={feedback}/>}
       </View> 

          <DownlodReport showToast={showToast} name={user.name} batch={user.batch} id={id}/>
        <View style={styles.card}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={styles.label}>Overall Rating:</Text>
          <Rating
          type='star'
          ratingCount={5}
          imageSize={20}
          readonly
          startingValue={ avg ?? 0}
          />
          </View> 
        </View>
       <View style={{marginTop:10}}> 
          <Text style={styles.label}>Interactions Attended:</Text> 
          {interaction.length>0&&interaction.map((intr,index)=>(<InteractionAttendedCard key={index} interaction={intr.interaction}/>))}
        </View>


        </View>:<View style={{height:600,justifyContent:'center'}}><Text style={{fontWeight:'600',textAlign:'center'}}>No Feedback available for Analysis</Text></View>
      }
      <Toast/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
    marginTop:15, 
    marginHorizontal:10
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    minHeight: 80,
    textAlignVertical: 'top',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});
