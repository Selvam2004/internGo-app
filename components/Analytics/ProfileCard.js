import React from 'react';
import { View, Text, Image, StyleSheet,   TouchableHighlight } from 'react-native'; 
import { useNavigation } from '@react-navigation/native'; 
import Profile from '../../assets/profile.png';


const ProfileCard = ({user}) => {  
  const navigation = useNavigation();  
  const handleNavigate = ()=>{
    navigation.navigate('Analytics',{
      user:user
    })
  }
  return (
    <TouchableHighlight underlayColor={"lightgray"} onPress={handleNavigate}>
    <View style={styles.card}>
      <View style={{justifyContent:'center',width:'30%'}}>
    {user.profilePhoto?<Image source={{uri:user.profilePhoto}} style={styles.profileImage} />:
      <Image source={Profile} style={styles.profileImage} />}
      </View>
      <View style={[styles.detailsContainer,{width:"70%"}]}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={[styles.badge,{backgroundColor:user.status=="ACTIVE"?"green":"gray"}]}>{user.status||"IDLE"}</Text>
        </View>
        <Text style={[styles.detailText,{fontWeight:'bold'}]}>Employee ID: {user.employeeId||" N/A"}</Text>
        <Text style={[styles.detailText,{fontWeight:'bold'}]}>ZONE : <Text style={{color:user.zone=='GREEN ZONE'?'green':user.zone=='YELLOW ZONE'?'yellow':user.zone=='RED ZONE'?'red':'gray'}}>{user.zone|| "NO ZONE"} </Text></Text>
        <Text style={styles.detailText}>{user.email}</Text>
        <Text style={styles.detailText}>Designation : {user.designation||"N/A"}</Text>
        <Text style={styles.detailText}>{user.batch || "Batch N/A"} - {user?.year || "Batch N/A"} ({user?.plan?.name||'No plan'})</Text>
      </View>
    </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 15,
    marginHorizontal:10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    margin: 5,
  },
  header:{
    flexDirection:'row',
    justifyContent:'space-between'
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,  
    marginRight: 20, 
  },
  badge:{ 
    fontWeight: 'bold',
    fontSize: 8, 
    color:'white',
    borderRadius:10,
    padding:5,
    flex:12,
    textAlign:'center'
  },
  detailsContainer: {
    justifyContent: 'center',
  },
  name: {
    flex:26,
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 12,
    color: '#555',
  },
});

export default ProfileCard;