import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView , ActivityIndicator} from 'react-native' 
import React, { useState } from 'react' 
import { axiosInstance } from '../../utils/axiosInstance'; 
import Toast from 'react-native-toast-message';
const ForgotPassword = ({navigation}) => { 
    const [loading, setLoading] = useState(false); 
    const [email,setEmail] = useState('')

    const showToast = (state,message) => {     
        Toast.show({
          type: state,  
          text1: "Forgot Password",
          text2: message,
          position: "top",   
          swipeable:true,
          visibilityTime:1500, 
        });
      };
 
    const handleSubmit = ()=>{
         if(!email){
            showToast('error',"*Please enter your email");
        }
        else if(!/^[a-zA-Z0-9._%+-]+@(?:finestcoder\.com|codingmart\.com)$/.test(email)){
            showToast('error',"*Please enter valid email");
        } 
        else{ 
            forgotpassword();
        }
    }
    const forgotpassword = async()=>{ 
        try{   
            setLoading(true);   
            const response = await axiosInstance.post('/api/auth/forgot-password',{ 
                email:email 
            });  
            if(response){ 
                showToast('success','Please check your email to change password!')
                setTimeout(()=>{
                    navigation.navigate('login')
                },1000)
            } 
        }
        catch(err){  
            const msg = JSON.stringify(err.response?.data?.message)||"Something went wrong";
            showToast('error',msg);             
        }
        finally {
            setLoading(false);  
        }
    }
 
  return (
    <>
        <View style={{flex:1,justifyContent:'center',paddingHorizontal:40 }}>

    <KeyboardAvoidingView behavior='padding' style={Styles.container}>
        
        <View style={Styles.heading}>
         <Text style={{fontWeight:"bold",fontSize:24}}>Forgot Password</Text>
        </View> 
        <View style={Styles.userName}>
            <Text style={{fontSize:16 }}>Email:</Text>
            <TextInput style={Styles.loginInp} placeholder='Enter your Email' value={email} onChangeText={(text)=>setEmail(text)} />
        </View> 
        <View style={Styles.loginBtn}>
            <TouchableOpacity onPress={handleSubmit}>
                <Text style={Styles.btnText}>Submit</Text>
            </TouchableOpacity>
        </View> 
       <View>
       <TouchableOpacity onPress={()=>navigation.navigate('login')}>
        <Text style={[Styles.bottom,{marginBottom:20}]} >Already have an account?<Text style={{color:"blue"}}> Click Here</Text></Text>
        </TouchableOpacity>
       </View>  

            {loading && (
                <View style={Styles.loadingContainer}> 
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={Styles.loadingText}>Submitting...</Text>
                </View>
            )}
        
    </KeyboardAvoidingView>
    <Toast/>
    </View>
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
        marginBottom:10,
        marginHorizontal:'auto', 
    },
    userName:{
        marginTop:10, 
    }, 
    loginInp:{
        marginTop:15, 
        borderWidth:2,
        borderColor:'gray',
        borderRadius:10,
        padding:10
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
    }

})

export default ForgotPassword