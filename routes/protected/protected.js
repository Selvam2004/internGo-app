import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import DashBoard from '../../screens/dashboard/DashBoard';  
import { useDispatch, useSelector } from 'react-redux';
import NoPermission from '../../screens/User/NoPermission';
import Profile from '../../screens/User/Profile';
import SpecificProfile from '../../screens/Admin/SpecificProfile';
import PlanDetails from '../../screens/Admin/PlanDetails';
import Icon from 'react-native-vector-icons/AntDesign'
import AddUsersPlan from '../../screens/Admin/AddUsersPlan';
import { useNavigation } from '@react-navigation/native';
import TaskTable from '../../screens/User/TaskTable';
import ViewUpdatesTable from '../../screens/Admin/ViewUpdatesTable';
import Notification from '../../screens/dashboard/Notification';
import GiveFeedback from '../../screens/Mentor/GiveFeedback';
import { axiosInstance } from '../../utils/axiosInstance';
import { clearAllNotifications } from '../../redux/reducers/NotificationSlice'; 
import EditSingleFeedback from '../../screens/Mentor/EditSingleFeedbackCard';
import ViewSingleFeedback from '../../screens/Admin/ViewSingleFeedback';
import SpecificAnalytics from '../../screens/Admin/SpecificAnalytics';

const tabs = [  
    {name : 'User',permission:'profile.update',component:Profile},
    {name : 'User Profile',permission:'profile.update',component:SpecificProfile}, 
    {name : 'Add Users',permission:'plans.create',component:AddUsersPlan}, 
    {name : 'Task Update' ,permission:'tasks.update',component:TaskTable},
    {name : 'Daily Updates' ,permission:'users.manage',component:ViewUpdatesTable},
    {name : 'Feedback' ,permission:'feedback.create',component:GiveFeedback},
    {name : 'Edit Feedback' ,permission:'feedback.create',component:EditSingleFeedback},
    {name : 'View Feedback' ,permission:'feedback.view',component:ViewSingleFeedback},
    {name : 'Analytics' ,permission:'feedback.view',component:SpecificAnalytics},
]

const Stack = createStackNavigator();
export default function Protected() {
  const data = useSelector(state=>state.auth.data?.data?.permissions); 
  const permission = data || null;
  return (
    <Stack.Navigator>
        <Stack.Screen name='dashboard' options={{headerShown:false}} component={DashBoard}/> 
        {Array.isArray(permission) && permission.length>0 ? <>{tabs.map((tab, id) => {
        return (
          permission.includes(tab.permission) && (
            <Stack.Screen name={tab.name} component={tab.component} key={id}  />
          )
        );
         })}
          {permission.includes("plans.create")&& <Stack.Screen name="Plan Details" options={({route})=>({headerRight:()=><AddUser id={route.params.id}/>})} component={PlanDetails} />}
         </>:<Stack.Screen name='Blank' component={NoPermission}/>} 
         <Stack.Screen options={{
          headerRight:()=>{
            return <ClearAll/>
          }
         }} name='Notifications' component={Notification}/>
    </Stack.Navigator>
  )
}

const ClearAll = ()=>{ 
  const userId = useSelector(state=>state.auth.data?.data?.userId); 
  const dispatch = useDispatch();
  const handleClear = async()=>{     
    try{
      dispatch(clearAllNotifications());
      await axiosInstance.delete(`api/notifications/${userId}/delete`);
    }
    catch(err){
      console.log(err?.response?.data?.message);      
    }
  }
  return (
    <>
    <TouchableHighlight underlayColor={"skyblue"}  style={styles.clear} onPress={handleClear}>
    <View style={{flexDirection:'row',alignItems:'center'}}>      
      <Text style={styles.clearText}>Clear All</Text> 
    </View>
    </TouchableHighlight>
    </>
  )
}

const AddUser = ({id})=>{
  const navigation = useNavigation();
  const handleNavigate =()=>{ 
    navigation.navigate('Add Users',{
      id:id
    })
  }
  return (
    <>
    <TouchableHighlight underlayColor={"skyblue"}  style={styles.container} onPress={handleNavigate}>
    <View style={{flexDirection:'row'}}>
      <Icon name="adduser" color={'white'} size={24}/>
      <Text style={styles.text}>Add</Text>
    </View>
    </TouchableHighlight>
    </>
  )
}

const styles = StyleSheet.create({
  container:{ 
    marginRight:20,
    borderRadius:10,
    backgroundColor: "#007BFF",
    padding:5,
  },
  clear:{
    marginRight:20,
    borderRadius:10,
    backgroundColor: "#007BFF",
    padding:5,
  },
  clearText:{
    padding:2,
    fontSize:15,
    color:'white'
  },
  text:{ 
    padding:2,
    fontSize:18,
    color:'white'
  }
})