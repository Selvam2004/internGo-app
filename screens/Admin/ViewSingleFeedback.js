import React, { useEffect, useState } from 'react';
import {
  View,
  Text, 
  ScrollView, 
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Rating } from 'react-native-ratings';  
import ErrorPage from '../../components/error/Error';
import { axiosInstance } from '../../utils/axiosInstance';
import SpiderChart from '../../components/feedback/spiderGraph';


export default function ViewSingleFeedback({route}) {
  const id = route.params.id;    
  const [feedback, setFeedback] = useState({});
  const [description, setDescription] = useState('');   
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
      const response = await axiosInstance.get(`api/feedbacks/interaction/${id}`);
      if(response){
        const data = response?.data?.data[0]; 
        setDescription(data.descriptive_feedback)
        setFeedback(data.ratings)
        setAvg(data.avg_rating)  
      }
    }
    catch(err){
      setError(true);    
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
            {error?<ErrorPage onRetry={fetchInteraction}/>:
      loading?<View style={{height:500,justifyContent:'center',flexDirection:'row',alignItems:'center'}}><ActivityIndicator/><Text style={{fontWeight:'600',textAlign:'center'}}>Loading...</Text></View>:
     <View> 
       <SpiderChart data={feedback}/>

        <View style={styles.card}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={styles.label}>Average Rating:</Text>
          <Rating
          type='star'
          ratingCount={5}
          imageSize={20}
          readonly
          startingValue={ avg?? 0}
          />
          </View> 
        </View>
        {Object.keys(feedback).length>0&&<View style={styles.card}>
          <Text style={styles.label}>Rating BreakDown:</Text> 
          {Object.keys(feedback).map((key,i)=>(
          <View key={i} style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
          <Text>{key}</Text>
          <Rating
          type='star'
          ratingCount={5}
          imageSize={20}
          readonly
          startingValue={ feedback[key]?? 0}
          />
          </View> 
          ))}
        </View>}

        <View style={styles.card}> 
          <Text style={styles.label}>Feedback:</Text>
          <Text style={{padding:5}}>{description}</Text> 
        </View>  
        </View>
      }
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
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
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
