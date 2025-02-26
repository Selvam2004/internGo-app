import { View, Text } from 'react-native'
import React from 'react'
import LoginCard from '../../components/auth/LoginCard'

const Login = ({navigation}) => {
  return (
    <View style={{flex:1,justifyContent:'center',paddingHorizontal:40 }}>
      <LoginCard navigation={navigation} />
    </View>
  )
}
 
export default Login