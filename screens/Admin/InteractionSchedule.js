import { View, Text,StyleSheet ,TextInput, TouchableOpacity, ScrollView} from 'react-native'
import React, { useRef, useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { axiosInstance } from '../../utils/axiosInstance';
import Toast from "react-native-toast-message"; 
import { useSelector } from 'react-redux';


export default function InteractionSchedule() {
  const [error,setError] = useState(''); 
  const [loading,setLoading] = useState(false);
  const mentors = useSelector(state=>state.mentors?.mentors)?.map(val=>val.name)
  
  const scrollViewRef = useRef(null);
  const [isVisible,setIsVisible] = useState(
    {
      date:false,
      time:false
    }
  );
  const [fields,setFields] = useState({
    interactionName:'',
    internName:'',
    internEmail:'',
    mentorName:'',
    interviewer:'',
    date:'',
    time:'', 
    duration:''
  })

  const showToast = (state,message) => {     
    Toast.show({
      type: state,  
      text1: "Interaction Schedule",
      text2: message,
      position: "bottom",  
      swipeable:true,
      visibilityTime:1500, 
    });
  }; 

  const handleDateConfirm = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setFields({...fields,date:formattedDate});
    setIsVisible({...isVisible,date:false});
  };
  const handleTimeConfirm = (time) => {

    const formattedTime = time.toLocaleTimeString("en-GB",{ hour: "2-digit", minute: "2-digit" }); 
    setFields({...fields,time:formattedTime});
    setIsVisible({...isVisible,time:false});
  };

  const handleChange = (field,value)=>{
    setFields({...fields,[field]:value});
  }

  const handleSave =async ()=>{
    setError("");  
    if(validate()){
       setLoading(true);
       try{   
          
          const response = await axiosInstance.post(`/api/interactions/schedule`,{
            name:fields.interactionName,
            assignedIntern:fields.internName?.trim(),
            internEmail:fields.internEmail,
            assignedMentor:fields.mentorName,
            assignedInterviewer:fields.interviewer,
            date:fields.date,
            time:fields.time,
            duration:fields.duration
          })
          
          if(response){  
            showToast('success','Interaction scheduled successfully ✅')
            setFields({
              interactionName:'',
              internName:'',
              internEmail:'',
              mentorName:'Arshad',
              interviewer:'Arshad',
              date:'',
              time:'', 
              duration:''
            })
          }
       }
       catch(err){   
        const message = err?.response?.data?.message||"Interaction not scheduled ❌";         
        showToast('error',message)
       }
       finally{
        setLoading(false)
       }
    } 
    else{
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  }

  const validate = ()=>{
    let err="";
    if(!/^[a-z0-9.]+@(?:finestcoder\.com)$/.test(fields.internEmail)){
      err="*Please enter valid email"
    }
    Object.keys(fields).forEach(key=>{
      if(fields[key].trim()==''){
        err="*Please enter all fields to submit"
      }
    }) 

    if(err){ 
      setError(err);
      return false
    } 
   const selectedDate = new Date(fields.date);
   const [hour,minute] = fields.time?.split(':');
   selectedDate.setHours(hour,minute);
   const currentDate = new Date();
  
  if (selectedDate.toDateString() === currentDate.toDateString()) {
    if (selectedDate < currentDate) {
      setError( 'You cannot select a past time'); 
      return false
    }
  }
        
      return true 
    
  }

  return ( 
  
    <ScrollView  ref={scrollViewRef} style={styles.container}>
      
      <Text style={styles.header}>Schedule Interaction</Text>
      
      
      <View style={styles.interactionContainer}>
      
      
            {error&&<View><Text style={{color:'red'}}>{error}</Text></View>}
            
            <View style={styles.inputContainer}>
            <Text style={styles.label}>Interaction Topic:</Text>
            <TextInput style={[styles.input,{height:60,padding:20}]} placeholder='Enter interaction topic' onChangeText={(text)=>handleChange('interactionName',text)} value={fields.interactionName}/>
            </View>
            
            <View style={styles.inputContainer}>
            <Text style={styles.label}>Intern Name:</Text>
            <TextInput style={[styles.input,{height:60,padding:20}]} placeholder='Enter intern name' onChangeText={(text)=>handleChange('internName',text)} value={fields.internName}/>
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Intern Email:</Text>
            <TextInput style={[styles.input,{height:60,padding:20,}]} placeholder='Enter intern email' onChangeText={(text)=>handleChange('internEmail',text)} value={fields.internEmail}/>
            </View>
            
            <View style={styles.inputContainer}>
            <Text style={styles.label}>Mentor:</Text>
            <View style={styles.input}>
              <Picker mode='dropdown' selectedValue={fields.mentorName} onValueChange={(text)=>handleChange('mentorName',text)}>
              <Picker label='Select mentor' value='' enabled={false} color="gray"/>
                {mentors.length>0&&mentors.map((mentor,id)=>(<Picker.Item key={id} label={mentor} value={mentor}/>))} 
              </Picker>
            </View>
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>interviewer:</Text>
            <View style={styles.input}>
              <Picker mode='dropdown'  selectedValue={fields.interviewer} onValueChange={(text)=>handleChange('interviewer',text)}>
                <Picker label='Select interviewer' value='' enabled={false} color="gray"/>
                {mentors.length>0&&mentors.map((mentor,id)=>(<Picker.Item key={id} label={mentor} value={mentor}/>))} 
              </Picker>
            </View>
            </View>

            <View style={styles.inputContainer}>

            <Text style={styles.label}>Date:</Text>

            <TouchableOpacity onPress={()=>setIsVisible({...isVisible,date:true})}>
            <View style={{ height:55}}>
            <Text style={[styles.input,{flex:1, padding:15,textAlignVertical:'center'}]}>{fields.date||'Choose date'}</Text>
            </View>
            </TouchableOpacity>

            </View>
            
            
            <View style={styles.inputContainer}>

       <Text style={styles.label}>Time:</Text>

       <TouchableOpacity onPress={()=>setIsVisible({...isVisible,time:true})}>
        <View style={{ height:55}}>
          <Text style={[styles.input,{flex:1, padding:15,textAlignVertical:'center'}]}>{fields.time||'Choose time'}</Text>
        </View>
        </TouchableOpacity>

           </View>
 
           <View style={styles.inputContainer}>
            <Text style={styles.label}>Duration:</Text>
            <TextInput style={[styles.input,{height:60,padding:20,}]} placeholder='Enter Duration' onChangeText={(text)=>handleChange('duration',text)} value={fields.duration}/>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity disabled={loading} onPress={handleSave}>
            <View style={[styles.button,loading&&{backgroundColor:'skyblue'}]}>
              <Text style={styles.buttonText}>Schedule Interaction</Text>
            </View>
            </TouchableOpacity>
           </View> 
           <Toast/>
      </View>
      <DateTimePicker isVisible={isVisible.date} minimumDate={new Date()} mode='date' onConfirm={handleDateConfirm} onCancel={()=>setIsVisible({...isVisible,date:false})}/>
      <DateTimePicker isVisible={isVisible.time} is24Hour={true} mode='time' onConfirm={handleTimeConfirm} onCancel={()=>setIsVisible({...isVisible,time:false})}/>
    </ScrollView> 
  )
}
const styles = StyleSheet.create({
    container:{
    padding:20,  
    },
    header:{
    fontWeight:'bold',
    fontSize:20
    },
    interactionContainer:{
        padding:10,
        elevation:5,
        backgroundColor:'white',
        borderRadius:5,
        marginVertical:10,
        marginBottom:40,
    },
    inputContainer:{
      padding:20,
      paddingVertical:10
    },
    label:{
      fontWeight:'600',
      marginVertical:10
    },
    input:{
      borderWidth:1,
      borderColor:'lightgray',
      borderRadius:5,
    },
    buttonContainer:{
      flexDirection:'row',
      justifyContent:'center',
      padding:20
    },
    button:{ 
      borderRadius:5,
      backgroundColor:'#1E90FF',
      padding:10
    },
    buttonText:{
      color:'white',
      padding:5,
    }

})