import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal,  ActivityIndicator } from "react-native";
import React, { useState, useRef } from "react";
import Toast from "react-native-toast-message";
import { axiosInstance } from "../../utils/axiosInstance";

const OtpVerify = ({navigation, email  ,visible, setVisible }) => {
  const [otp, setOtp] = useState(["", "", "", ""]); 
  const [loading,setLoading] = useState(false);
  const inputsRef = useRef([]);

  const showToast = (state,message) => {     
    Toast.show({
      type: state,  
      text1: "OTP verification",
      text2: message,
      position: "top",   
      swipeable:true,
      visibilityTime:1500, 
    });
  };

  const handleChange = (text, index) => {
    if (/^\d?$/.test(text)) {
      let newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp); 
      if (text && index < 3) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleBackspace = (index) => {
    if (index > 0 && !otp[index]) {
      let newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 4) {
      submitOtp(enteredOtp); 
    } else {
      showToast('error',"Please enter a 4-digit OTP");
    }
  };

  const submitOtp = async(otp)=>{
    try{ 
        setLoading(true) 
        const response = await axiosInstance.post('/api/auth/verify-otp',{
            email:email,
            otp:otp
        });
        
        if(response.data){  
            setVisible(false)
            navigation.navigate('login');             
        } 
    }
    catch(err){ 
        showToast('error',JSON.stringify(err.response?.data?.message)||'OTP verification failed'); 
    }
    finally{
        setLoading(false);
    }
  }

  return (
     <>
    <Modal transparent animationType="slide" visible={visible} onRequestClose={() => setVisible(false)}>
     
        <View style={styles.modal}>
            <Toast/> 
            <View style={styles.modalContent}>
              <Text style={styles.title}>Verify OTP</Text>
            {loading?<ActivityIndicator size={50}/>:<>
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputsRef.current[index] = ref)}
                    style={styles.otpBox}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === "Backspace") handleBackspace(index);
                    }}
                  />
                ))}
              </View>
              <View>
                <TouchableOpacity style={styles.button} onPress={handleVerify}>
                  <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity> 
              </View>
              </>}
            </View> 
        </View> 
    </Modal>    
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff", 
    borderRadius: 10,
    width:'100%',
    alignItems: "center", 
    padding: 20,
    paddingBottom:50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "#007BFF",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  }, 
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    paddingHorizontal:20,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
  }, 
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default OtpVerify;
