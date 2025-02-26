import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Authentication/login';
import Logo from '../assets/internGo.png';
import { Dimensions, Image, View } from 'react-native';
import SignUp from '../screens/Authentication/signup'; 
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Protected from './protected/protected';
import ForgotPassword from '../screens/Authentication/ForgotPassword';


const Stack = createStackNavigator();

function Route() { 
  const width = Dimensions.get('window').width-30;
  const auth = useSelector((state) => state.auth.isAuthenticated);
  return (
    <NavigationContainer>
    <Stack.Navigator>
    {!auth ? (
      <>
      <Stack.Screen
          name="login"
          options={{
            headerTitle: () => (
             <View style={{width:width,alignItems:'center'}}> 
              <Image
                source={Logo}
                style={{ width: 120, height: 100 }}
                resizeMode="contain"
              />
              </View>
            ),
            headerLeft: null,
          }}
          component={Login}
        />
        <Stack.Screen
          name="signup"
          options={{
            headerTitle: () => (
              <View style={{width:width,alignItems:'center'}}> 
              <Image
                source={Logo}
                style={{ width: 120, height: 100 }}
                resizeMode="contain"
              />
              </View>
            ),
            headerLeft: null,
          }}
          component={SignUp}
        />
          <Stack.Screen
          name="forgotpassword"
          options={{
            headerTitle: () => (
              <View style={{width:width,alignItems:'center'}}> 
              <Image
                source={Logo}
                style={{ width: 120, height: 100 }}
                resizeMode="contain"
              />
              </View>
            ),
            headerLeft: null,
          }}
          component={ForgotPassword}
        />
        
      </>
    ) : (
      <>
      
      <Stack.Screen
        name="protected"
        options={{
          headerShown:false 
        }}
        component={Protected}
      />
      
      </>
    )}
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default Route