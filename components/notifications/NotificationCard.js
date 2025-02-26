import { View, Text } from 'react-native'
import React from 'react'

export default function NotificationCard({ item }) {
  return (
    <View 
      style={{
        backgroundColor: item.isRead ? '#E0E0E0' : 'skyblue', 
        padding: 12,
        marginVertical: 6,
        borderRadius: 10,
      }}
    >
      <Text style={{fontWeight:'bold',fontSize:16}}>{item.type}</Text>
      <Text style={{ fontWeight: item.isRead ? 'normal' : '500', fontSize: 14 }}>
        {item.message}
      </Text>
      <Text style={{ fontSize: 10, color: 'gray', textAlign: 'right', marginTop: 5 }}>
        {item.timestamp}
      </Text> 
    </View>
  )
}