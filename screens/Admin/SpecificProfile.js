import { View, Text, StyleSheet ,Image, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native'
import React, { useEffect, useState } from 'react'
import Intro from '../../components/profile/Intro'
import PersonalDetails from '../../components/profile/PersonalDetails'
import CompanyDetails from '../../components/profile/CompanyDetails'
import { useSelector } from 'react-redux'
import { axiosInstance } from '../../utils/axiosInstance'
import ErrorPage from '../User/Error'
import ProgressBarCard from '../../components/profile/ProgressBar'
import AddressDetails from '../../components/profile/AddressDetails'
import EducationalDetails from '../../components/profile/EducationalDetails'
import BankDetails from '../../components/profile/BankDetails'
import AssetDetails from '../../components/profile/AssetDetails'
import Skillsets from '../../components/profile/Skillsets'


export default function SpecificProfile({route}) {
  const {userId} = route.params; 
  const {userId:id,token} = useSelector((state)=> state.auth.data?.data);   
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
  const props = {
    user: currentUser ,
    token: token,
    fetchUser: fetchUser , 
    edit: false,
  };
  return (
    <ScrollView style={styles.container}>
      {error === false ?
       loading ?(
                <View style={styles.loadingContainer}> 
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>loading...</Text>
                </View>
             ):
      ( <View>
          <Intro  {...props}/>
          <ProgressBarCard progress={currentUser.profilePercentage}/>
          <Skillsets {...props}/>
          <PersonalDetails  {...props}/>
          <AddressDetails {...props}/>
          <EducationalDetails {...props}/>
          <CompanyDetails  {...props} />
          <BankDetails {...props}/>
          <AssetDetails {...props} assets={currentUser.assets}/>
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