import React from "react";
import { StyleSheet,  View } from "react-native";
import { RadarChart } from "@salmonco/react-native-radar-chart";

const SpiderChart = ({data}) => {
  const points =  [];
  Object.entries(data).forEach(element=>{
    points.push({label:element[0],value:element[1]})
  }) 

  return (
    <View style={styles.container}>
      <RadarChart
        data={points}
        maxValue={5} 
        fillColor="white"
        stroke={["black", "black","black","black", "black"]} 
        divisionStrokeWidth={1}
        divisionStroke="black"
        labelColor="black"
        labelFontSize={10}
        dataFillColor="rgba(34, 150, 243, 0.3)" 
        dataStroke="blue"
        dataStrokeWidth={2}  
        scale={0.9}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", 
  },
});

export default SpiderChart;
