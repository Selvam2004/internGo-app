import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Rating } from 'react-native-ratings';
import { Checkbox } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { axiosInstance } from '../../utils/axiosInstance';
import { useNavigation } from '@react-navigation/native';
import ErrorPage from '../../components/error/Error';

export default function EditSingleFeedback({route}) { 
  const interaction = route.params.interaction;  
    
  const [feedback, setFeedback] = useState({});
  const [feedbackId, setFeedbackId] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [description, setDescription] = useState('');
  const [showParameters, setShowParameters] = useState(true); 
  const showToast = (state,message) => {     
    Toast.show({
      type: state,  
      text1: "Feedback",
      text2: message,
      position: "bottom",  
      swipeable:true,
      visibilityTime:1000, 
    });
  }; 
  const parameters = [
    "Communication",
    "Learning Curve",
    "Understanding",
    "Capability",
    "Task Completion",
    "Requirement Gathering",
    "Coding Skill",
    "In-depth Knowledge",
    "Experience",
    "Problem Solving",
    "Presentation",
    "Code Quality",
    "Concepts",
    "Contribution",
    "Logical Thinking",
    "Technical Proficiency",
    "Project Presentation",
    "Scenario-Based Questions",
    "Documentation",
    "QA Evaluation",
    "Code Complexity"
  ];
 

  const toggleSelection = (param) => {
    setFeedback((prevFeedback) => {
      const updatedFeedback = { ...prevFeedback }; 
    if (updatedFeedback.hasOwnProperty(param)) {
      delete updatedFeedback[param]; 
    } else {
      updatedFeedback[param] = 0;
    }
    return updatedFeedback;
    });
  };

  const handleSubmitCheckboxes = () => { 
    if(Object.keys(feedback).length<5){
      showToast('error','You have to select atleast 5 parameters')
      return false;
    }
    setShowParameters(false);  
  };

  const updateRating = (param, rating) => {
    setFeedback((prevFeedback) =>
     ({
      ...prevFeedback,[param]:rating
     })
    );
  };

  const handleSubmitFeedback = () => {
    let err=false;
    Object.values(feedback).forEach(element=>{
      if(element==0){
        err=true;
      }
    })
    if(err){
      showToast('error',"*Please give ratings for all selected fields");
      return
    }
    else if(!description.trim()){
      showToast('error',"*Please give the overall feedback");
      return
    } 
    else{
      handleSubmit();
     }

  };
  const navigation = useNavigation();
  
  const handleSubmit =async ()=>{
    try{
      const response = await axiosInstance.put(`/api/feedbacks/${feedbackId}/update`,{
        interactionId: interaction?.id,
        internId: interaction?.internId,
        interviewerId: interaction?.interviewerId,
        ratings:feedback,
        descriptive_feedback: description,
      })
      if(response){
        showToast('success','Feedback updated successfully');
 
        setTimeout(()=>{
          navigation.navigate('dashboard',{
            screen:'InteractionsToTake'
          })
        },1000);
      }
    }
    catch(err){
      const message = err?.response?.data?.message||'Feedback not updated';
      console.log(message);
      showToast('error',message);         
    }
  }
  useEffect(()=>{
    fetchInteraction();
  },[])
  const fetchInteraction = async()=>{
    try{
      setError(false);
      setLoading(true);
      const response = await axiosInstance.get(`api/feedbacks/interaction/${interaction.id}`);
      if(response){
        const data = response?.data?.data[0];
        setDescription(data.descriptive_feedback);
        setFeedback(data.ratings)
        setFeedbackId(data.id);        
      }
    }
    catch(err){
      setError(true);
      console.log(err?.response?.data?.message);      
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      {error?<ErrorPage onRetry={fetchInteraction}/>:
      loading?<View style={{height:500,justifyContent:'center'}}><Text style={{fontWeight:'600',textAlign:'center'}}>Loading...</Text></View>:
      <View style={{marginBottom:15}}>
      {showParameters?<Text style={styles.label}>Select Parameters</Text>:<Text style={styles.title}>Give Feedback</Text>}
      
      {showParameters && (
        <View style={styles.card}>
          
          {parameters.map((param, index) => (
            <View key={index} style={styles.checkboxContainer}>
    <Checkbox
      status={feedback.hasOwnProperty(param) ? 'checked' : 'unchecked'}
      color='blue'
      onPress={() => toggleSelection(param)}
    />
    <Text>{param}</Text>
            </View>
          ))}
 
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitCheckboxes}>
            <Text style={styles.submitButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
 
      {!showParameters  && Object.keys(feedback).map((item, index) => (
        <View key={index} style={[styles.card,{flexDirection:'row',justifyContent:'space-between'}]}>
          <Text style={styles.label}>{item}</Text>
          <Rating
            type='star'
            ratingCount={5}
            imageSize={20}
            startingValue={feedback[item] ?? 0}
            jumpValue={0.5}
            fractions={1} 
            onFinishRating={(rating) => updateRating(item, rating)} 
          />
        </View>
      ))}
 
      {!showParameters   && (
        <View style={styles.card}>
          <Text style={styles.label}>Overall Description</Text>
          <TextInput
            placeholder="Enter your overall feedback..."
            value={description}
            onChangeText={(text) => setDescription(text)}
            style={styles.textInput}
            multiline
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitFeedback}>
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      )}
      <Toast/>
      </View>}
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
