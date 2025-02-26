import { View  } from 'react-native';
import React, { useEffect, useState }  from 'react'; 
import NotificationCard from '../../components/notifications/NotificationCard';
import { useDispatch, useSelector } from 'react-redux';
import { markAsRead, removeNotification } from '../../redux/reducers/NotificationSlice';
import { Text } from 'react-native';
import { axiosInstance } from '../../utils/axiosInstance';
import { SwipeListView } from 'react-native-swipe-list-view';


export default function Notification() { 
  const {userId} = useSelector(state=>state.auth.data?.data);
  const dispatch = useDispatch();
  let noti = useSelector(state=>state.notifications.notifications)||[]; 
  const [notifications,setNotifications] = useState(noti);
  useEffect(()=>{
    setNotifications(noti);
  },[noti])
  useEffect(()=>{
    return ()=>{
      markRead();
      dispatch(markAsRead())
    }
  },[]) 
  const markRead = async()=>{
    try{
      await axiosInstance.patch(`api/notifications/${userId}/markAllAsRead`);
    }
    catch(err){
      console.log(err.response.data?.message);      
    }
  } 
  const handleClear = async(id)=>{    
    dispatch(removeNotification(id)); 
    try{ 
      await axiosInstance.delete(`api/notifications/delete`,{
        data:{
          notificationIds:[Number(id)]
        }
      }); 
    }
    catch(err){ 
      console.log(err?.response?.data?.message);      
    }
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
<SwipeListView
      data={notifications}      
      ListEmptyComponent={
        <View style={{ height: 500, justifyContent: "center" }}>
          <Text style={{ textAlign: "center", fontWeight: "600" }}>Notifications Empty</Text>
        </View>
      }
      keyExtractor={(item) => item.id.toString()}
      renderItem={NotificationCard}
      renderHiddenItem={renderHidden}
      leftOpenValue={360} 
      onSwipeValueChange={(swipeData) => { 
        const { key, value } = swipeData;
        if (value > 360) { 
          handleClear(key);
        }
      }}
      disableLeftSwipe  
      swipeToOpenPercent={10} 
      showsVerticalScrollIndicator={false}
    />
    </View>
  );
}


const renderHidden = ()=>{
  return <View></View>
}