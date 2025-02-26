import { View, Text, StyleSheet, TextInput,  ActivityIndicator , TouchableOpacity, KeyboardAvoidingView, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { axiosInstance } from '../../utils/axiosInstance';
import Icon from 'react-native-vector-icons/Feather'
import Toast from 'react-native-toast-message'; 
import OtpVerify from './OtpVerify';
const SignUpCard = ({navigation}) => {
    const [loading, setLoading] = useState(false); 
    const [passwordVisible, setPasswordVisisble] = useState(false);
    const [passwordVisible2, setPasswordVisisble2] = useState(false);
    const [visible,setVisible] = useState(false);
    const [user,setUser] = useState({
        name:"",
        email:"",
        password:"",
        confirmPassword:""
    })
    const [verifyEmail,setVerifyEmail] = useState('');
    const handleChange = (name,text)=>{
        setUser((prev)=>({
            ...prev,
            [name]:text
        }))
    }

    const showToast = (state,message) => {     
        Toast.show({
          type: state,  
          text1: "Sign Up",
          text2: message,
          position: "top",   
          swipeable:true,
          visibilityTime:1500, 
        });
      };

    const handleSubmit = ()=>{  
        
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!user.name){
            showToast('error',"*Please enter your name");
        }
        else if((user.name.length<4)||(!/^[a-zA-Z\s]+$/.test(user.name))){
            showToast('error',"*Please enter valid name");
        }
        else if(!user.email){
            showToast('error',"*Please enter your email");
        }
        else if(!/^[a-z][a-z0-9.]+@(?:finestcoder\.com)$/.test(user.email)){
            showToast('error',"*Please enter official email");
        }
        else if(!user.password){
            showToast('error',"*Please enter password");
        }
        else if(!passwordRegex.test(user.password)){
            showToast('error',"*Please enter strong password");
        }
        else if(!user.confirmPassword){
            showToast('error',"*Please enter confirm password");
        }
        else if(user.confirmPassword!==user.password){
            showToast('error',"*Password didn't match");
        }
        else{
            register(); 
        }
    }

    const register = async()=>{
        try{ 
            setLoading(true)
            const response = await axiosInstance.post('/api/auth/send-otp',{
                name:user.name.trim(),
                email:user.email.trim(),
                password:user.password
            });
            
            if(response.data){ 
                setVerifyEmail(user.email);
                setVisible(true);
            } 
        }
        catch(err){             
            showToast('error',JSON.stringify(err.response?.data?.message)||'User not registered'); 
        }
        finally{
            setLoading(false);
        }
    }

  return (
    <>
    <KeyboardAvoidingView behavior='padding' style={Styles.container}>
        <View style={Styles.heading}>
         <Text style={{fontWeight:"bold",fontSize:24}}>SignUp</Text>
        </View> 
        <View style={Styles.userName}>
            <Text style={{fontSize:16 }}>Name:</Text>
            <TextInput style={Styles.loginInp} placeholder='Enter your Name' value={user.name} onChangeText={(text)=>handleChange('name',text)}/>
        </View>
        <View style={Styles.userName}>
            <Text style={{fontSize:16 }}>Email:</Text>
            <TextInput style={Styles.loginInp} placeholder='Enter your Email' autoCapitalize='none' value={user.email} onChangeText={(text)=>handleChange('email',text)}/>
        </View>
        <View style={Styles.password}>
            <Text style={{fontSize:16}}>Password:</Text>
            <View style={[Styles.loginInp,{flexDirection:'row',justifyContent:'space-between', alignItems:'center',paddingHorizontal:5}]}>
                <TextInput placeholder='Enter your Password'  value={user.password} onChangeText={(text)=>handleChange('password',text)} secureTextEntry={!passwordVisible}/>
                <TouchableOpacity onPress={()=>setPasswordVisisble(!passwordVisible)}>{passwordVisible?<Icon name='eye' style={{paddingRight:10}} size={15}/>:<Icon name='eye-off' style={{paddingRight:10}} size={15}/>}</TouchableOpacity>
            </View>
        </View>
        <View style={Styles.password}>
            <Text style={{fontSize:16}}>Confirm Password:</Text>
            <View style={[Styles.loginInp,{flexDirection:'row',justifyContent:'space-between', alignItems:'center',paddingHorizontal:5}]}>
            <TextInput placeholder='Confirm your Password'  value={user.confirmPassword} onChangeText={(text)=>handleChange('confirmPassword',text)} secureTextEntry={!passwordVisible2}/>
            <TouchableOpacity onPress={()=>setPasswordVisisble2(!passwordVisible2)}>{passwordVisible2?<Icon name='eye' style={{paddingRight:10}} size={15}/>:<Icon name='eye-off' style={{paddingRight:10}} size={15}/>}</TouchableOpacity>
            </View>
        </View>
        <View style={Styles.loginBtn}>
            <TouchableOpacity onPress={handleSubmit}>
                <Text style={Styles.btnText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
       <View>
         <TouchableOpacity onPress={()=>navigation.navigate('login')}>
         <Text style={[Styles.bottom,{marginBottom:20}]}>Already have an Account?<Text style={{color:"blue"}}> Click Here</Text></Text>
         </TouchableOpacity>
       </View>  

       {loading && (
                <View style={Styles.loadingContainer}> 
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={Styles.loadingText}>Signing up...</Text>
                </View>
        )}

    </KeyboardAvoidingView>
    <Toast/>
    <OtpVerify email={verifyEmail} navigation={navigation} visible={visible} setVisible={setVisible}/>
    </>
  )
}

const Styles = StyleSheet.create({
    container:{ 
        padding:20, 
        borderRadius:10, 
        elevation:20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        backgroundColor: '#fff', 
    },
    heading:{ 
        marginTop:20 , 
        marginBottom:20,
        marginHorizontal:'auto', 
    },
    userName:{
        marginTop:5, 
    },
    password:{
        marginTop:20
    },
    loginInp:{
        marginTop:15, 
        borderWidth:2,
        borderColor:'gray',
        borderRadius:10,
        padding:5,
        paddingVertical:10
    },
    loginBtn:{
        marginTop:20,   
        marginHorizontal:"auto", 
        backgroundColor:"cornflowerblue", 
        width: 150, 
        borderRadius:20, 
    },
    btnText:{
        textAlign:'center',
        padding:15, 
        fontWeight:'bold',
        color:'white'
    },
    bottom:{ 
        textAlign:'center',
        marginTop:20
    }, 
    error:{
        color:'red',
        textAlign:'center'
    },
    loadingContainer: {
        position: 'absolute',
        flexDirection:'row',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        zIndex: 1,  
    },
    loadingText: { 
        padding:5,
        fontSize: 16,
        color: '#000',  
    }, 

})

export default SignUpCard