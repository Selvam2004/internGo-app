import React from "react";
import { ScrollView, View, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

const PerformanceChart = ({ data }) => {   
  const formattedData = Object.entries(data).map(([key, value], index) => ({
    value: Math.max(1, Math.min(10, Number(value) * 2)),  
    label: key, 
  }));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ width: Math.max(screenWidth, formattedData.length * 100), padding: 10 }}>
        <LineChart
          data={formattedData}
          width={Math.max(screenWidth, formattedData.length * 100)}
          height={300}
          isAnimated
          xAxisColor="black"
          yAxisColor="black"
          yAxisLabelWidth={40}
          maxValue={11}
          xAxisLabelTextStyle={{ fontSize: 12, color: "black"}} 
          yAxisTextStyle={{ fontSize: 12, color: "black" }}
          color={"#007BFF"}
          dashWidth={50}
          thickness={3} 
          showVerticalLines 
          yAxisOffset={0}
          stepValue={1} 
          spacing={80}
          curved
        />
      </View>
    </ScrollView>
  );
};

export default PerformanceChart;
