import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SwipeListView } from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/MaterialIcons";
import { axiosInstance } from "../../utils/axiosInstance";

export default function Plans({ plan }) {
  const [plans, setPlans] = useState(plan || []);
  const [message, setMessage] = useState({});
  const navigation = useNavigation();
  const listViewRef = useRef(null);

  useEffect(() => {
    setPlans(plan);
  }, [plan]);

  const handleNavigate = (id) => {
    navigation.navigate("Plan Details", { id });
  };

  const handleDelete = (id) => {
    listViewRef.current?.closeAllOpenRows();
    Alert.alert("Confirm", "Are you sure you want to delete?", [
      { text: "Cancel"  },
      {
        text: "Delete", 
        onPress: () => {
          submitDelete(id);
        },
      },
    ]);
  };


  const submitDelete = async(id)=>{
    try{
      const response = await axiosInstance.delete(`/api/plans/delete/${id}`) 
      if(response){
        const newList = plans.filter(itm=>itm.id!=id); 
        setPlans(newList);
        setMessage({
          color:'skyblue',
          message:"Plan deleted successfully"
        })
      }
    }
    catch(err){ 
      setMessage({
        color:'red',
        message:"failed to delete.Try again later"
      })
    }

  }
  const handleClose=()=>{
    setMessage({})
  }
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📚 Training Plans</Text>
      
     {Object.keys(message).length>0&& <View style={[styles.resp,{backgroundColor:message.color||"skyblue"}]}>
      <Text>Plan deleted successfully</Text>
      <TouchableOpacity onPress={handleClose}>
      <Icon name="close" size={20}  />
      </TouchableOpacity>
      </View>}

      <SwipeListView
        data={plans}
        ref={listViewRef}
        keyExtractor={(item) => item.id.toString()}

        renderItem={({ item }) => (
          <TouchableHighlight
            underlayColor={"lightgray"}
            activeOpacity={0.6}
            onPress={() => handleNavigate(item.id)}
            style={styles.cardContainer}
          >
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDays}>
                🗓️ Total Days:{" "}
                <Text style={styles.boldText}>{item.planDays}</Text>
              </Text>
              <Text
                style={styles.cardDescription}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {item.description}
              </Text>
            </View>
          </TouchableHighlight>
        )}

        renderHiddenItem={({ item }) => (
          <TouchableOpacity
            style={styles.deleteBox}
            onPress={() => handleDelete(item.id)}
          >
            <Icon name="delete" size={24} color="white" />
          </TouchableOpacity>
        )}
        
        rightOpenValue={-90} 
        scrollEnabled={false} 
        disableRightSwipe={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20, 
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
  },
  cardContainer: {
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 4,
  },
  cardDays: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 6,
  },
  boldText: {
    fontWeight: "bold",
    color: "#000",
  },
  cardDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  deleteBox: {
    backgroundColor: "red", 
    justifyContent:"center",
    alignItems: "flex-end",
    width: "90%",
    position:'absolute',
    right:0,
    height: "80%", 
    paddingRight:28,
    borderRadius: 12,  
    marginTop:3
  },
  resp:{
    padding:10,
    paddingHorizontal:20,
    width:"100%", 
    backgroundColor:'skyblue',
    borderRadius:10,
    marginVertical:10,
    flexDirection:'row',
    justifyContent:'space-between'
  }
});

