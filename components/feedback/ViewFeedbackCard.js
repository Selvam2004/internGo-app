import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View, 
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import Icon from "react-native-vector-icons/MaterialIcons";
  import FontAwesome from "react-native-vector-icons/FontAwesome"; 
  import { useNavigation } from "@react-navigation/native";

  const ViewFeedbackCard = ({ interaction }) => { 
    const [details, setDetails] = useState(interaction);
 
    useEffect(() => { 
      
      setDetails({
        name: interaction.name,
        assignedIntern: interaction.assignedIntern,
        assignedMentor: interaction.assignedMentor,
        assignedInterviewer: interaction.assignedInterviewer,
        date: interaction.date?.split("T")[0],
        time: interaction.time,
        duration: interaction.duration,
        interactionStatus: interaction.interactionStatus,
      }); 
    }, [interaction]);
    const navigation = useNavigation();
    const handleNavigate = ()=>{
      navigation.navigate('View Feedback',{
        id:interaction.id
      })
    }
  
    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={handleNavigate}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>

            <Text style={styles.title}>{details.name}</Text>
          </View>
          <View
              style={[
                styles.statusDot, styles.greenDot 
              ]}
            ></View>
        </View>
  
        <View style={styles.namesContainer}>
          <View style={styles.nameItem}>
            <Text style={styles.label}>Intern</Text>
            <Text style={styles.value}>{details.assignedIntern}</Text>
          </View>
          <View style={styles.nameItem}>
            <Text style={styles.label}>Mentor</Text>
            <Text style={styles.value}>{details.assignedMentor}</Text>
          </View>
          <View style={styles.nameItem}>
            <Text style={styles.label}>Interviewer</Text>
            <Text style={styles.value}>{details.assignedInterviewer}</Text>
          </View>
        </View>  
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Icon name="access-time" size={16} />
            <Text style={styles.detailText}>{details.time}</Text>
          </View>
          <View style={styles.detailItem}>
            <FontAwesome name="calendar" size={16} />
            <Text style={styles.detailText}>{details.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="timer" size={16}  />
            <Text style={styles.detailText}>{details.duration}</Text>
          </View>
        </View> 
        </TouchableOpacity>
      </View>
    );
  };
  export default ViewFeedbackCard;
  
  const styles = StyleSheet.create({
    card: {
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
      margin: 10,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      margin: 4,
      marginRight: 8,
    },
    greenDot: {
      backgroundColor: "green",
    }, 
    namesContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    nameItem: {
      alignItems: "center",
      flex: 1,
    },
    label: {
      fontSize: 12,
      fontWeight: "600",
      color: "#777",
      marginBottom: 2,
    },
    value: {
      fontSize: 14,
      fontWeight: "500",
      color: "#333",
    },
    detailsContainer: {
      flexDirection: "row",
      justifyContent: "space-between", 
    },
    detailItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    detailText: {
      paddingLeft: 5,
      fontSize: 14,
      color: "#555",
    }   
  });
  