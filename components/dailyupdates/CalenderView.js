import { View, Text, StyleSheet, Dimensions, Touchable, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars'; 

export default function CalendarScreen({selectedDate,handleSelect}) {
  
  const tomorrow = new Date(); 
  tomorrow.setDate(new Date().getDate()+1); 
 
  return (
    <View style={styles.container}> 
      <Calendar
        style={styles.calendar}      
        dayComponent={({ date, state }) => {
          return (
            <TouchableOpacity onPress={()=>{ 
              if(state!="disabled"){
                handleSelect(date.dateString)
              }
            }}>
            <View style={styles.dayContainer}>
              <Text
                style={[
                  styles.dayText,
                  state === 'disabled' && styles.disabledText,
                  date.dateString === selectedDate && styles.selectedText
                ]}
              >
                {date.day}
              </Text>
            </View>
            </TouchableOpacity>
          );
        }}
        minDate='2024-09-16'
        maxDate= {tomorrow.toISOString().split('T')[0]}
      /> 
    </View>
  );
}

const { width ,height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { 
    flex: 1,  
    justifyContent: 'center'  
  },
  calendar: { 
    width: width , 
    height: height ,   
  },
  dayContainer: { 
    width: 52,  
    height: 100, 
    justifyContent: 'center',
    alignItems: 'center',   
  },
  dayText: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#2d4150' 
  },
  disabledText: { color: '#d9e1e8' },
  selectedText: { color: '#ffffff', backgroundColor: '#007AFF', borderRadius: 8, padding: 15 }, 
});

