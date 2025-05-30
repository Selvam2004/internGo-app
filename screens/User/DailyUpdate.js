import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react';
import CalenderView from '../../components/dailyupdates/CalenderView'
import { useNavigation } from '@react-navigation/native';

export default function DailyUpdate() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const handleSelect = (date)=>{
    setSelectedDate(date)
    navigation.navigate('Task Update',{
      date:date
    })
  } 
  return (
    <View style={styles.container}>
      <CalenderView selectedDate={selectedDate} handleSelect={handleSelect}/>
    </View>
  )
}
const styles = StyleSheet.create({
  container:{ 
  }
})