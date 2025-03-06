import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from "react-native";
import React, { useEffect  } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-native-gesture-handler'
import { useDispatch ,useSelector} from 'react-redux'
import { logout } from '../../redux/reducers/AuthSlice';
import Logo from '../../assets/internGo.png';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer'
import Profile from '../User/Profile';
import DailyUpdate from '../User/DailyUpdate'; 
import Interactions from '../User/Interactions';
import CreatePlan from '../Admin/CreatePlan';
import InteractionSchedule from '../Admin/InteractionSchedule'
import EditInteractions from '../Admin/EditInteraction'
import InteractionsToTake from '../Mentor/InteractionToTake' 
import CreateAnnouncement from '../Admin/CreateAnnouncement'; 
import NoPermission from '../User/NoPermission';
import Icon from 'react-native-vector-icons/MaterialIcons';  
import Resources from '../Admin/Resources'; 
import FA from 'react-native-vector-icons/FontAwesome5'; 
import EP from 'react-native-vector-icons/Entypo';
import MI from 'react-native-vector-icons/MaterialIcons';
import AD from 'react-native-vector-icons/AntDesign'; 
import InternHome from '../User/InternHome'; 
import { axiosInstance } from '../../utils/axiosInstance';
import ViewDailyUpdates from '../Admin/ViewDailyUpdates';
import { useNavigation } from '@react-navigation/native';
import socket from '../../utils/socket';
import { addNotification,  addAnnouncement, fetchNotifications, fetchAnnouncements } from '../../redux/reducers/NotificationSlice';
import AddUsers from '../Admin/AddUsers'; 
import Toast from 'react-native-toast-message';
import Analytics from '../Admin/Analytics';
import { fetchMentors } from '../../redux/reducers/MentorSlice';
import { fetchFilters } from '../../redux/reducers/FilterSlice';
import MentorHome from '../Mentor/MentorHome';
import AdminHome from '../Admin/AdminHome';
import Help from '../User/Help';
import PendingTickets from '../Admin/PendingTickets';
import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";

 

export default function DashBoard( ) {
  const dispatch = useDispatch();   
  const datas= useSelector(state=>state.auth.data?.data?.permissions);  
  const id= useSelector(state=>state.auth.data?.data?.userId);   
  const role= useSelector(state=>state.auth.data?.data?.role);  
  const permission = datas || null;
  const navigation = useNavigation(); 
  const handleLogOut = ()=>{
    dispatch(logout());
  }
  const Drawer = createDrawerNavigator()
  const badgeCount = useSelector(state => state.notifications?.badge) || 0;
  

  useEffect(() => {   
    socket.connect();
    socket.on("connect", () => { 
      socket.emit("join", {userId:id});
    });

    socket.on("notification", (data) => { 
      const dt = data.createdNotification;
      const newNotification = {
        id: dt.id,
        message: dt.message,
        type: dt.type?.split("-")[0] + " " + dt.type?.split("-")[1],
        timestamp: new Date(dt.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        isRead: dt.isRead,
      };
      showToast(newNotification.type,newNotification.message) 
      dispatch(addNotification(newNotification))
    });
    
    socket.on("announcement",(data)=>{
      const msg = data?.createdNotification?.message;
      showToast('Announcement',msg)       
      dispatch(addAnnouncement(msg));
    })

    socket.on("disconnect", () => {
      console.log("Socket disconnected. Attempting to reconnect...");
    });

    return () => {
      socket.off("connect");
      socket.off("notification");
      socket.off("disconnect");    
      socket.off('announcement')
      socket.disconnect()
    };
  }, [id]); 
 
  const showToast = (type,message) => {     
    Toast.show({
      type: 'info',  
      text1: type,
      text2: message,
      position: "top",  
      swipeable:true,
      visibilityTime:1500, 
    });
  }; 
  

  useEffect(()=>{  
    dispatch(fetchNotifications(id)); 
    dispatch(fetchAnnouncements()); 
    dispatch(fetchMentors());
    if (role == 'Admins') {      
      dispatch(fetchFilters());
    }
  }, [])
  
  const handleNotification = ()=>{  
    navigation.navigate('Notifications')
  }

   useEffect(() => {
     createNotificationChannel();  
     requestUserPermission();
     getFcmToken();  
   }, []); 
  
  const getFcmToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("fcmToken");
      if (storedToken) {
        return;
      }

      const token = await messaging().getToken();
      if (token) {  
        await axiosInstance.post(`/api/notifications/registerFCM`, {
          userId: id,
          fcmToken:token
        })
        await AsyncStorage.setItem("fcmToken", token);
      }
    } catch (error) {
      console.error("Error getting FCM Token:", error);
    }
  };

  const tabs = [
    {
      label: 'Home',
      name: 'InternHome',
      permission: 'tasks.update',
      component: InternHome,
      icon:EP,
      iconlabel:'home'
    },
    {
      label: 'Home',
      name: 'MentorHome',
      permission: 'feedback.create',
      component: MentorHome,
      icon:EP,
      iconlabel:'home'
    },
    {
      label: 'Home',
      name: 'AdminHome',
      permission: 'users.manage',
      component: AdminHome,
      icon:EP,
      iconlabel:'home'
    },
    {
      label: 'Profile',
      name: 'Profile',
      permission: 'profile.update',
      component: Profile,
      icon:EP,
      iconlabel:'user', 
    },
    {
      label: 'Daily Update',
      name: 'Daily Update',
      permission: 'tasks.update',
      component: DailyUpdate,
      icon:FA,
      iconlabel:'list-ul'
    }, 
    {
      label: 'Create Plan',
      name: 'Create Plan',
      permission: 'plans.create',
      component: CreatePlan,
      icon:FA,
      iconlabel:'sitemap'
    },
    {
      label: 'Daily Updates',
      name: 'View Daily Update',
      permission: 'users.manage',
      component: ViewDailyUpdates,
      icon:FA,
      iconlabel:'list-ul'
    },
    {
      label: 'Resources',
      name: 'Resources',
      permission: 'users.manage',
      component: Resources,
      icon:FA,
      iconlabel:'users'
    },
    {
      label: 'Add Users',
      name: 'AddUsers',
      permission: 'users.manage',
      component: AddUsers,
      icon:EP,
      iconlabel:'add-user', 
    },
    {
      label:'Schedule',
      name: 'Schedule',
      permission: 'interactions.schedule',
      component: InteractionSchedule,
      icon:MI,
      iconlabel:'pending-actions'
    }, 
    {
      label: 'Interactions',
      name: 'Interactions',
      permission: 'tasks.update',
      component: Interactions,
      icon:AD,
      iconlabel:'calendar' 
    },
    {
      label: 'Interactions',
      name: 'InteractionsToTake',
      permission: 'feedback.create',
      component: InteractionsToTake,
      icon:AD,
      iconlabel:'calendar' 
    },
    {
      label: 'Interactions',
      name: 'EditInteractions',
      permission: 'interactions.schedule',
      component: EditInteractions,
      icon:AD,
      iconlabel:'calendar' 
    },
    {
      label: 'Analytics',
      name: 'PerformanceAnalytics',
      permission: 'feedback.view',
      component: Analytics,
      icon:EP,
      iconlabel:'bar-graph'
    }, 
    {
      label: 'Create Announcement',
      name: 'Create Announcement',
      permission: 'plans.create',
      component: CreateAnnouncement,
      icon:AD,
      iconlabel:'notification'
    }, 
    {
      label: 'Help',
      name: 'Help',
      permission: 'tasks.update',
      component: Help,
      icon:MI,
      iconlabel:'help'
    }, 
    {
      label: 'Pending Requests',
      name: 'Pending tickets',
      permission: 'users.manage',
      component: PendingTickets,
      icon:MI,
      iconlabel:'pending'
    }, 
    {
      label: 'Pending Requests',
      name: 'Pending tickets for mentor',
      permission: 'feedback.create',
      component: PendingTickets,
      icon:MI,
      iconlabel:'pending'
    }, 
  ] 

  return (
    <>
    
     <Drawer.Navigator screenOptions={{
      headerTitle: () => (
      <Image
        source={Logo}
        style={{ width: 120, height: 120 }} 
        resizeMode='contain'
      />
       
    ) , 
    headerRight:()=>(
      <View style={{marginRight:20}}>
      <TouchableOpacity onPress={handleNotification} style={styles.iconContainer}>
        <Icon name="notifications" size={30} color="#000" />
        {badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
          
        )}
      </TouchableOpacity> 
      
    </View>
    )
  }}  
  
  drawerContent={ (props) => (
      <DrawerContentScrollView {...props}>
        
      <View style={styles.drawerHeader}> 
        <Text style={styles.menuTitle}>DashBoard</Text>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
    )}>
 
      {Array.isArray(permission) && permission.length>0 ? tabs.map((tab, id) => {
        return (
          permission.includes(tab.permission) && (
            <Drawer.Screen name={tab.name} component={tab.component} key={id} options={{
              drawerLabel: () => (
                <DrawerItem label={tab.label} iconlabel={tab.iconlabel} icon={tab.icon} name={tab.name} />
              ),
            }} />
          )
        );
      }):<Drawer.Screen name='Blank' component={NoPermission}/>} 
      
     </Drawer.Navigator> 
     <Toast/>
   
     </>
  )
}

const DrawerItem = ({ icon: IconComponent, iconlabel,label }) => {
  return (
    <View style={{flexDirection:'row'}}>
      {IconComponent&&<IconComponent  name={iconlabel} size={20} style={{marginLeft:10}}/>}
      <Text style={{marginLeft:20}}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20, 
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 15,
    backgroundColor: '#ff4d4d',
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    right: -6,  
    top: -4,  
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
})


const createNotificationChannel = () => {
  PushNotification.createChannel(
    {
      channelId: "fcm_default_channel", 
      channelName: "Default Channel", 
      importance: 4, 
      vibrate: true,
      soundName: "interngo.mp3", 
      playSound: true,
    } 
  );
};


  const requestUserPermission = async () => {
    if (Platform.OS === "android") {
      if (Platform.Version >= 33) { 
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );  
      } else {
        await messaging().requestPermission(); 
      }
    }
  };




    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      //console.log("Message handled in the background!", remoteMessage); 
    }); 