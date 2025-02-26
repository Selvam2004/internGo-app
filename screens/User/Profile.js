import { View, Text, StyleSheet , ScrollView, ActivityIndicator} from 'react-native'
import React, { useEffect, useState } from 'react'
import Intro from '../../components/profile/Intro'
import PersonalDetails from '../../components/profile/PersonalDetails'
import CompanyDetails from '../../components/profile/CompanyDetails'
import { useSelector } from 'react-redux'
import { axiosInstance } from '../../utils/axiosInstance'
import ErrorPage from './Error'
import ProgressBarCard from '../../components/profile/ProgressBar'
import EducationalDetails from '../../components/profile/EducationalDetails'
import AssetDetails from '../../components/profile/AssetDetails'
import BankDetails from '../../components/profile/BankDetails'
import AddressDetails from '../../components/profile/AddressDetails'
import Skillsets from '../../components/profile/Skillsets'


export default function Profile() {
  const {userId, role,token} = useSelector((state)=> state.auth.data?.data);   
  const [currentUser,setCurrentUser] = useState(''); 
  const [error,setError] = useState(false); 
  const [loading,setLoading] = useState(false); 
 
  const fetchUser = async()=>{
    try{      
      setError(false); 
      const response = await axiosInstance.get(`/api/users/${userId}`);  
       if(response.data.data){
        setCurrentUser(response.data.data);   
       }
    }
    catch(error){ 
      setError(true)
    }
    finally{
      setLoading(false);
    }

  } 
  useEffect(()=>{
    setLoading(true);
    fetchUser();
  },[])
  useEffect(()=>{
    setProps({...props,user:currentUser,edit:userId===currentUser.id});
  },[currentUser]);
  const [props,setProps] = useState({
    user: currentUser ,
    token: token,
    fetchUser: fetchUser , 
    edit: userId === currentUser.userId,
  });
  return (
    <ScrollView style={styles.container}>
      {error === false ?
       loading ?(
                <View style={styles.loadingContainer}> 
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>loading...</Text>
                </View>
             ):
      ( <View style={{paddingBottom:20}}>
          <Intro  {...props}/>
          {role=='Interns'&&<ProgressBarCard progress={currentUser.profilePercentage}/>}
          {role=='Interns'&&<Skillsets {...props}/>}
          <PersonalDetails  {...props}/>
          <AddressDetails {...props}/>
          {role!='Mentors'&&<EducationalDetails {...props}/>}
          {role=='Interns'&&<CompanyDetails  {...props} />}
          {role=='Interns'&& <BankDetails {...props}/>}
          {role=='Interns'&&<AssetDetails {...props} assets={currentUser.assets}/>}
        </View>
      ) : (
        <ErrorPage onRetry={fetchUser} />
      )} 
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{
    paddingHorizontal: 20,
    marginTop:10
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
})