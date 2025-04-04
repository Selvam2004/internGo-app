import React from 'react';
import { View, Text, Image, StyleSheet,  TouchableHighlight } from 'react-native';   
import Profile from '../../assets/profile.png';

const ProfileCard = ({planStatus,selected,setSelected,user}) => {   
    const handleToggle = ()=>{ 
        const selectedArray = selected.includes(user.id)?
                                selected.filter(s=>s!=user.id):
                                [...selected,user.id] 
        setSelected(selectedArray)
    } 
  return (
    <TouchableHighlight underlayColor={"lightgray"} onPress={handleToggle}>
      <View
        style={[
          styles.card,
          {
            backgroundColor:
              planStatus == "Not Present"
                ? selected.includes(user.id)
                  ? "lightblue"
                  : "#fff"
                : selected.includes(user.id)
                ? "#ff8b72"
                : "#fff",
          },
        ]}
      >
        <View style={{ justifyContent: "center", width: "30%" }}>
          {user.profilePhoto ? (
            <Image
              source={{ uri: user.profilePhoto }}
              style={styles.profileImage}
            />
          ) : (
            <Image source={Profile} style={styles.profileImage} />
          )}
        </View>
        <View style={[styles.detailsContainer, { width: "65%" }]}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.name}>{user.name}</Text>
            <Text
              style={[
                styles.badge,
                { backgroundColor: user.status == "ACTIVE" ? "green" : "gray" },
              ]}
            >
              {user.status || "IDLE"}
            </Text>
          </View>
          <Text style={[styles.detailText, { fontWeight: "bold" }]}>
            Employee ID: {user.employeeId || " N/A"}
          </Text>
          <Text style={styles.detailText}>{user.email}</Text>
          <Text style={styles.detailText}>
            {user.designation || "Designation N/A"}
          </Text>
          <Text style={styles.detailText}>
            {user.batch || "Batch N/A"} {user.phase || "Phase N/A"}
          </Text>
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
    justifyContent:'space-between'
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
    flex:12,
    fontWeight: 'bold',
    fontSize:8, 
    color:'white',
    borderRadius:10,
    padding:5, 
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