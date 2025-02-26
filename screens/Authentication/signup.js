import { View, Text } from 'react-native'
import React from 'react'
import SignUpCard from '../../components/auth/SignUpCard'
 

const SignUp = ({navigation}) => {
  return (
    <View style={{flex:1,justifyContent:'center',paddingHorizontal:40 }}>
      <SignUpCard navigation={navigation}/>
    </View>
  )
}

export default SignUp