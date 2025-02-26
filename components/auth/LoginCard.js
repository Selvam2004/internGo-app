import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView , ActivityIndicator} from 'react-native' 
import React, {   useState } from 'react'
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../../redux/reducers/AuthSlice';
import { axiosInstance } from '../../utils/axiosInstance';
import Icon from 'react-native-vector-icons/Feather'
import Toast from 'react-native-toast-message';
const LoginCard = ({navigation}) => { 
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisisble] = useState(false);
    const [user,setUser] = useState({
        email:"",
        password:""
    })

    const showToast = (state,message) => {     
        Toast.show({
          type: state,  
          text1: "Login",
          text2: message,
          position: "top",   
          swipeable:true,
          visibilityTime:1500, 
        });
      };

    const dispatch = useDispatch();
    const handleChange = (name,text)=>{
        setUser((prev)=>({
            ...prev,
            [name]:text
        }))
    }
    const handleSubmit = ()=>{
         if(!user.email){
            showToast('error',"*Please enter your email");
        }
        else if(!/^[a-z][a-zA-Z0-9._+-]+@(?:finestcoder\.com|codingmart\.com)$/.test(user.email)){
            showToast('error',"*Please enter valid email");
        }
        else if(!user.password){
            showToast('error',"*Please enter password");
        } 
        else{ 
            login();
        }
    }
    const login = async()=>{ 
        try{   
            setLoading(true);  
            const response = await axiosInstance.post('/api/auth/signin',{ 
                email:user.email,
                password:user.password
            }); 
            if(response.data){ 
                const token = response.data.data?.token;
                if (token) {  
                    dispatch(loginAction(response.data));
                }
            } 
        }
        catch(err){ 
            const msg = JSON.stringify(err.response?.data?.message)||"Something went wrong while Signin";
            showToast('error',msg);             
        }
        finally {
            setLoading(false);  
        }
    }
 
  return (
    <>
    <KeyboardAvoidingView behavior='padding' style={Styles.container}>
        
        <View style={Styles.heading}>
         <Text style={{fontWeight:"bold",fontSize:24}}>Login</Text>
        </View> 
        <View style={Styles.userName}>
            <Text style={{fontSize:16 }}>Email:</Text>
            <TextInput style={Styles.loginInp}  autoCapitalize='none' placeholder='Enter your Email' value={user.email} onChangeText={(text)=>handleChange('email',text)} />
        </View>
        <View style={Styles.password}>
            <Text style={{fontSize:16}}>Password:</Text>
            <View style={[Styles.loginInp,{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:5}]}>
                <TextInput placeholder='Enter your Password'  value={user.password} onChangeText={(text)=>handleChange('password',text)} secureTextEntry={!passwordVisible}/>
                <TouchableOpacity onPress={()=>setPasswordVisisble(!passwordVisible)}>{passwordVisible?<Icon name='eye' style={{paddingRight:10}} size={15}/>:<Icon name='eye-off' style={{paddingRight:10}} size={15}/>}</TouchableOpacity>
            </View>
        </View>
        <View style={Styles.loginBtn}>
            <TouchableOpacity onPress={handleSubmit}>
                <Text style={Styles.btnText}>Login</Text>
            </TouchableOpacity>
        </View>
       <View>
       <TouchableOpacity onPress={()=>navigation.navigate('signup')}>
        <Text style={[Styles.bottom]} >Don't have an Account?<Text style={{color:"blue"}}> Click Here</Text></Text>
        </TouchableOpacity>
       </View>  
       <View>
       <TouchableOpacity onPress={()=>navigation.navigate('forgotpassword')}>
        <Text style={[Styles.bottom,{marginBottom:20}]} >Forgot Password?<Text style={{color:"blue"}}> Click Here</Text></Text>
        </TouchableOpacity>
       </View>  

            {loading && (
                <View style={Styles.loadingContainer}> 
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={Styles.loadingText}>Logging in...</Text>
                </View>
            )}
        
    </KeyboardAvoidingView>
    <Toast/>
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
        marginTop:10, 
    },
    password:{
        marginTop:20
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

export default LoginCard